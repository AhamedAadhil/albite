"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { svg } from "../svg";
import { Routes } from "../routes";
import { stores } from "../stores";
import { dish as dishItem } from "../dish";

type Props = { dish: DishType };

import type { DishType } from "../types";
import PreOrderModal from "@/components/ConfirmPreorderModal";
import { isAvailableNow } from "@/libs/isAvailableNow";
import toast from "react-hot-toast";

export const WishlistItem: React.FC<Props> = ({ dish }) => {
  const { list: cart, addToCart } = stores.useCartStore();

  const {
    list: wishlist,
    addToWishlist,
    removeFromWishlist,
  } = stores.useWishlistStore();

  const ifInWishlist = wishlist.find((item) => item._id === dish._id);

  const [showPreOrderModal, setShowPreOrderModal] = useState(false);

  const availableNow = isAvailableNow(dish?.availableBefore);
  // const canOrderNow = item?.isActive && availableNow;
  // const canPreOrder = item?.isActive && !availableNow;

  const handleAddToCart = () => {
    if (!dish) return;

    // if (!isDishAvailable(dish)) {
    //   toast.error("This dish is not available at this time.");
    //   return;
    // }

    if (!dish.isActive) {
      toast.error("This dish is not available at this time.");
      return;
    }

    const existingCategory = cart[0]?.mainCategory;
    if (
      cart.length > 0 &&
      existingCategory &&
      existingCategory !== dish.mainCategory
    ) {
      const confirmClear = confirm(
        `Your cart contains ${existingCategory} items. Replace with ${dish.mainCategory}?`
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
      addToCart(dish._id!, 1, "box", []);
    } else {
      // Show pre-order modal instead of immediate add
      setShowPreOrderModal(true);
    }
  };

  const confirmPreOrder = () => {
    if (!dish) return;

    // you may want to include your existing cart conflict confirmation here
    addToCart(dish._id!, 1, "box", []);

    setShowPreOrderModal(false);
  };

  const cancelPreOrder = () => {
    setShowPreOrderModal(false);
  };

  return (
    <>
      <li
        style={{
          backgroundColor: "var(--white-color)",
          borderRadius: 10,
          position: "relative",
        }}
      >
        <Link href={`${Routes.MENU_ITEM}/${dish._id}`}>
          <Image
            src={dish.image || "/placeholder/placeholder_dish.png"}
            alt={"dish"}
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "90%",
              height: "auto",
              borderRadius: 10,
              margin: "0 auto",
            }}
          />
          {dish.isNew && (
            <Image
              alt="New"
              width={33.69}
              height={29}
              src={"/assets/icons/14.png"}
              style={{ left: 14, top: 14, position: "absolute" }}
            />
          )}
          {dish.isHot && (
            <Image
              src={"/assets/icons/15.png"}
              priority={true}
              alt="Hot"
              width={18}
              height={33}
              style={{ left: 14, top: 14, position: "absolute" }}
            />
          )}
          <button
            style={{
              position: "absolute",
              padding: 14,
              right: 0,
              bottom: 72 - 15,
              borderRadius: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (ifInWishlist) {
                removeFromWishlist(dish);
              } else {
                addToWishlist(dish);
              }
            }}
          >
            <svg.HeartSvg dish={dish} />
          </button>
          <div style={{ padding: 14, paddingTop: 0 }}>
            <div style={{ marginRight: 14 }}>
              <dishItem.DishName dish={dish} style={{ marginBottom: 3 }} />
            </div>
            <dishItem.DishPrice dish={dish} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleAddToCart();
              }}
              style={{
                position: "absolute",
                padding: 14,
                right: 0,
                bottom: 0,
                borderRadius: 10,
              }}
            >
              <svg.PlusSvg />
            </button>
          </div>
        </Link>
      </li>

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
