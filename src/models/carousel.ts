import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICarousel extends Document {
  _id: mongoose.Types.ObjectId;
  image: string;
  title: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const carouselSchema = new Schema<ICarousel>(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Carousel: Model<ICarousel> =
  mongoose.models.Carousel || mongoose.model("Carousel", carouselSchema);
