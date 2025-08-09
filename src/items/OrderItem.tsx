import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { Routes } from "../routes";
import { stores } from "../stores";
import { dish as dishItem } from "../dish";

import type { DishType } from "../types";
import { Box } from "lucide-react";

type Props = { dish: DishType; addons: any; isLast: boolean };

const MinusSvg: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} fill="none">
      <rect width={21} height={21} fill="#E6F3F8" rx={10.5} />
      <path
        stroke="#0C1D2E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M6.125 10.5h8.75"
      />
    </svg>
  );
};

const PlusSvg: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} fill="none">
      <rect width={21} height={21} fill="#E6F3F8" rx={10.5} />
      <path
        stroke="#0C1D2E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M10.5 6.125v8.75M6.125 10.5h8.75"
      />
    </svg>
  );
};

export const OrderItem: React.FC<Props> = ({ dish, addons, isLast }) => {
  const { addToCart, updateCart, list } = stores.useCartStore();
  const dishInCart = list.find((item) => item._id === dish._id);

  console.log(dishInCart, "dishincart");

  console.log(addons);

  // Deduplicate addons by addonId and sum quantities
  const mergedAddons = useMemo(() => {
    const map = new Map<string, any>();
    addons.forEach((addon: any) => {
      const id = addon.addonId._id || addon.addonId;
      if (map.has(id)) {
        map.get(id).quantity += addon.quantity;
      } else {
        map.set(id, { ...addon, quantity: addon.quantity });
      }
    });
    return Array.from(map.values());
  }, [addons]);

  // Dish quantity handlers
  const decreaseDishQuantity = () => {
    updateCart({
      dishes: [{ dishId: dish._id!, quantity: (dish.quantity ?? 1) - 1 }],
      addons: [],
    });
  };

  const increaseDishQuantity = () => {
    addToCart(dish._id!, 1, "box", []);
  };

  const getAddonId = (a: any) =>
    typeof a.addonId === "object" ? a.addonId._id : a.addonId;

  const decreaseAddonQuantity = (addonId: string, currentQty: number) => {
    const newAddons = mergedAddons.map((a) => {
      const id = getAddonId(a);
      return id === addonId
        ? { addonId: id, quantity: currentQty - 1 }
        : { addonId: id, quantity: a.quantity };
    });
    // .filter((a) => a.quantity > 0);

    updateCart({
      dishes: [],
      addons: newAddons,
    });
  };

  const increaseAddonQuantity = (addonId: string, currentQty: number) => {
    const newAddons = mergedAddons.map((a) => {
      const id = getAddonId(a);
      return id === addonId
        ? { addonId: id, quantity: currentQty + 1 }
        : { addonId: id, quantity: a.quantity };
    });

    updateCart({
      dishes: [],
      addons: newAddons,
    });
  };

  return (
    <div>
      <li>
        <Link
          href={`${Routes.MENU_ITEM}/${dish._id}`}
          style={{
            paddingRight: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            marginBottom: isLast ? 0 : 14,
            borderRadius: "var(--border-radius)",
            backgroundColor: "var(--white-color)",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Image
            src={dish.image}
            alt="dish"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "20%",
              height: "auto",
              borderRadius: 10,
              marginRight: 8,
              marginLeft: 4,
              flexShrink: 0,
            }}
          />
          <div style={{ marginRight: "auto", flex: 1 }}>
            <dishItem.DishName
              dish={dish}
              style={{ marginBottom: 4, marginTop: 10 }}
            />
            <span
              style={{
                marginBottom: 14,
                display: "block",
                color: "var(--text-muted-color)",
                fontSize: "0.85rem",
                lineHeight: 1.2,
              }}
              className="t10 number-of-lines-1"
            >
              {dish.description}
            </span>
            <dishItem.DishPrice dish={dish} />
            {/* Render package type */}
            <span
              style={{
                marginTop: 14,
                marginBottom: 10,
                fontWeight: "500",
                fontSize: "0.9rem",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>
                <Box color="#f9a826" size={13} />
              </span>
              <span>Pack in: {dishInCart!.packageType}</span>
            </span>
          </div>
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              marginLeft: 8,
            }}
          >
            <button
              style={{
                padding: "14px 14px 4px 14px",
                borderRadius: 4,
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                decreaseDishQuantity();
              }}
              aria-label="Decrease dish quantity"
            >
              <MinusSvg />
            </button>

            <span className="t12" style={{ lineHeight: 1 }}>
              {dish.quantity ?? 1}
            </span>

            <button
              style={{
                padding: "4px 14px 14px 14px",
                borderRadius: 4,
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                increaseDishQuantity();
              }}
              aria-label="Increase dish quantity"
            >
              <PlusSvg />
            </button>

            {dish.isNewDish && (
              <Image
                alt="New"
                width={34}
                height={29}
                src={"/assets/icons/14.png"}
                style={{ left: 7, top: 7, position: "absolute" }}
              />
            )}
            {/* {dish.isHot && (
              <Image
                src={"/assets/icons/15.png"}
                priority={true}
                alt="Hot"
                width={13}
                height={24}
                style={{ left: 7, top: 7, position: "absolute" }}
              />
            )} */}
          </div>
        </Link>
      </li>

      {isLast && mergedAddons.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: 10,
              paddingLeft: 50,
              color: "var(--text-primary-color)",
            }}
          >
            Add-ons
          </h3>
          <ul
            style={{
              paddingLeft: 50,
              marginTop: 0,
              listStyleType: "none",
              marginBottom: 0,
            }}
          >
            {mergedAddons.map((addon: any) => (
              <li
                key={addon._id || addon.addonId._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <Image
                    src={addon.addonId.image}
                    alt={addon.addonId.name}
                    width={40}
                    height={40}
                    style={{ borderRadius: 6, marginRight: 12, flexShrink: 0 }}
                  />
                  <span className="t12" style={{ fontWeight: 500 }}>
                    {addon.addonId.name}
                  </span>
                </div>

                <span
                  className="t12"
                  style={{ width: 70, textAlign: "right", flexShrink: 0 }}
                >
                  Rs. {addon.addonId.price}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginLeft: 16,
                    flexShrink: 0,
                  }}
                >
                  <button
                    style={{
                      padding: "8px",
                      borderRadius: 4,
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      opacity: 1,
                    }}
                    onClick={() =>
                      decreaseAddonQuantity(addon.addonId._id, addon.quantity)
                    }
                    aria-label={`Decrease quantity of ${addon.addonId.name}`}
                  >
                    <MinusSvg />
                  </button>

                  <span
                    className="t12"
                    style={{ minWidth: 20, textAlign: "center" }}
                    aria-live="polite"
                  >
                    {addon.quantity}
                  </span>

                  <button
                    style={{
                      padding: "8px",
                      borderRadius: 4,
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      increaseAddonQuantity(addon.addonId._id, addon.quantity)
                    }
                    aria-label={`Increase quantity of ${addon.addonId.name}`}
                  >
                    <PlusSvg />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
