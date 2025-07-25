import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/config/db";
import User from "@/models/user";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { userId, otp } = await req.json();
    await connectDB();

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      _id: userId,
      otp: hashedOtp,
      otpExpires: { $gt: new Date() }, // Not expired
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.otp = ""; // Clear OTP
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Account verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
};
