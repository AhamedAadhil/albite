import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import Dish from "@/models/dish";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/user/wishlist
export const PATCH = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );
    }
    await connectDB();
    const { dishId } = await req.json();
    if (!dishId) {
      return NextResponse.json(
        { message: "Dish ID is required" },
        { status: 400 }
      );
    }

    const dish = await Dish.findOne({ _id: dishId, isActive: true });
    if (!dish) {
      return NextResponse.json(
        { message: "Dish not found", success: false },
        { status: 404 }
      );
    }
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }
    const favourites = dbUser.favourites;
    let currentState = null;
    if (favourites.includes(dish._id)) {
      favourites.splice(favourites.indexOf(dish._id), 1);
      currentState = "removed";
    } else {
      favourites.push(dish._id);
      currentState = "added";
    }

    dbUser.favourites = favourites;

    await dbUser.save();
    return NextResponse.json(
      { message: `Dish ${currentState} to wishlist`, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message, success: false },
      { status: 500 }
    );
  }
};
