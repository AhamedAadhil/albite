"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Routes } from "../../../routes";
import { components } from "../../../components";

import { customMenu } from "../data";

export const Menu: React.FC = () => {
  const renderHeader = () => {
    return <components.Header user={true} userName={true} showBasket={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className="scrollable container"
        style={{ paddingTop: 10, paddingBottom: 10 }}
      >
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 15,
          }}
        >
          {customMenu.map((item) => {
            const category = item.name.toLowerCase().replace(" ", "-");
            return (
              <li key={item.id}>
                <div
                  style={{
                    position: "relative",
                    opacity: item.isAvailable ? 1 : 0.5,
                    pointerEvents: item.isAvailable ? "auto" : "none",
                  }}
                >
                  <Link href={`${Routes.MENU_LIST}/${category}`}>
                    {/* Responsive Image */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "1 / 1",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={item.image || "/placeholder/placeholder_dish.png"}
                        alt={item.name || "Albite Dish"}
                        fill
                        sizes="(max-width: 768px) 45vw, 20vw"
                        priority
                        style={{
                          objectFit: "cover",
                          filter: item.isAvailable ? "none" : "grayscale(100%)",
                        }}
                      />
                    </div>

                    {/* Responsive Label */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: 10,
                        left: 10,
                        backgroundColor: "#fef102",
                        color: "#ed1a25",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: "12px",
                        fontWeight: "700",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "calc(100% - 20px)",
                      }}
                      className="number-of-lines-1"
                    >
                      {item.name}
                    </span>
                  </Link>

                  {/* Coming Soon Badge */}
                  {!item.isAvailable && (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "#ed1a25",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    >
                      Coming Soon
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
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
