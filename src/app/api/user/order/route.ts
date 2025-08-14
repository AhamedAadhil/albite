import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import { Order } from "@/models/order";
import User from "@/models/user";
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

// cancel order
// PATCH /api/user/order
export const PATCH = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized access",
          success: false,
        },
        { status: 401 }
      );
    }
    await connectDB();
    const { orderId, cancelReason } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        {
          message: "Order ID is required",
          success: false,
        },
        { status: 400 }
      );
    }
    const dbOrders = await User.findById(user._id).select("orders");
    console.log(dbOrders);
    if (!dbOrders) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }
    const order = dbOrders.orders.find(
      (order: any) => order._id.toString() === orderId
    );
    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      return NextResponse.json(
        {
          message: "Order not found",
          success: false,
        },
        { status: 404 }
      );
    }
    if (dbOrder.status === "cancelled")
      return NextResponse.json(
        { success: true, message: "Order is already cancelled" },
        { status: 200 }
      );
    dbOrder.status = "cancelled";
    dbOrder.isCancelled = true;
    dbOrder.cancelledTime = new Date();
    dbOrder.cancellationReason = cancelReason;
    await dbOrder.save();
    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
};
