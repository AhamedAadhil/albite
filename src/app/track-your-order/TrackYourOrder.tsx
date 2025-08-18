"use client";
import React, { useEffect, useState } from "react";

import { svg } from "../../svg";
import { components } from "../../components";

import styles from "./TrackYourOrder.module.css";
import { renderLoader } from "@/components/Loader";

export const TrackYourOrder: React.FC = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const storedOrderId = localStorage.getItem("orderToTrack");
    if (!storedOrderId) {
      setErrorMsg("No order to track.");
      setLoading(false);
      return;
    }
    setOrderId(storedOrderId);

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `/api/user/order/track-order?orderId=${encodeURIComponent(
            storedOrderId
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch order data");
        }

        setOrderData(data.data);
        setLoading(false);
      } catch (err: any) {
        setErrorMsg(err.message);
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  if (loading) {
    return renderLoader();
  }

  if (errorMsg) {
    return <div style={{ color: "red", padding: 20 }}>{errorMsg}</div>;
  }

  if (!orderData) {
    return <div>No order data found.</div>;
  }

  // Build dynamic progress steps based on order status and timestamps
  const progress = [];

  // Helper to format time nicely or fallback
  const formatTime = (time: any) =>
    time
      ? new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  // Push steps with status derived from orderData
  progress.push({
    id: 1,
    title: "Order Placed",
    description: formatTime(orderData.placedTime),
    status: orderData.isPlaced ? "done" : "pending",
  });

  progress.push({
    id: 2,
    title: "Order Accepted",
    description: formatTime(orderData.acceptedTime),
    status: orderData.isAccepted ? "done" : "pending",
  });

  progress.push({
    id: 3,
    title: "Order Prepared",
    description: formatTime(orderData.preparedTime),
    status: orderData.isPrepared ? "done" : "pending",
  });

  progress.push({
    id: 4,
    title: "Order Delivered",
    description: formatTime(orderData.deliveredTime),
    status: orderData.isDelivered ? "done" : "pending",
  });

  return (
    <components.Screen>
      <components.Header showGoBack={true} title="Track your order" />
      <main className="scrollable container">
        <section
          style={{
            padding: 20,
            marginTop: 10,
            borderRadius: 10,
            marginBottom: 10,
            border: "1px solid #00B0B9",
          }}
        >
          <div
            style={{
              gap: 14,
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <span className="t14">Your order:</span>
            <span
              className="t14"
              style={{ fontWeight: 500, color: "var(--main-turquoise)" }}
            >
              {orderData.orderId}
            </span>
          </div>
          <div
            style={{
              gap: 14,
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <span className="t14">Date:</span>
            <span
              className="t14"
              style={{ fontWeight: 500, color: "var(--main-turquoise)" }}
            >
              {new Date(orderData.placedTime).toLocaleString()}
            </span>
          </div>
        </section>

        <section
          style={{
            borderRadius: 10,
            padding: 30,
            backgroundColor: "var(--white-color)",
          }}
        >
          {progress.map((item, index, array) => {
            const isLast = index === array.length - 1;
            const nextItem = array[index + 1];
            const animateLine = nextItem && nextItem.status !== "done";

            return (
              <div style={{ display: "flex" }} key={item.id}>
                <section
                  style={{
                    marginRight: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: isLast ? 0 : 7,
                      backgroundColor:
                        item.status === "done"
                          ? "#00B0B9"
                          : "var(--white-color)",
                      border: "1px solid #00B0B9",
                    }}
                  >
                    {item.status === "done" && <svg.StatusCheckSvg />}
                  </div>
                  {/* Animated or static line */}

                  {!isLast && (
                    <div
                      className={`${styles.line} ${
                        animateLine ? styles.loading : ""
                      }`}
                    />
                  )}
                </section>
                <section style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    className="t14"
                    style={{
                      marginBottom: 6,
                      color: "var(--main-dark)",
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                  <span className="t14">{item.description}</span>
                </section>
              </div>
            );
          })}
        </section>
      </main>
      <footer style={{ padding: 20 }}>
        <components.Button
          label="Contact Albite"
          href={
            "https://wa.me/94712345678?text=Hi%20there%2C%20I%20would%20like%20to%20know%20more%20about%20your%20menu."
          }
        />
      </footer>
    </components.Screen>
  );
};
