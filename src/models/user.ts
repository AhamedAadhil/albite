import mongoose, { Document, Schema, Model } from "mongoose";

// 1. Interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  mobile: string;
  region: string;

  isVerified: boolean;
  otp: string;
  otpExpires?: Date;

  role: number; // 0 - user, 7 - admin
  totalSpent: number;
  points: number;

  orders: mongoose.Types.ObjectId[];
  cart: mongoose.Types.ObjectId;
  favourites: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    region: {
      type: String,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: "",
    },

    otpExpires: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    },

    role: {
      type: Number,
      default: 0, // 0 = user, 7 = admin
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    points: {
      type: Number,
      default: 0,
    },

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],

    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 3. Model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
