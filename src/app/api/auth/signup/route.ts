import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dayjs from "dayjs";

import connectDB from "@/config/db";
import User from "@/models/user";
import { generateOTP } from "@/libs/generateOTP";
import { sendSms } from "@/config/textlk/sendSms";
import { REGISTER_OTP_TEMPLATE } from "@/config/textlk/templates";

//  POST /api/auth/signup
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { username, mobile, email, password } = await req.json();

    // 1. Validate input
    if (!username || !email || !password || !mobile) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sriLankaMobileRegex = /^(?:\+94|0)?7[01245678]\d{7}$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address", success: false },
        { status: 400 }
      );
    }

    if (!sriLankaMobileRegex.test(mobile)) {
      return NextResponse.json(
        { message: "Invalid Sri Lankan mobile number", success: false },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Password must be at least 6 characters",
          success: false,
        },
        { status: 400 }
      );
    }

    // 2. Connect to DB
    await connectDB();

    // 3. Check for existing email & mobile separately
    const existingEmailUser = await User.findOne({
      email: email.toLowerCase(),
    });
    const existingMobileUser = await User.findOne({ mobile });

    // Case 1: Both email & mobile used by different verified users
    if (
      existingEmailUser?.isVerified &&
      existingMobileUser?.isVerified &&
      existingEmailUser._id.toString() !== existingMobileUser._id.toString()
    ) {
      return NextResponse.json(
        {
          message: "Email and mobile number already registered",
          success: false,
        },
        { status: 409 }
      );
    }

    // Case 2: Email used by a verified user
    if (existingEmailUser?.isVerified) {
      return NextResponse.json(
        { message: "Email already registered", success: false },
        { status: 409 }
      );
    }

    // Case 3: Mobile used by a verified user
    if (existingMobileUser?.isVerified) {
      return NextResponse.json(
        { message: "Mobile number already registered", success: false },
        { status: 409 }
      );
    }

    // 4. Reuse unverified user if exists (email or mobile)
    const reusableUser = existingEmailUser || existingMobileUser;

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP(5);
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (reusableUser) {
      // Update unverified user
      await User.updateOne(
        { _id: reusableUser._id },
        {
          name: username,
          email: email.toLowerCase(),
          mobile,
          password: hashedPassword,
          otp: hashedOtp,
          otpExpires: dayjs().add(10, "minute").toDate(),
        }
      );

      // Send Sms using text.lk
      const message = REGISTER_OTP_TEMPLATE(otp);
      await sendSms(reusableUser.mobile, message);

      return NextResponse.json(
        {
          message: "Account not verified. Please verify.",
          success: true,
          userId: reusableUser._id,
        },
        { status: 200 }
      );
    }

    // 5. Create new user
    const newUser = await User.create({
      name: username,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      isVerified: false,
      otp: hashedOtp,
      otpExpires: dayjs().add(10, "minute").toDate(),
    });

    // Send Sms using text.lk
    const message = REGISTER_OTP_TEMPLATE(otp);
    await sendSms(newUser.mobile, message);

    return NextResponse.json(
      {
        message: "Please verify your mobile number",
        success: true,
        userId: newUser._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
