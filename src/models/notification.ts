import mongoose, { Document, Schema, Model } from "mongoose";

export interface INotification extends Document {
  message: string; // Notification message text
  type: string; // Notification type/category (e.g., "order", "system", "promotion")
  recipientType: "User" | "Admin"; // Type of recipient (for polymorphism)
  recipientId: mongoose.Types.ObjectId | string; // Reference to either User or Admin collection
  isRead: boolean; // Read status
  readAt?: Date; // When user read the notification
  meta?: Record<string, any>; // Optional field for extra info (e.g., orderId, URL)
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "New Order Placed",
        "New User Registered",
        "New Comment Added",
        "Order Status Update",
        "Points Reward",
        "Promotion",
        "System Notification",
      ],
    },
    recipientType: { type: String, required: true, enum: ["User", "Admin"] },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId || String,
      required: true,
      refPath: "User", // Dynamic reference based on recipientType
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    meta: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
