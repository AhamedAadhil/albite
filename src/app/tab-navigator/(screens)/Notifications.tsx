"use client";

import React from "react";

import { svg } from "../../../svg";
import { hooks } from "../../../hooks";
import { components } from "../../../components";
import { formatDateTime } from "@/libs/formatDateTime";
import { renderLoader } from "@/components/Loader";

export const Notifications: React.FC = () => {
  const { notifications, notificationsLoading, refetch } =
    hooks.useGetNotifications();

  const sortedNotifications = [...(notifications || [])].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      // Make a PATCH or POST request to your API route that marks notification as read.
      const response = await fetch("/api/user/notification", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });

      const result = await response.json();

      if (result.success) {
        await refetch();
      } else {
        console.error("Failed to mark notification as read:", result.message);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (notificationsLoading) {
    return renderLoader();
  }

  const renderHeader = () => {
    return (
      <components.Header user={true} showBasket={true} title="Notifications" />
    );
  };

  const renderContent = () => {
    return (
      <main className="container scrollable">
        {sortedNotifications.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--text-primary)", // Use your main text color variable or specific color
              height: "calc(100vh - 100px)", // Adjust for header/footer if any, or use "100vh" for full screen
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
            }}
          >
            <svg.EmptyBellSvg
              width={80}
              height={80}
              style={{ marginBottom: 24, color: "var(--icon-color)" }} // Customize icon color if needed
            />
            <h3>No notifications yet</h3>
            <p>You have no new updates or alerts at this moment.</p>
            <button
              onClick={() => refetch()}
              style={{
                marginTop: 16,
                padding: "8px 16px",
                backgroundColor: "var(--main-turquoise)",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: "600",
                fontSize: 14,
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#005f99")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--main-turquoise)")
              }
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end", // aligns content to right
                marginBottom: 12,
              }}
            >
              <button
                type="button"
                style={{
                  marginTop: 16,
                  background: "none",
                  border: "none",
                  color: "var(--main-turquoise)",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: "underline",
                  padding: 0,
                }}
                onClick={() => handleMarkAsRead("all")}
              >
                Mark all as read
              </button>
            </div>

            <ul style={{ paddingTop: 10, paddingBottom: 20 }}>
              {sortedNotifications?.map(
                (notification: any, index: number, array: any) => {
                  const isLast = index === array.length - 1;

                  return (
                    <li
                      key={notification._id}
                      style={{
                        backgroundColor: "var(--white-color)",
                        borderRadius: 10,
                        padding: 20,
                        marginBottom: isLast ? 0 : 14,
                      }}
                    >
                      <section
                        style={{ opacity: notification.isRead ? 0.5 : 1 }}
                      >
                        <div
                          style={{
                            gap: 8,
                            marginBottom: 14,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {notification.type === "Order Status Update" && (
                            <svg.NotificationCheckSvg />
                          )}
                          {notification.type === "Points Updated" && (
                            <svg.GiftSvg />
                          )}
                          {notification.type === "Promotion" && (
                            <svg.NotificationCheckSvg />
                          )}
                          <h5 className="number-of-lines-1">
                            {notification.type}
                          </h5>
                        </div>
                        <p className="t14" style={{ marginBottom: 14 }}>
                          {notification.message}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span className="t12">
                            {formatDateTime(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <span
                              className="t12 clickable"
                              style={{ color: "var(--main-turquoise)" }}
                              onClick={() =>
                                handleMarkAsRead(String(notification._id))
                              }
                            >
                              Mark as read
                            </span>
                          )}
                        </div>
                      </section>
                    </li>
                  );
                }
              )}
            </ul>
          </>
        )}
      </main>
    );
  };

  const renderModal = () => {
    return <components.Modal />;
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderModal()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
