"use client";
import React, { useEffect, useState } from "react";

const NoInternetBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  // Banner style: fixed bottom center, no blocking pointer events outside the banner
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#f44336", // red color
        color: "white",
        padding: "12px 24px",
        borderRadius: "4px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        zIndex: 9999,
        pointerEvents: "auto", // allow interaction with the banner itself
        userSelect: "none",
        // fontWeight: "light",
      }}
    >
      No Internet Connection
    </div>
  );
};

export default NoInternetBanner;
