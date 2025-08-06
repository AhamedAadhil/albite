import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import Dish from "@/models/dish";
import { verifyToken } from "@/libs/verifyToken";

// Get all dishes with filters
// GET /api/dishes
export const GET = async (req: NextRequest) => {
  try {
    // Auth check
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        { message: "Access denied: not an admin", success: false },
        { status: 403 }
      );
    }

    await connectDB();

    // Parse query params
    const { searchParams } = new URL(req.url);
    const filters: any = {};

    const mainCategory = searchParams.get("mainCategory");
    const isRecommended = searchParams.get("isRecommended");
    const isPopular = searchParams.get("isPopular");
    const isNewDish = searchParams.get("isNewDish");

    if (mainCategory) filters.mainCategory = mainCategory;
    if (isRecommended) filters.isRecommended = isRecommended === "true";
    if (isPopular) filters.isPopular = isPopular === "true";
    if (isNewDish) filters.isNewDish = isNewDish === "true";

    const dishes = await Dish.find(filters).sort({ createdAt: -1 });

    return NextResponse.json({ dishes, success: true });
  } catch (error: any) {
    console.error("Failed to fetch dishes", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message, success: false },
      { status: 500 }
    );
  }
};
