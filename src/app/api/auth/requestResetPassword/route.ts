import connectDB from "@/config/db";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendMail } from "@/config/nodemailer/nodemailer";
import { RESET_PASSWORD_TEMPLATE } from "@/config/nodemailer/templates";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    await connectDB();
    const { email } = await req.json();
    const dbUser = await User.findOne({ email: email.toLowerCase(), role: 0 });
    if (!dbUser) {
      return NextResponse.json(
        { message: "This email is not registered", success: false },
        { status: 404 }
      );
    }

    const buffer = crypto.randomBytes(32);
    const token = buffer.toString("hex");
    dbUser.resetPasswordToken = token;
    dbUser.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await dbUser.save();

    const resetUrl = `${process.env.FRONTEND_URL}/new-password?token=${token}`;

    await sendMail({
      to: dbUser.email,
      subject: "Password Reset Request",
      html: RESET_PASSWORD_TEMPLATE(resetUrl, dbUser.name),
    });

    return NextResponse.json(
      {
        message: "Password reset link sent to your email",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in requestResetPassword:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};
