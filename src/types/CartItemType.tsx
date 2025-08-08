// types/CartItemType.ts

import { DishType } from "./DishType";

export type CartItemType = DishType & {
  parcelOptions: ("box" | "bag")[]; // ensure proper type
  quantity: number;
  selectedAddons?: string[];
  addons: {
    addonId: string;
    quantity: number;
  }[];
};
