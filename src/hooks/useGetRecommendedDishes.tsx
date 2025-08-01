// hooks/useGetRecommendedDishes.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { DishType } from "../types";

export const useGetRecommendedDishes = (): {
  recommendedDishes: DishType[];
  recommendedLoading: boolean;
} => {
  const [recommendedDishes, setRecommendedDishes] = useState<DishType[]>([]);
  const [recommendedLoading, setRecommendedLoading] = useState<boolean>(false);

  const fetchRecommended = async () => {
    setRecommendedLoading(true);
    try {
      const response = await axios.get(`/api/dishes?isRecommendad=true`);
      setRecommendedDishes(response.data.dishes);
    } catch (error) {
      console.error("Failed to fetch recommended dishes", error);
    } finally {
      setRecommendedLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommended();
  }, []);

  return { recommendedDishes, recommendedLoading };
};
