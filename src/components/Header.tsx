"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

import { svg } from "../svg";
import { stores } from "../stores";
import { Routes } from "../routes";
import { TabScreens } from "../routes";

import { useAuthStore } from "@/stores/useAuthStore";
import getInitials from "@/libs/getInitials";

type Props = {
  user?: boolean;
  title?: string;
  userName?: boolean;
  document?: boolean;
  creditCard?: boolean;
  showGoBack?: boolean;
  showBasket?: boolean;
};

export const Header: React.FC<Props> = ({
  showGoBack,
  title,
  user,
  userName,
  showBasket,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const { total } = stores.useCartStore();
  const { setScreen } = stores.useTabStore();
  const { openModal } = stores.useModalStore();

  const { user: authUser } = useAuthStore(); // Get user from Zustand

  const renderGoBack = () => {
    if (!showGoBack) return null;
    return (
      <button
        onClick={() => router.back()}
        style={{ left: "0px", padding: "0 20px", position: "absolute" }}
      >
        <svg.GoBackSvg />
      </button>
    );
  };

  const renderUser = () => {
    if (!user && !userName) return null;

    const displayName = authUser?.name || "Guest";
    const initials = getInitials(displayName);

    return (
      <button
        style={{ position: "absolute", left: 0, padding: 20 }}
        onClick={() => openModal()}
      >
        <div
          style={{ gap: 10, alignItems: "center", display: "flex" }}
          className="clickable"
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#007bff",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          {userName && <h5 className="t14 main-dark">{displayName}</h5>}
        </div>
      </button>
    );
  };

  const renderTitle = () => {
    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <h4 className="main-dark" style={{ fontSize: 16 }}>
          {title}
        </h4>
      </div>
    );
  };

  const renderBasket = () => {
    if (!showBasket) return null;

    return (
      <button
        onClick={() => {
          setScreen(TabScreens.ORDER);
          if (pathname !== Routes.TAB_NAVIGATOR) {
            router.push(Routes.TAB_NAVIGATOR);
          }
        }}
        style={{
          height: "100%",
          width: "auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          position: "absolute",
          right: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            backgroundColor: "var(--main-turquoise)",
            padding: "5px 4px 3px 4px",
            borderRadius: "12px",
            right: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              color: "var(--white-color)",
              fontWeight: 700,
              marginBottom: 1,
              fontSize: 10,
            }}
          >
            ${total > 0 ? total.toFixed(2) : "0"}
          </span>
        </div>
        <svg.HeaderBasketSvg />
      </button>
    );
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          position: "relative",
          height: "var(--header-height)",
        }}
      >
        {renderGoBack()}
        {renderUser()}
        {renderTitle()}
        {renderBasket()}
      </header>
    </>
  );
};
