import connectDB from "@/config/db";
import { verifyToken } from "@/libs/verifyToken";
import { Notification, User } from "@/models";

import { NextRequest, NextResponse } from "next/server";

// to get all the notifications
// GET /api/user/notification
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
    await connectDB();
    const notifications = await User.findById(user._id)
      .select("notifications")
      .populate("notifications");

    return NextResponse.json(
      {
        success: true,
        data: notifications,
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

// to delete all or specific notification
// DELETE /api/user/notification
export const DELETE = async (req: NextRequest, res: NextResponse) => {
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

    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    if (notificationId === "all") {
      // Delete all notifications for the user

      // Find user's notifications
      const userWithNotifications = await User.findById(user._id).select(
        "notifications"
      );
      if (!userWithNotifications) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      const notificationIds = userWithNotifications.notifications;

      // Remove all notifications documents
      await Notification.deleteMany({ _id: { $in: notificationIds } });

      // Clear notifications array on the user
      userWithNotifications.notifications = [];
      await userWithNotifications.save();

      return NextResponse.json(
        {
          success: true,
          message: "All notifications deleted successfully",
        },
        { status: 200 }
      );
    } else {
      // Delete single notification by ID

      // Remove notificationId from user's notifications array
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $pull: { notifications: notificationId } },
        { new: true }
      ).populate("notifications");

      await Notification.findByIdAndDelete(notificationId);

      return NextResponse.json(
        {
          success: true,
          message: "Notification deleted successfully",
          data: updatedUser,
        },
        { status: 200 }
      );
    }
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
