export type CartResponseType = {
  addons: any;
  dishes: {
    dish: {
      _id: string;
      name: string;
      price: number;
      image?: string;
      category?: string;
      // ... other DishType fields
    };
    quantity: number;
    packageType?: "box" | "bag";
    addons?: {
      addon: {
        _id: string;
        name: string;
        price: number;
        // ...other Addon fields
      };
      quantity: number;
    }[];
  }[];
  subtotal: number;
  total: number;
  discount: number;
  discountAmount?: number;
  promoCode?: string;
  delivery?: number;
};
