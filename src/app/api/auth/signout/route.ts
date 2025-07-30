import { NextRequest, NextResponse } from "next/server";

// GET /api/auth/signout
export const GET = async (req: NextRequest) => {
  try {
    const response = NextResponse.json(
      { message: "Logout successful", success: true },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message, success: false },
      { status: 500 }
    );
  }
};
