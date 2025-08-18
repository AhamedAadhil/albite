import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import Dish from "@/models/dish";
import { Order } from "@/models/order";
import { Review } from "@/models/review";
import User from "@/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// POST /api/user/review
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }
    await connectDB();

    const { orderId, data } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, message: "Review data is required as array" },
        { status: 400 }
      );
    }

    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const dbOrder = await Order.findOne({ orderId });
    if (!dbOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const errors: string[] = [];
    await Promise.all(
      data.map(async (review) => {
        try {
          const newReview = new Review({
            user: user._id,
            orderId,
            dish: review.dish,
            rating: Number(review.rating),
            review: review.review,
          });
          await newReview.save();

          dbUser.reviews.push(newReview._id as mongoose.Types.ObjectId);

          // Update dish document
          const dish = await Dish.findById(review.dish);
          if (dish) {
            // console.log("dish exist");
            dish.reviews = dish.reviews || [];
            dish.reviews.push(newReview._id as mongoose.Types.ObjectId);

            const allReviews = await Review.find({
              _id: { $in: dish.reviews },
            });
            const avgRating =
              allReviews.reduce((sum, r) => sum + r.rating, 0) /
              allReviews.length;

            dish.averageRating = avgRating;
            await dish.save();
          } else {
            // console.log("dish not exist");
            errors.push(`Dish not found for ID: ${review.dish}`);
          }

          // Update order's dish isReviewed flag
          const dishInOrder = dbOrder.dishes.find((d: any) =>
            d.dish.equals(review.dish)
          );

          if (dishInOrder) {
            dishInOrder.isReviewed = true;
          } else {
            errors.push(`Dish in order not found for ID: ${review.dish}`);
          }
        } catch (err: any) {
          errors.push(
            `Error processing review for dish ${review.dish}: ${
              err.message || err
            }`
          );
        }
      })
    );

    await dbUser.save();
    dbOrder.markModified("dishes");
    await dbOrder.save();

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Some reviews failed", errors },
        { status: 207 }
      ); // Multi-Status
    }

    return NextResponse.json(
      { success: true, message: "Review(s) added successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};

// GET /api/user/review
export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }
    await connectDB();

    const { searchParams } = new URL(req.url);
    const dishId = searchParams.get("dishId");

    if (!dishId) {
      return NextResponse.json(
        { success: false, message: "Dish ID is required" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ dish: dishId })
      .select("-orderId -updatedAt -__v")
      .populate("user", "name");
    console.log("reviews", reviews);
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
