import axios from "axios";
import { useState, useEffect } from "react";

import { OrderType } from "../types";

export const useGetOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getOrders = async () => {
    setOrdersLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/user/order");

      // console.log("response", response);

      if (response.status === 200 && response.data.success) {
        // Map API data to OrderType[]
        const apiOrders = response.data.data.map((order: any) => ({
          id: order.orderId,
          _id: order._id,
          date: new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          time: new Date(order.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          total: order.total,
          discount: order.discount || 0,
          delivery: order.deliveryCharge || 0,
          deliveryMethod: order.deliveryMethod,
          deliveryNote: order.deliveryNote,
          deliveryRegion: order.deliveryRegion,
          status: order.status,
          isCancelled: order.isCancelled,
          cancelledTime: order.cancelledTime,
          cancellationReason: order.cancellationReason || "",
          products: [
            ...order.dishes.map((dishItem: any) => ({
              id: dishItem._id,
              name: dishItem.dish.name,
              quantity: dishItem.quantity,
              price: dishItem.dish.price,
              packageType: dishItem.packageType,
              type: "dish",
            })),
            ...order.addons.map((addonItem: any) => ({
              id: addonItem._id,
              name: addonItem.addon.name,
              quantity: addonItem.quantity,
              price: addonItem.addon.price,
              type: "addon",
            })),
          ],
        }));

        setOrders(apiOrders);
      } else {
        setError(response.data.message || "Failed to fetch orders");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching orders");
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return { orders, ordersLoading, error, refetch: getOrders };
};
