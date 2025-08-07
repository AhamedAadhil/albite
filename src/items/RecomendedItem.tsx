import React from "react";
import Link from "next/link";
import Image from "next/image";

import { dish } from "../dish";

import { svg } from "../svg";
import { stores } from "../stores";
import { Routes } from "../routes";

import type { DishType } from "../types";

type Props = {
  item: DishType;
};

export const RecommendedItem: React.FC<Props> = ({ item }) => {
  const { addToCart } = stores.useCartStore();
  const {
    list: wishlist,
    addToWishlist,
    removeFromWishlist,
  } = stores.useWishlistStore();

  const dishId = item._id ?? item._id;

  const ifInWishlist = wishlist.find(
    (item) => item._id === dishId || item._id === dishId
  );

  return (
    <Link
      className="column clickable"
      href={`${Routes.MENU_ITEM}/${item._id}`}
      style={{
        backgroundColor: "var(--white-color)",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      <Image
        src={item.image}
        alt="Dish"
        width={0}
        height={0}
        sizes="100vw"
        priority={true}
        style={{ width: "100%", height: "auto", borderRadius: "10px" }}
      />
      <button
        style={{
          position: "absolute",
          right: 10,
          top: 10,
          padding: 8,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "50%",
          zIndex: 2,
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (ifInWishlist) {
            removeFromWishlist(item);
          } else {
            addToWishlist(item);
          }
        }}
      >
        <svg.HeartSvg dish={item} />
      </button>

      <div className="column" style={{ padding: "14px" }}>
        <dish.DishName dish={item} style={{ marginBottom: 3 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <dish.DishPrice dish={item} />
          <button
            style={{
              position: "absolute",
              padding: "14px",
              right: 0,
              bottom: 0,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(item);
            }}
          >
            <svg.PlusSvg />
          </button>
        </div>
      </div>
    </Link>
  );
};
