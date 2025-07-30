import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Interface
export interface IDish extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  price: number;
  calories: number;
  servings: number;

  isRecommended?: boolean; // optional field
  isNewDish?: boolean; // optional field
  isPopular?: boolean; // optional field

  reviews?: mongoose.Types.ObjectId[]; // references Review model
  totalOrders?: number; // optional field
  averageRating?: number; // optional field

  mainCategory: "breakfast" | "lunch" | "dinner";
  availableBefore: string; // e.g. "11:00"
  maxPreorderDays: number;

  addons: mongoose.Types.ObjectId[]; // references AddOn model
  parcelOptions: ("box" | "bag")[];
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema
const dishSchema = new Schema<IDish>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    calories: {
      type: Number,
      required: true,
    },

    servings: {
      type: Number,
      required: true,
    },

    isRecommended: {
      type: Boolean,
      default: false,
    },

    isNewDish: {
      type: Boolean,
      default: false,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    totalOrders: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    mainCategory: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },

    availableBefore: {
      type: String,
      required: true, // "HH:mm" format
    },

    maxPreorderDays: {
      type: Number,
      default: 3,
    },

    addons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddOn",
      },
    ],

    parcelOptions: {
      type: [String],
      enum: ["box", "bag"],
      default: ["box", "bag"],
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
const Dish: Model<IDish> =
  mongoose.models.Dish || mongoose.model<IDish>("Dish", dishSchema);

export default Dish;
