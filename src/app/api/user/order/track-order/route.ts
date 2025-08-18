import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import { Order } from "@/models/order";
import { NextRequest, NextResponse } from "next/server";

// GET /api/user/order/track-order
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

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        {
          message: "Order ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const dbOrders = await Order.findOne({ orderId }).select(
      "orderId status isPlaced placedTime isAccepted acceptedTime isPrepared preparedTime isDelivered deliveredTime"
    );
    if (!dbOrders) {
      return NextResponse.json(
        {
          message: "Orders not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: dbOrders,
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
