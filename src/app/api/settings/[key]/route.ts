import { NextResponse } from "next/server";
import { getValueByKey } from "@/libs/getValueByKey";
import { verifyToken } from "@/libs/verifyToken";
import connectDB from "@/config/db";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    await connectDB();
    const setting = await getValueByKey(key);
    if (!setting) {
      return NextResponse.json(
        { message: "Setting not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(setting, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
}
