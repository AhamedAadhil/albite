import axios from "axios";
import { useState, useEffect } from "react";
import { NotificationType } from "../types";

export const useGetNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [notificationsLoading, setNotificationsLoading] =
    useState<boolean>(false);

  const getDishes = async () => {
    setNotificationsLoading(true);

    try {
      const response = await axios.get("/api/user/notification");
      setNotifications(response.data.data.notifications);
      // console.log(response.data.data.notifications, "from useGetNotifications");
    } catch (error) {
      console.error(error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    getDishes();
  }, []);

  return { notificationsLoading, notifications, refetch: getDishes };
};
