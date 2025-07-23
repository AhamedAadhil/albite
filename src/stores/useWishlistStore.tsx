import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import type {DishType} from '../types';

type WishlistStateType = {
  list: DishType[];
  addToWishlist: (dish: DishType) => void;
  removeFromWishlist: (dish: DishType) => void;
};

const initialState: Omit<
  WishlistStateType,
  'addToWishlist' | 'removeFromWishlist'
> = {
  list: [],
};

export const useWishlistStore = create<WishlistStateType>()(
  persist(
    (set) => ({
      ...initialState,
      addToWishlist: (dish) => {
        set((state) => {
          const inWishlist = state.list.find((item) => item.id === dish.id);

          if (!inWishlist) {
            return {
              ...state,
              list: [...state.list, dish],
            };
          }

          return state;
        });
      },
      removeFromWishlist: (dish) => {
        set((state) => ({
          ...state,
          list: state.list.filter((item) => item.id !== dish.id),
        }));
      },
    }),
    {
      name: 'wishlist-storage',
    },
  ),
);
