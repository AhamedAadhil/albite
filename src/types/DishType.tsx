export type DishType = {
  servings: number;
  _id: string | null | undefined;
  id: number;
  name: string;
  kcal: string;
  image: string;
  price: string;
  weight: string;
  isNew?: boolean;
  isHot?: boolean;
  menu: string[];
  quantity?: number;
  description: string;
  isRecommended?: boolean;
  dietaryPreferences?: string[];
};
