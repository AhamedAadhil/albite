import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import connectDB from "@/config/db";
import User from "@/models/user";

import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/signin
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { mobile, password } = await req.json();

    // 1. Validate input
    if (!mobile || !password) {
      return NextResponse.json(
        { message: "Mobile and password are required.", success: false },
        { status: 400 }
      );
    }

    const sriLankaMobileRegex = /^(?:\+94|0)?7[01245678]\d{7}$/;
    if (!sriLankaMobileRegex.test(mobile)) {
      return NextResponse.json(
        { success: false, message: "Invalid Sri Lankan mobile number." },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Find user
    const user = await User.findOne({ mobile });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // 3. Check if verified
    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Account is not verified." },
        { status: 403 }
      );
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    // 5. Generate JWT (optional)
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        mobile: user.mobile,
        name: user.name,
        role: user.role || 0,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET! as string,
      { expiresIn: "7d" }
    );

    // 6. Return success + token
    const res = NextResponse.json(
      {
        success: true,
        message: `Welcome, ${user.name}!`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role || 0,
          isVerified: user.isVerified,
          token: token,
        },
      },
      { status: 200 }
    );
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
    return res;
  } catch (error: any) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};
