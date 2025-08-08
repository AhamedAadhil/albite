export type CartRequestType = {
  _id: any;
  id: any;
  dishes?: {
    dishId: string;
    quantity: number; // 0 = remove
  }[];
  addons?: {
    addonId: string;
    quantity: number; // 0 = remove
  }[];
};
