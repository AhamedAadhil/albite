import mongoose, { Schema, Model, Document } from "mongoose";

interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  dishes: {
    dish: mongoose.Types.ObjectId;
    quantity: number;
    packageType: string;
  }[];
  addons: {
    addon: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  total: number;
  mainCategory: "breakfast" | "lunch" | "dinner";
  createdAt: Date;
  updatedAt: Date;
}

export const cartSchema = new Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dishes: [
      {
        dish: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        packageType: {
          type: String,
          required: true,
        },
      },
    ],
    addons: [
      {
        addon: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AddOn",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    mainCategory: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
