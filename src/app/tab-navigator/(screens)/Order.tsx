"use client";

import React from "react";

import { items } from "../../../items";
import { stores } from "../../../stores";
import { Routes } from "../../../routes";
import { components } from "../../../components";

export const Order: React.FC = () => {
  const { list } = stores.useCartStore();
  const { addonsList } = stores.useCartStore();

  console.log("list", list);
  console.log("addonsList", addonsList);

  const renderHeader = () => {
    return <components.Header user={true} title="Order" showBasket={true} />;
  };

  const renderContent = () => {
    const subtotalDishes = list.reduce(
      (sum, dish) => sum + Number(dish.price) * (dish.quantity ?? 1),
      0
    );

    const subtotalAddons = addonsList.reduce((sum, addon) => {
      // Check if addon.addonId is an object with price property
      const price =
        typeof addon.addonId === "object" && addon.addonId !== null
          ? addon.addonId.price ?? 0
          : 0;

      return sum + price * (addon.quantity ?? 1);
    }, 0);

    const discount = 0; // If points translate 1:1 to discount amount

    const total = subtotalDishes + subtotalAddons - discount;

    return (
      <main
        className="scrollable container"
        style={{ paddingTop: 10, paddingBottom: 10 }}
      >
        {/* DISHES */}
        <section style={{ marginBottom: 20 }}>
          <ul>
            {list.map((dish, index, array) => {
              const isLast = index === array.length - 1;
              const addons = addonsList.filter(
                (addon: any) => addon.addonId.mainCategory === dish.mainCategory
              );

              return (
                <items.OrderItem
                  dish={dish}
                  addons={addons}
                  key={dish._id}
                  isLast={isLast}
                />
              );
            })}
          </ul>
        </section>

        {/* APPLES PROMOCODE */}
        {/* <section style={{ marginBottom: "10%" }}>
          <button>
            <svg.ApplyPromocodeSvg />
          </button>
        </section> */}

        {/* SUMMARY */}
        <section style={{ marginBottom: 20 }}>
          <div
            style={{
              padding: 20,
              borderRadius: 10,
              border: "1px solid var(--main-turquoise)",
            }}
          >
            <ul>
              {/* SUBTOTAL DISHES */}
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  className="t14"
                  style={{ color: "var(--main-dark)", fontWeight: 500 }}
                >
                  Dishes Total
                </span>
                <span className="t14" style={{ color: "var(--main-dark)" }}>
                  Rs. {subtotalDishes.toFixed(2)}
                </span>
              </li>

              {/* SUBTOTAL ADDONS */}
              {subtotalAddons > 0 && (
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span
                    className="t14"
                    style={{ color: "var(--main-dark)", fontWeight: 500 }}
                  >
                    Add-ons Total
                  </span>
                  <span className="t14" style={{ color: "var(--main-dark)" }}>
                    Rs. {subtotalAddons.toFixed(2)}
                  </span>
                </li>
              )}

              {/* DISCOUNT */}
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <span
                  className="t14"
                  style={{ color: "var(--main-dark)", fontWeight: 500 }}
                >
                  Discount
                </span>
                <span className="t14" style={{ color: "var(--main-dark)" }}>
                  Rs. {discount.toFixed(2)}
                </span>
              </li>

              {/* NO DELIVERY FEE here, skip */}

              {/* TOTAL (without delivery) */}
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5>Total (excluding delivery)</h5>
                <h5>Rs. {total.toFixed(2)}</h5>
              </li>
            </ul>
          </div>
        </section>

        {/* BUTTON */}
        <section>
          <components.Button label="Checkout" href={Routes.CHECKOUT} />
        </section>
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
