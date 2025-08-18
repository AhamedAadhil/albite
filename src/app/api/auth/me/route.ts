import { verifyToken } from "@/libs/verifyToken";
import User from "@/models/user";
import Cart from "@/models/cart";
import Dish from "@/models/dish";
import AddOn from "@/models/addon";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// GET /api/auth/me
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

    let profile = await User.findById(user._id)
      .select("-password -totalSpent")
      .populate({
        path: "favourites",
        model: "Dish",
        select: "-totalOrders -addons -createdAt -updatedAt",
      })
      .populate({
        path: "cart",
        populate: [
          { path: "dishes.dish", model: "Dish" },
          { path: "addons.addon", model: "AddOn" },
        ],
      });

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // If user has no cart, create a new one and assign it
    if (!profile.cart) {
      const newCart = new Cart({
        user: profile._id,
        dishes: [],
        addons: [],
        total: 0,
        mainCategory: "lunch", // default mainCategory
      });

      await newCart.save();

      profile.cart = newCart._id as mongoose.Types.ObjectId;

      await profile.save();

      // Repopulate cart so response includes full cart details
      await profile.populate({
        path: "cart",
        model: "Cart",
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "User found",
        user: profile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// PUT /api/auth/me
export const PUT = async (req: NextRequest, res: NextResponse) => {
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

    const profile = await User.findById(user._id).select(
      "-password -totalSpent"
    );
    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const { username, region, password } = await req.json();

    if (username) profile.name = username;
    if (region) profile.region = region;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      profile.password = hashedPassword;
    }

    await profile.save();

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: profile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
