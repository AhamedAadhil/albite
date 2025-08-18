import mongoose, { Model, Schema, Document } from "mongoose";
import { IDish } from "./dish";
import { IAddOn } from "./addon";

export interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  orderId: string;

  deliveryRegion: string;
  deliveryMethod: string;
  deliveryNote: string;

  usedPoints: Number;
  earnedPoints: Number;

  dishes: [
    {
      reviews: any;
      dish: IDish;
      quantity: Number;
      packageType: string;
      isReviewed: boolean;
    }
  ];
  addons: [
    {
      addon: IAddOn;
      quantity: Number;
    }
  ];
  total: Number;
  deliveryCharge: Number;
  discount: Number;

  isPlaced: Boolean;
  placedTime: Date;
  isAccepted: Boolean;
  acceptedTime: Date;
  isPrepared: Boolean;
  preparedTime: Date;
  isDelivered: Boolean;
  deliveredTime: Date;
  isCancelled: Boolean;
  cancelledTime: Date;
  cancellationReason: string;
  isRejected: Boolean;
  rejectedTime: Date;
  rejectionReason: string;

  status: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },
    deliveryRegion: { type: String, required: true },
    deliveryMethod: { type: String, required: true },
    deliveryNote: { type: String },
    usedPoints: { type: Number, required: true },
    earnedPoints: { type: Number, required: true },
    dishes: [
      {
        dish: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
        quantity: { type: Number, required: true },
        packageType: { type: String, required: true },
        isReviewed: { type: Boolean, default: false },
      },
    ],
    addons: [
      {
        addon: { type: Schema.Types.ObjectId, ref: "AddOn", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    discount: { type: Number, required: true },
    isPlaced: { type: Boolean, default: false },
    placedTime: { type: Date },
    isAccepted: { type: Boolean, default: false },
    acceptedTime: { type: Date },
    isPrepared: { type: Boolean, default: false },
    preparedTime: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredTime: { type: Date },
    isCancelled: { type: Boolean, default: false },
    cancelledTime: { type: Date },
    cancellationReason: { type: String },
    isRejected: { type: Boolean, default: false },
    rejectedTime: { type: Date },
    rejectionReason: { type: String },
    status: {
      enum: [
        "placed",
        "accepted",
        "prepared",
        "delivered",
        "cancelled",
        "rejected",
      ],
      type: String,
      required: true,
      default: "placed",
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
