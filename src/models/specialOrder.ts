import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISpecialOrder extends Document {
  name: string;
  phone: string;
  date: Date;
  time?: string; // optional, if they specify
  address?: string;
  guests?: number; // optional number of people
  note: string;
  mealType?: "breakfast" | "lunch" | "dinner" | "other";
  eventType?: "wedding" | "birthday" | "funeral" | "party" | "other";
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const specialOrderSchema = new Schema<ISpecialOrder>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
    },
    address: {
      type: String,
    },
    guests: {
      type: Number,
    },
    note: {
      type: String,
      required: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "other"],
    },
    eventType: {
      type: String,
      enum: ["wedding", "birthday", "funeral", "party", "other"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const SpecialOrder: Model<ISpecialOrder> =
  mongoose.models.SpecialOrder ||
  mongoose.model("SpecialOrder", specialOrderSchema);
