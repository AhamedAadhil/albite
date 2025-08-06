import React from "react";
import Link from "next/link";
import Image from "next/image";

import { svg } from "../svg";
import { Routes } from "../routes";
import { stores } from "../stores";
import { DishType } from "../types";
import { BabyIcon, UserIcon } from "lucide-react";

type Props = {
  dish: DishType;
  isLast: boolean;
};

const PlusSvg = () => {
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

export const MenuListItem: React.FC<Props> = ({ dish, isLast }) => {
  const { list: cart, addToCart } = stores.useCartStore();
  const {
    list: wishlist,
    addToWishlist,
    removeFromWishlist,
  } = stores.useWishlistStore();

  const qty = cart.find((item) => item._id === dish._id)?.quantity ?? 0;
  const ifInWishlist = wishlist.find((item) => item._id === dish._id);

  return (
    <li
      style={{
        borderRadius: 10,
        padding: "14px 14px",
        backgroundColor: "var(--white-color)",
        marginBottom: isLast ? 0 : 14,
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link href={`${Routes.MENU_ITEM}/${dish._id}`}>
        <Image
          src={dish.image}
          alt={dish.name}
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: 117,
            height: "auto",
            borderRadius: 10,
            marginRight: 10,
          }}
        />
      </Link>

      {/* {dish.isRecommended && (
        <Image
          src={"/icons/15.png"}
          alt="Hot"
          width={18}
          height={18}
          style={{
            left: 0,
            top: 0,
            marginLeft: 14,
            marginTop: 14,
            position: "absolute",
          }}
        />
      )} */}

      {/* isRecommended Badge */}
      {/* {dish.isRecommended && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 50,
            backgroundColor: "#FFDF80", // light orange
            color: "#663C00",
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          Recommended
        </div>
      )} */}

      {/* isPopular Badge */}
      {/* {dish.isPopular && (
        <div
          style={{
            position: "absolute",
            top: 38, // adjust to avoid overlapping
            right: 10,
            backgroundColor: "#F08080", // light red
            color: "white",
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          Popular
        </div>
      )} */}

      {dish.isNewDish && (
        <Image
          src={"/icons/14.png"}
          alt="New"
          width={34}
          height={34}
          style={{ margin: 14, left: 0, top: 0, position: "absolute" }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 4,
          }}
        >
          <span
            className="t14"
            style={{
              color: "var(--main-dark)",
              textTransform: "capitalize",
            }}
          >
            {dish.name}
          </span>

          {dish.isRecommended && (
            <span
              style={{
                backgroundColor: "#FFDF80",
                color: "#663C00",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              Recommended
            </span>
          )}

          {dish.isPopular && (
            <span
              style={{
                backgroundColor: "#F08080",
                color: "white",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              Popular
            </span>
          )}
        </div>

        <p
          className="number-of-lines-2 t10"
          style={{
            fontSize: 10,
            color: "var(--text-color)",
            lineHeight: 1.5,
            marginBottom: 4,
          }}
        >
          {dish.description}
        </p>
        <div
          className="t10"
          style={{
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <span>{dish.calories} kcal -</span>

          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {" "}
            Serves:
            {Array.from({ length: Math.floor(dish.servings) }).map((_, i) => (
              <UserIcon color="#f9a826" key={`user-${i}`} size={14} />
            ))}
            {dish.servings % 1 !== 0 && <BabyIcon color="#f9a826" size={14} />}
          </div>
        </div>

        <span
          className="t14"
          style={{
            color: "var(--main-dark)",
          }}
        >
          Rs.{dish.price}
        </span>
      </div>
      <button
        style={{
          padding: 14,
          position: "absolute",
          right: 0,
          top: 0,
          borderRadius: 4,
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
      {qty > 0 && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            height: 21,
            minWidth: 21,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 14,
            borderRadius: 12,
            backgroundColor: "var(--main-turquoise)",
          }}
        >
          <span className="t14" style={{ color: "var(--white-color)" }}>
            {qty}
          </span>
        </div>
      )}
      {qty === 0 && (
        <button
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            padding: 14,
            borderRadius: 4,
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            addToCart(dish);
          }}
        >
          <PlusSvg />
        </button>
      )}
    </li>
  );
};
