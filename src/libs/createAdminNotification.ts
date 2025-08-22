import { User, Notification } from "@/models";
import { INotification } from "@/models/notification";
import { getAdminId } from "./getAdminId";

interface CreateNotificationInput {
  message: string;
  type: string;
  // recipientType: "User" | "Admin";
  // recipientId: mongoose.Schema.Types.ObjectId | string;
  meta?: Record<string, any>;
}

export async function createAdminNotification({
  message,
  type,
  meta,
}: CreateNotificationInput): Promise<INotification> {
  const adminId = await getAdminId();
  if (!adminId) {
    throw new Error("No admin user found");
  }

  const notification = new Notification({
    message,
    type,
    recipientType: "Admin",
    recipientId: adminId,
    isRead: false,
    meta,
  });

  await notification.save();

  await User.findByIdAndUpdate(adminId, {
    $push: {
      notifications: notification._id,
    },
  });
  return notification;
}
