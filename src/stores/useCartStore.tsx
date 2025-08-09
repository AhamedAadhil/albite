import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItemType } from "../types";
import { CartResponseType } from "../types"; // Assuming types from API
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

type AddonId = {
  _id: string;
  price: number;
  name?: string;
  image?: string;
  // add other properties as needed
};
export type CartStateType = {
  total: number;
  delivery: number;
  discount: number;
  subtotal: number;
  promoCode: string;
  list: CartItemType[];
  addonsList: {
    mainCategory: any;
    addonId: AddonId;
    quantity: number;
    _id?: string;
  }[];
  discountAmount: number;

  // API-driven actions
  addToCart: (
    dish: string,
    dishQuantity: Number,
    packageType: string,
    addons: any
  ) => Promise<void>;
  updateCart: (updates: {
    dishes?: { dishId: string; quantity: number }[];
    addons?: { addonId: string; quantity: number }[];
    userId?: string;
  }) => Promise<void>;
  setCartFromServer: (cart: CartResponseType) => void;

  resetCart: () => void;
  setPromoCode: (promoCode: string) => void;
};

const initialState: Omit<
  CartStateType,
  | "addToCart"
  | "updateCart"
  | "setCartFromServer"
  | "resetCart"
  | "setPromoCode"
> = {
  total: 0,
  list: [],
  delivery: 0,
  discount: 0,
  subtotal: 0,
  promoCode: "",
  discountAmount: 0,
  addonsList: [],
};

export const useCartStore = create<CartStateType>()(
  persist(
    (set) => ({
      ...initialState,

      // Called after fetching cart from API
      setCartFromServer: (cart) => {
        set({
          list: cart.dishes.map(
            (item: {
              packageType?: "box" | "bag";
              dish: any;
              quantity: number;
            }) => ({
              ...item.dish,
              quantity: item.quantity,
              packageType: item.packageType || "box",
            })
          ),
          addonsList:
            cart.addons?.map((item: any) => ({
              addonId: item.addon, // depending on how your backend sends it
              quantity: item.quantity,
              _id: item._id,
            })) || [],
          total: cart.total,
          subtotal: cart.subtotal,
          discount: cart.discount,
          discountAmount: cart.subtotal - cart.total,
          promoCode: cart.promoCode || "",
          delivery: cart.delivery || 0,
        });
      },

      // Add dish to cart using POST /api/user/cart
      addToCart: async (dishId, dishQuantity, packageType, addons) => {
        try {
          const userId = useAuthStore.getState().user?._id;

          if (!userId) {
            throw new Error("User not authenticated");
          }

          // Convert addons object into array of { addonId, quantity }
          const addonsArray = addons
            ? Object.entries(addons).map(([addonId, quantity]) => ({
                addonId,
                quantity,
              }))
            : [];

          const body = {
            dishId, // id of dish
            dishQuantity,
            packageType: packageType || "box",
            addons: addonsArray || [], // optional
            userId,
          };

          console.log("body", body);

          const res = await fetch("/api/user/cart", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();

          if (res.ok && data.cart) {
            useCartStore.getState().setCartFromServer(data.cart);
            toast.success(data.message || "Dish added to cart successfully!");
          } else {
            toast.error(data.message || "Failed to add Dish to cart.");
          }
        } catch (error: any) {
          console.error("❌ addToCart error:", error);
          toast.error(
            error.message || "Something went wrong while adding to cart."
          );
        }
      },

      // Patch quantity changes or remove items using PATCH /api/user/cart
      updateCart: async (updates) => {
        const userId = useAuthStore.getState().user?._id;

        if (!userId) {
          toast.error("User not authenticated");
          return;
        }
        const res = await fetch("/api/user/cart", {
          method: "PATCH",
          body: JSON.stringify({ ...updates, userId }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && data.cart) {
          useCartStore.getState().setCartFromServer(data.cart);
          toast.success(data.message || "Cart updated successfully!");
        } else {
          toast.error(data.message || "Failed to update cart.");
        }
      },

      resetCart: () => {
        set(() => ({ ...initialState }));
      },

      setPromoCode: (promoCode) => {
        set((state) => ({
          promoCode,
        }));
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
