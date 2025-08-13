import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import { Order } from "@/models/order";
import { NextRequest, NextResponse } from "next/server";

// GET /api/user/order
export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized Access",
          success: false,
        },
        { status: 403 }
      );
    }
    await connectDB();

    const orders = await Order.find({ userId: user._id })
      .populate({
        path: "dishes.dish",
        select: "name price", // only return dish name
      })
      .populate({
        path: "addons.addon",
        select: "name price", // only return addon name
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        error: error.message,
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
};
