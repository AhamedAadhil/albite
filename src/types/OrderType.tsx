import { DishType } from "./DishType";

type ProductType = {
  type: string;
  packageType: string;
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type OrderStatus =
  | "shipping"
  | "delivered"
  | "cancelled"
  | "placed"
  | "pending"
  | "accepted"
  | "prepared"
  | "rejected";

export type OrderType = {
  deliveryRegion: string;
  deliveryMethod: string;
  deliveryNote: string;
  id: number;
  date: string;
  time: string;
  status: OrderStatus;
  total: number;
  discount: number;
  delivery: number;
  products: ProductType[];
  addons: DishType[];
};
