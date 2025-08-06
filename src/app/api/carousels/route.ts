import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import { Carousel } from "@/models/carousel";
import { NextRequest, NextResponse } from "next/server";

// GET /api/carousels
export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }
    await connectDB();
    const carousels = await Carousel.find();
    return NextResponse.json(
      {
        success: true,
        data: carousels,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
