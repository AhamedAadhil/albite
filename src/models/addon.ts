import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Interface
export interface IAddOn extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;

  mainCategory: "breakfast" | "lunch" | "dinner";
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema
const addOnSchema = new Schema<IAddOn>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    mainCategory: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Model
const AddOn: Model<IAddOn> =
  mongoose.models.AddOn || mongoose.model<IAddOn>("AddOn", addOnSchema);

export default AddOn;
