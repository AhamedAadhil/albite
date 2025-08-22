"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { dish } from "../dish";

import { svg } from "../svg";
import { stores } from "../stores";
import { Routes } from "../routes";

import type { DishType } from "../types";
import { isAvailableNow } from "@/libs/isAvailableNow";
import toast from "react-hot-toast";
import PreOrderModal from "@/components/ConfirmPreorderModal";

type Props = {
  item: DishType;
};

export const RecommendedItem: React.FC<Props> = ({ item }) => {
  const [showPreOrderModal, setShowPreOrderModal] = useState(false);
  const { list: cart, addToCart } = stores.useCartStore();
  const {
    list: wishlist,
    addToWishlist,
    removeFromWishlist,
  } = stores.useWishlistStore();

  const dishId = item._id ?? item._id;

  const ifInWishlist = wishlist.find(
    (item) => item._id === dishId || item._id === dishId
  );

  const availableNow = isAvailableNow(item?.availableBefore);
  // const canOrderNow = item?.isActive && availableNow;
  // const canPreOrder = item?.isActive && !availableNow;

  const handleAddToCart = () => {
    if (!item) return;

    // if (!isDishAvailable(dish)) {
    //   toast.error("This dish is not available at this time.");
    //   return;
    // }

    if (!item.isActive) {
      toast.error("This dish is not available at this time.");
      return;
    }

    const existingCategory = cart[0]?.mainCategory;
    if (
      cart.length > 0 &&
      existingCategory &&
      existingCategory !== item.mainCategory
    ) {
      const confirmClear = confirm(
        `Your cart contains ${existingCategory} items. Replace with ${item.mainCategory}?`
      );
      if (!confirmClear) return;
      // clearCart();
      // TODO: implement clear cart
      console.log("clear cart");
    }

    // addToCart(dish._id!, dishQuantity, parcelType, selectedAddons);
    if (availableNow) {
      // existing logic to add to cart directly, checking cart category conflict
      // ... your existing confirmation logic here
      addToCart(dishId!, 1, "box", []);
    } else {
      // Show pre-order modal instead of immediate add
      setShowPreOrderModal(true);
    }
  };

  const confirmPreOrder = () => {
    if (!dish) return;

    // you may want to include your existing cart conflict confirmation here
    addToCart(dishId!, 1, "box", []);

    setShowPreOrderModal(false);
  };

  const cancelPreOrder = () => {
    setShowPreOrderModal(false);
  };

  return (
    <>
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
          src={item.image || "/placeholder/placeholder_dish.png"}
          alt={item.name || "Albite Dish"}
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
                handleAddToCart();
              }}
            >
              <svg.PlusSvg />
            </button>
          </div>
        </div>
      </Link>

      {/* PREORDER MODAL */}
      {showPreOrderModal && (
        <PreOrderModal
          show={showPreOrderModal}
          cancelPreOrder={cancelPreOrder}
          confirmPreOrder={confirmPreOrder}
        />
      )}
    </>
  );
};
