import mongoose, { Document, Schema, Model } from "mongoose";

// permissions enum
export enum Permission {
  VIEW_ALL_ORDERS = "view_all_orders",
  TAKEAWAYS_ONLY = "takeaways_only",
  DELIVER_ONLY = "deliver_only",
  UPDATE_POINTS = "update_points",
  MODIFY_ORDER = "modify_order",
  CREATE_DISH = "create_dish",
}

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

  role: number; // 0 - user, 7 - super admin, 6- admins
  permissions: Permission[];
  totalSpent: number;
  points: number;

  orders: mongoose.Types.ObjectId[];
  cart: mongoose.Types.ObjectId;
  favourites: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
  notifications: mongoose.Types.ObjectId[];

  isActive?: boolean;

  resetPasswordToken: string;
  resetPasswordExpires: Date;

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

    permissions: {
      type: [String],
      enum: Object.values(Permission), // enforce only valid permission strings
      default: [],
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

    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },

    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
