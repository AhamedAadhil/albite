import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import AddOn from "@/models/addon";
import Dish from "@/models/dish";
import { NextRequest, NextResponse } from "next/server";

// GET /api/dishes/[id]
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
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

    const dishId = params.id;
    const dish = await Dish.findOne({ _id: dishId, isActive: true }).select(
      " -totalOrders -addons"
    );
    if (!dish) {
      return NextResponse.json(
        {
          success: false,
          message: "Dish not found",
        },
        { status: 404 }
      );
    }
    const addons = await AddOn.find({
      mainCategory: dish.mainCategory,
      isActive: true,
    });
    if (!addons) {
      return NextResponse.json(
        {
          success: false,
          message: "Addons not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        dish,
        addons,
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
