// types/CartItemType.ts

import { DishType } from "./DishType";

export type CartItemType = DishType & {
  parcelOptions: ("box" | "bag")[]; // ensure proper type
  selectedAddons?: string[];
};
