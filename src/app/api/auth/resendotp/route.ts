import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dayjs from "dayjs";

import connectDB from "@/config/db";
import User from "@/models/user";
import { generateOTP } from "@/libs/generateOTP";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid request: please go back to login page",
          success: false,
        },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Mobile number is already verified", success: false },
        { status: 400 }
      );
    }

    // Check if OTP was already sent and not yet expired
    if (user.otpExpires && dayjs().isBefore(user.otpExpires)) {
      const remainingSeconds = dayjs(user.otpExpires).diff(dayjs(), "second");
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      return NextResponse.json(
        {
          message: `OTP already sent. Please wait ${minutes}m ${seconds}s to request again.`,
          waitTimeInSeconds: remainingSeconds,
          success: false,
        },
        { status: 400 }
      );
    }

    // Generate a new OTP
    const otp = generateOTP(5);
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.otp = hashedOTP;
    user.otpExpires = dayjs().add(10, "minute").toDate(); // 10 minutes
    await user.save();

    // TODO:Send OTP again

    return NextResponse.json(
      { message: "OTP re-sent successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message, success: false },
      { status: 500 }
    );
  }
};
