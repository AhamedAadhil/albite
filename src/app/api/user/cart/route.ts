import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import AddOn from "@/models/addon";
import Cart from "@/models/cart";
import Dish from "@/models/dish";
import User from "@/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// add dishes to cart
// POST /api/user/cart
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );
    }
    await connectDB();

    const { dishId, dishQuantity, packageType, addons, userId } =
      await req.json();

    console.log(
      "dishId=",
      dishId,
      "dishQuantity=",
      dishQuantity,
      "packageType=",
      packageType,
      "addons=",
      addons,
      "userId=",
      userId
    );

    if (!packageType) {
      return NextResponse.json(
        { message: "Package type is required", success: false },
        { status: 400 }
      );
    }

    if (!dishId || !dishQuantity || !userId) {
      return NextResponse.json(
        {
          message: "All fields are required",
          success: false,
        },
        { status: 400 }
      );
    }

    // validate user local level
    if (userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );
    }
    // validate user in db level
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // validate dish is active and valid
    const dish = await Dish.findOne({ _id: dishId, isActive: true });
    if (!dish) {
      return NextResponse.json(
        { message: "Dish not found or no longer available", success: false },
        { status: 404 }
      );
    }

    // validate mainCategory
    const incomingMainCategory = dish.mainCategory;

    // ✅ Validate Add-ons (if present)
    const validAddons: { addon: mongoose.Types.ObjectId; quantity: number }[] =
      [];

    if (Array.isArray(addons)) {
      for (const item of addons) {
        if (!item.addonId || !item.quantity) continue;

        const addon = await AddOn.findById(item.addonId);
        if (addon) {
          validAddons.push({
            addon: new mongoose.Types.ObjectId(item.addonId), // ✅ Convert here
            quantity: item.quantity,
          });
        }
      }
    }

    // 🛒 Check if user has an existing cart
    let cart = await Cart.findOne({ user: user._id });

    // ✅ Calculate total
    let total = dish.price * dishQuantity;

    if (validAddons.length > 0) {
      for (const item of validAddons) {
        const addonDoc = await AddOn.findById(item.addon);
        if (addonDoc) {
          total += addonDoc.price * item.quantity;
        }
      }
    }

    if (cart) {
      if (cart.mainCategory !== incomingMainCategory) {
        return NextResponse.json(
          {
            state: "mixed_categories",
            message: `You already have items from ${cart.mainCategory}. You can’t mix categories.`,
            success: false,
          },
          { status: 400 }
        );
      }

      const existingDishIndex = cart.dishes.findIndex(
        (item) => item.dish.toString() === dishId
      );

      if (existingDishIndex !== -1) {
        cart.dishes[existingDishIndex].quantity += dishQuantity;
      } else {
        cart.dishes.push({
          dish: new mongoose.Types.ObjectId(dishId),
          quantity: dishQuantity,
          packageType: packageType,
        });
      }

      // Add valid addons
      for (const addon of validAddons) {
        cart.addons.push(addon);
      }

      // ✅ Add total
      cart.total += total;

      await cart.save();
    } else {
      // Create new cart
      cart = await Cart.create({
        user: user._id,
        dishes: [
          { dish: dishId, quantity: dishQuantity, packageType: packageType },
        ],
        addons: validAddons,
        total,
        mainCategory: incomingMainCategory,
      });
    }

    const populatedCart = await Cart.findById(cart._id)
      .populate("dishes.dish")
      .populate("addons.addon");

    return NextResponse.json(
      {
        message: "Cart updated successfully",
        success: true,
        cart: populatedCart,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        message: error.message,
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

// remove dish or addOn from cart
// PATCH /api/user/cart
export const PATCH = async (req: NextRequest) => {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );
    }

    await connectDB();

    const { userId, dishes = [], addons = [] } = await req.json();

    if (userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found", success: false },
        { status: 404 }
      );
    }

    // 🥘 Update or remove dishes
    for (const item of dishes) {
      const index = cart.dishes.findIndex(
        (d) => d.dish.toString() === item.dishId
      );

      if (item.quantity === 0 && index !== -1) {
        cart.dishes.splice(index, 1); // remove
      } else if (item.quantity > 0 && index !== -1) {
        cart.dishes[index].quantity = item.quantity;
      }
    }

    // ➕ Update or remove addons
    for (const item of addons) {
      const index = cart.addons.findIndex(
        (a) => a.addon.toString() === item.addonId
      );

      if (item.quantity === 0 && index !== -1) {
        cart.addons.splice(index, 1); // remove
      } else if (item.quantity > 0 && index !== -1) {
        cart.addons[index].quantity = item.quantity;
      } else if (item.quantity > 0 && index === -1) {
        cart.addons.push({
          addon: new mongoose.Types.ObjectId(item.addonId),
          quantity: item.quantity,
        });
      }
    }

    // ✅ Recalculate total
    let newTotal = 0;

    for (const item of cart.dishes) {
      const dishDoc = await Dish.findById(item.dish);
      if (dishDoc) {
        newTotal += dishDoc.price * item.quantity;
      }
    }

    for (const item of cart.addons) {
      const addonDoc = await AddOn.findById(item.addon);
      if (addonDoc) {
        newTotal += addonDoc.price * item.quantity;
      }
    }

    cart.total = newTotal;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate("dishes.dish")
      .populate("addons.addon");

    return NextResponse.json(
      {
        message: "Cart updated successfully",
        success: true,
        cart: populatedCart,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
