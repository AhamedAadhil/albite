import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DishType } from "../types";
import toast from "react-hot-toast";

type WishlistStateType = {
  list: DishType[];
  addToWishlist: (dish: DishType) => Promise<void>;
  removeFromWishlist: (dish: DishType) => Promise<void>;
  setList: (dishes: DishType[]) => void;
};

const initialState: Omit<
  WishlistStateType,
  "addToWishlist" | "removeFromWishlist" | "setList"
> = {
  list: [],
};

export const useWishlistStore = create<WishlistStateType>()(
  persist(
    (set, get) => ({
      ...initialState,

      addToWishlist: async (dish) => {
        try {
          const res = await fetch("/api/user/wishlist", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dishId: dish._id }),
            credentials: "include", // in case you're using cookies for auth
          });

          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Failed to update wishlist");

          if (data.success && data.message.includes("added")) {
            set((state) => {
              const inWishlist = state.list.find(
                (item) => item._id === dish._id
              );
              if (!inWishlist) {
                return {
                  ...state,
                  list: [...state.list, dish],
                };
              }
              return state;
            });
            toast.success("Added to wishlist!");
          }
        } catch (err) {
          console.error("Add to wishlist failed:", err);
        }
      },

      removeFromWishlist: async (dish) => {
        try {
          const res = await fetch("/api/user/wishlist", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dishId: dish._id }),
            credentials: "include",
          });

          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Failed to update wishlist");

          if (data.success && data.message.includes("removed")) {
            set((state) => ({
              ...state,
              list: state.list.filter((item) => item._id !== dish._id),
            }));
            toast.success("Removed from wishlist!");
          }
        } catch (err) {
          console.error("Remove from wishlist failed:", err);
        }
      },

      setList: (dishes) => set({ list: dishes }),
    }),
    {
      name: "wishlist-storage",
    }
  )
);
