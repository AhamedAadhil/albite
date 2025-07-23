import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import type {DishType} from '../types';

export type CartStateType = {
  total: number;
  delivery: number;
  discount: number;
  subtotal: number;
  promoCode: string;
  list: DishType[];
  discountAmount: number;
  addToCart: (dish: DishType) => void;
  removeFromCart: (dish: DishType) => void;
  setDiscount: (discount: number) => void;
  resetCart: () => void;
  setPromoCode: (promoCode: string) => void;
};

const initialState: Omit<
  CartStateType,
  'addToCart' | 'removeFromCart' | 'setDiscount' | 'resetCart' | 'setPromoCode'
> = {
  total: 0,
  list: [],
  delivery: 0,
  discount: 0,
  subtotal: 0,
  promoCode: '',
  discountAmount: 0,
};

export const useCartStore = create<CartStateType>()(
  persist(
    (set) => ({
      ...initialState,
      addToCart: (dish) => {
        set((state) => {
          const inCart = state.list.find((item) => item.id === dish.id);

          if (inCart) {
            state.list = state.list.map((item) => {
              if (item.id === dish.id) {
                if (item.quantity) {
                  item.quantity += 1;
                }
              }
              return item;
            });
            state.subtotal += Number(dish.price);
            state.discountAmount = Number(
              (state.subtotal - state.total).toFixed(2),
            );
            state.total += Number(dish.price) * (1 - state.discount / 100);
          } else {
            state.list.push({
              ...dish,
              quantity: 1,
            });
            state.subtotal += Number(dish.price);
            state.total += Number(dish.price) * (1 - state.discount / 100);
          }

          return {...state};
        });
      },
      removeFromCart: (dish) => {
        set((state) => {
          const inCart = state.list.find((item) => item.id === dish.id);

          if (inCart) {
            state.list = state.list.reduce((acc, item) => {
              if (item.id === dish.id) {
                if (item.quantity && item.quantity > 1) {
                  item.quantity -= 1;
                  acc.push(item);
                }
              } else {
                acc.push(item);
              }
              return acc;
            }, [] as DishType[]);
            state.subtotal -= Number(dish.price);
            state.discountAmount = Number(
              (state.subtotal - state.total).toFixed(2),
            );
            state.total -= Number(dish.price) * (1 - state.discount / 100);

            if (state.list.length === 0) {
              state.discount = 0;
              state.promoCode = '';
            }
          }

          return {...state};
        });
      },
      setDiscount: (discount) => {
        set((state) => {
          state.discount = discount;
          state.total = state.subtotal * (1 - discount / 100);
          state.discountAmount = state.subtotal - state.total;
          return {...state};
        });
      },
      resetCart: () => {
        set(() => ({
          ...initialState,
        }));
      },
      setPromoCode: (promoCode) => {
        set((state) => {
          state.promoCode = promoCode;
          return {...state};
        });
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
