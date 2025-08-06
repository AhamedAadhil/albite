import axios from "axios";
import { useState, useEffect } from "react";

import { DishType } from "../types";

type DishFilters = {
  mainCategory?: string;
  isRecommended?: boolean;
  isPopular?: boolean;
  isNewDish?: boolean;
};

export const useGetDishes = (filters: DishFilters = {}) => {
  const [dishes, setDishes] = useState<DishType[]>([]);
  const [dishesLoading, setDishesLoading] = useState<boolean>(false);

  const getDishes = async () => {
    setDishesLoading(true);
    try {
      const params = new URLSearchParams();

      // Convert filters into query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });

      const response = await axios.get(`/api/dishes?${params.toString()}`);
      setDishes(response.data.dishes);
    } catch (error) {
      console.error("Failed to fetch dishes", error);
    } finally {
      setDishesLoading(false);
    }
  };

  useEffect(() => {
    getDishes();
  }, [JSON.stringify(filters)]); // Refetch when filters change

  return { dishesLoading, dishes };
};
