import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
  user: Schema.Types.ObjectId;
  orderId: string;
  dish: string;
  rating: number;
  review: string;

  createdAt: Date;
  updatedAt: Date;
}

export const reviewSchema = new Schema<IReview>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: String,
    dish: String,
    rating: Number,
    review: String,
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
