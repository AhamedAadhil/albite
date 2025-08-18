import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import { SpecialOrder } from "@/models/specialOrder";
import { NextRequest, NextResponse } from "next/server";

// Create special order (POST)
export async function POST(req: NextRequest) {
  try {
    const user = verifyToken();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    await connectDB();
    const body = await req.json();
    const {
      name,
      phone,
      date,
      time,
      address,
      guests,
      note,
      mealType,
      eventType,
    } = body;

    if (!name || !phone || !date || !note) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrder = await SpecialOrder.create({
      name,
      phone,
      date,
      time,
      address,
      guests,
      note,
      mealType,
      eventType,
    });

    return NextResponse.json(
      { data: newOrder, success: true, message: "Special Order Created" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating special order:", error);
    return NextResponse.json(
      {
        error: error.message || "Server error",
        message: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
