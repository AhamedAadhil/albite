import connectDB from "@/config/db";
import { createAdminNotification } from "@/libs/createAdminNotification";
import { generateOrderId } from "@/libs/generateOrderId";
import { getValueByKey } from "@/libs/getValueByKey";
import { verifyToken } from "@/libs/verifyToken";
import AddOn from "@/models/addon";
import Cart from "@/models/cart";
import Dish from "@/models/dish";
import { Order } from "@/models/order";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

// POST /api/checkout
export const POST = async (req: NextRequest) => {
  try {
    // GLOBAL VARIABLES
    let totalAfterDiscount = 0;
    let deliveryFee = 0;

    // VERIFY TOKEN
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );
    }

    await connectDB();

    const {
      userId,
      deliveryRegion,
      deliveryMethod,
      deliveryNote,
      usedPoints = 0,
      dishes,
      addons,
    } = await req.json();

    // VALIDATE REQUIRED FIELDS
    if (!userId || !deliveryRegion || !deliveryMethod || !dishes || !addons) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    // VALIDATE USER AT LOCAL LEVEL
    if (userId.toString().trim() !== user._id.toString().trim()) {
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );
    }

    // VALIDATE USER AT DB LEVEL
    const dbUser = await User.findById(userId);
    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // FETCH DISHES AND CALCULATE TOTAL
    const dishDocs = await Promise.all(
      dishes.map((d: { dish: any }) => Dish.findById(d.dish))
    );
    if (dishDocs.some((d) => !d)) {
      return NextResponse.json(
        { message: "Dish not found", success: false },
        { status: 404 }
      );
    }
    let total_dish = 0;
    dishes.forEach((d: any, i: any) => {
      total_dish += (dishDocs[i]!.price ?? 0) * d.quantity;
    });

    // FETCH AND CALCULATE ADDONS TOTAL
    let total_addon = 0;
    if (addons.length > 0) {
      const addonDocs = await Promise.all(
        addons.map((a: { addon: any }) => AddOn.findById(a.addon))
      );
      if (addonDocs.some((a) => !a)) {
        return NextResponse.json(
          { message: "Addon not found", success: false },
          { status: 404 }
        );
      }
      addons.forEach((a: any, i: any) => {
        total_addon += (addonDocs[i]!.price ?? 0) * a.quantity;
      });
    }

    const cartTotalWithoutDiscount = total_dish + total_addon;

    // CALCULATE DISCOUNT IF POINTS USED
    if (usedPoints && usedPoints > 0) {
      if (usedPoints > dbUser.points) {
        return NextResponse.json(
          { message: "You don't have enough points", success: false },
          { status: 400 }
        );
      }

      if (usedPoints > cartTotalWithoutDiscount) {
        return NextResponse.json(
          {
            info: true,
            message: `You can only use points up to the total of dishes and addons (Rs. ${cartTotalWithoutDiscount}). Delivery charges cannot be covered by points.`,
            success: false,
          },
          { status: 400 }
        );
      }

      totalAfterDiscount = cartTotalWithoutDiscount - usedPoints;
    } else {
      totalAfterDiscount = cartTotalWithoutDiscount;
    }

    // CALCULATE DELIVERY FEE BASED ON DELIVERY REGION
    // TODO: Ensure delivery Region logic aligns with  business rules
    if (deliveryMethod === "delivery") {
      const regionKeyMap: Record<string, string> = {
        Akkaraipattu: "AKKARAIPATTU_DELIVERY_FEE",
        Palamunai: "PALAMUNAI_DELIVERY_FEE",
        Addalaichenai: "ADDALAICHENAI_DELIVERY_FEE",
        Sagamam: "SAGAMAM_DELIVERY_FEE",
        Kudiyiruppu: "KUDIYIRUPPU_DELIVERY_FEE",
      };
      const settingKey = regionKeyMap[deliveryRegion];

      // if (deliveryRegion === "Akkaraipattu") {
      //   deliveryFee = Number(process.env.AKKARAIPATTU_FEE);
      // } else if (deliveryRegion === "Palamunai") {
      //   deliveryFee = Number(process.env.PALAMUNAI_FEE);
      // } else if (deliveryRegion === "Addalaichenai") {
      //   deliveryFee = Number(process.env.ADDALAICHENAI_FEE);
      // } else if (deliveryRegion === "Sagamam") {
      //   deliveryFee = Number(process.env.SAGAMAM_FEE);
      // } else if (deliveryRegion === "Kudiyiruppu") {
      //   deliveryFee = Number(process.env.KUDIYIRUPPU_FEE);
      // } else {
      //   deliveryFee = 400;
      // }

      if (settingKey) {
        const setting = await getValueByKey(settingKey);
        if (setting) {
          deliveryFee = Number(setting.value);
        } else {
          // Fallback if setting not found in DB
          deliveryFee = 400;
        }
      } else {
        // Default fallback if region unknown
        deliveryFee = 400;
      }
    }

    // Calculate final total after discount and delivery fee
    const total = totalAfterDiscount + deliveryFee;

    const pointsPerRupeeSetting = await getValueByKey("POINTS_PER_RUPEE");
    if (!pointsPerRupeeSetting) {
      throw new Error("Points per rupee setting not found");
    }

    const pointsPerRupee = Number(pointsPerRupeeSetting.value);

    const earnedPoints = Math.floor(totalAfterDiscount * pointsPerRupee);

    // console.log(process.env.ADDALAICHENAI_FEE, "ADDALAICHENAI_FEE");
    // console.log("deliveryFee", deliveryFee);
    // console.log(earnedPoints, "earnedpoin");
    // console.log("totakAfteDriscount", totalAfterDiscount);
    // console.log("total", total);

    // GENERATE ORDER ID
    const orderId = await generateOrderId();

    // CREATE FINAL ORDER DOC
    const order = await Order.create({
      userId,
      orderId,
      deliveryRegion,
      deliveryMethod,
      deliveryCharge: deliveryFee,
      deliveryNote,
      usedPoints,
      earnedPoints,
      dishes,
      addons,
      total,
      status: "placed",
      discount: usedPoints,
      isPlaced: true,
      placedTime: Date.now(),
    });

    // CLEAR USER'S CART, DEDUCT USED POINTS & ADD EARNED POINTS
    await User.findByIdAndUpdate(
      userId,
      {
        $set: { cart: null, region: deliveryRegion },
        $push: { orders: order._id },
        // TODO: have to do this only when order status becomes delivered
        // $inc: {
        //   points: earnedPoints - usedPoints,
        //   totalSpent: total,
        // },
      },
      { new: true }
    );

    await Cart.deleteOne({ user: userId });

    await createAdminNotification({
      message: `New order placed: (${order.orderId})`,
      type: "New Order Placed",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: order,
      },
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
