"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { svg } from "../../../svg";
import { stores } from "../../../stores";
import { components } from "../../../components";
import { DishType } from "@/types";
import { UserIcon, BabyIcon } from "lucide-react";
import { renderLoader } from "@/components/Loader";

type Props = {
  menuItemId: string;
};

type AddOn = {
  image: string | undefined;
  _id: string;
  name: string;
  price: number;
  mainCategory: "breakfast" | "lunch" | "dinner";
  isActive: boolean;
};

export const MenuItem: React.FC<Props> = ({ menuItemId }) => {
  const [dish, setDish] = useState<DishType | null>(null);
  const [dishQuantity, setDishQuantity] = useState(1);
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [parcelType, setParcelType] = useState<"box" | "bag">("box");
  // Instead of string array, use a map of addonId to quantity
  const [selectedAddons, setSelectedAddons] = useState<{
    [addonId: string]: number;
  }>({});

  const {
    list: cart,
    addToCart,
    removeFromCart,
    // clearCart,
  } = stores.useCartStore();
  const {
    list: wishlist,
    addToWishlist,
    removeFromWishlist,
  } = stores.useWishlistStore();

  const quantity = cart.find((item) => item._id === dish?._id)?.quantity ?? 1;
  const ifInWishlist = wishlist.find((item) => item._id === dish?._id);

  // 🍱 Fetch dish & addons
  useEffect(() => {
    const fetchDish = async () => {
      try {
        const res = await fetch(`/api/dishes/${menuItemId}`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success) {
          setDish(data.dish);
          setAddons(data.addons);
          setParcelType(data.dish.parcelOptions[0] ?? "box");
        }
      } catch (err) {
        console.error("Error fetching dish", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [menuItemId]);

  // ⏰ Dish availability logic
  const isDishAvailable = (dish: DishType | null): boolean => {
    if (!dish || !dish.isActive) return false;
    const now = new Date();
    const [hour, minute] = dish.availableBefore.split(":").map(Number);
    const availableUntil = new Date();
    availableUntil.setHours(hour, minute, 0, 0);
    return now < availableUntil;
  };

  const incrementAddon = (id: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  };

  const decrementAddon = (id: string) => {
    setSelectedAddons((prev) => {
      if (!prev[id]) return prev;
      const newQty = prev[id] - 1;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const incrementQuantity = () => {
    setDishQuantity((prevQty) => prevQty + 1);
  };

  const decrementQuantity = () => {
    setDishQuantity((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!dish) return;

    if (!isDishAvailable(dish)) {
      alert("This dish is not available at this time.");
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

    addToCart({
      ...dish,
      _id: dish._id,
      quantity: dishQuantity,
      parcelOptions: [parcelType],
      //  selectedAddons,
      mainCategory: dish.mainCategory,
    });
  };

  const renderImage = () => {
    return (
      <section
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--white-color)",
          padding: "30px 0 40px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          borderRadius: 16,
        }}
      >
        {/* Main Dish Image */}
        <Image
          src={dish?.image ?? ""}
          alt={dish?.name ?? "Dish"}
          width={500}
          height={0}
          sizes="100vw"
          style={{
            width: "70%",
            height: "auto",
            borderRadius: 10,
            objectFit: "cover",
          }}
        />

        {/* New Dish Icon */}
        {dish?.isNewDish && (
          <Image
            src="/assets/icons/14.png"
            alt="New"
            width={58}
            height={50}
            style={{ position: "absolute", top: 21, left: 20 }}
          />
        )}

        {/* Wishlist Button */}
        <button
          aria-label={ifInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          style={{
            position: "absolute",
            top: 25,
            right: 23,
            background: "rgba(255,255,255,0.85)",
            borderRadius: "50%",
            border: "none",
            padding: 8,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            transition: "background 0.3s",
          }}
          onClick={(e) => {
            e.preventDefault();
            if (!dish) return;
            if (ifInWishlist) removeFromWishlist(dish);
            else addToWishlist(dish);
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255, 230, 230, 0.95)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.85)")
          }
        >
          {dish && <svg.HeartBigSvg dish={dish} />}
        </button>
      </section>
    );
  };

  const renderDetails = () => (
    <section
      className="container"
      style={{
        marginTop: 25,
        marginBottom: 25,
        padding: "0 10px",
      }}
    >
      <div
        style={{
          marginBottom: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <h3
          style={{
            textTransform: "capitalize",
            fontSize: 26,
            fontWeight: "700",
            color: "#2c3e50",
            marginRight: 12,
            flexGrow: 1,
          }}
        >
          {dish?.name}
        </h3>

        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          {dish?.isRecommended && (
            <span
              style={{
                backgroundColor: "#FFDF80",
                color: "#663C00",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: "bold",
                boxShadow: "0 1px 5px rgba(255, 223, 128, 0.7)",
              }}
            >
              Recommended
            </span>
          )}

          {dish?.isPopular && (
            <span
              style={{
                backgroundColor: "#F08080",
                color: "white",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: "bold",
                boxShadow: "0 1px 5px rgba(240, 128, 128, 0.7)",
              }}
            >
              Popular
            </span>
          )}
        </div>
      </div>

      {/* New block for averageRating and reviews count */}
      {dish?.averageRating !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            color: "#555",
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          <span
            style={{
              backgroundColor: "#FFD166",
              borderRadius: 4,
              padding: "2px 6px",
              fontWeight: "700",
            }}
          >
            {dish.averageRating.toFixed(1)} ★
          </span>
          <span>({dish.reviews?.length ?? 0} reviews)</span>
        </div>
      )}

      <span
        className="t16"
        style={{
          color: "#666666",
          fontWeight: "500",
          fontSize: 14,
          marginBottom: 10,
          display: "block",
          opacity: 0.8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>{dish?.calories} kcal •</span>
          <span
            style={{ display: "flex", alignItems: "center", gap: 2 }}
            aria-label={`Serves ${dish?.servings} persons`}
          >
            {" "}
            Serves:
            {dish?.servings !== undefined &&
              Array.from({ length: Math.floor(dish?.servings) }).map((_, i) => (
                <UserIcon color="#f9a826" key={`user-${i}`} size={14} />
              ))}
            {dish?.servings !== undefined && dish?.servings % 1 !== 0 && (
              <BabyIcon color="#f9a826" size={14} />
            )}
          </span>
        </div>
      </span>

      <p
        className="t16"
        style={{
          fontSize: 16,
          color: "#444444",
          lineHeight: 1.5,
          fontWeight: "400",
        }}
      >
        {dish?.description}
      </p>
    </section>
  );

  const renderParcelOptions = () =>
    dish?.parcelOptions && (
      <section
        className="container"
        style={{
          marginBottom: 20,
          padding: "0 10px",
        }}
      >
        <h4
          style={{
            marginBottom: 10,
            fontSize: 18,
            fontWeight: "600",
            color: "#333333",
          }}
        >
          Select Parcel Type
        </h4>
        {dish.parcelOptions.map((option: any) => (
          <button
            key={option}
            onClick={() => setParcelType(option)}
            style={{
              display: "inline-block",
              marginRight: 12,
              padding: "8px 14px",
              border:
                parcelType === option ? "2px solid #2c3e50" : "1px solid #ccc",
              backgroundColor: parcelType === option ? "#f0f4f8" : "white",
              borderRadius: 8,
              fontWeight: parcelType === option ? "700" : "500",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              marginBottom: 10,
            }}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </section>
    );

  const renderAddOns = () =>
    addons.length > 0 && (
      <section
        className="container"
        style={{
          marginBottom: 30,
          padding: "0 10px",
        }}
      >
        <h4
          style={{
            marginBottom: 12,
            fontSize: 18,
            fontWeight: "600",
            color: "#333333",
          }}
        >
          Add-ons
        </h4>
        {addons.map((addon) => {
          const quantity = selectedAddons[addon._id] ?? 0;
          return (
            <div
              key={addon._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
                fontSize: 15,
                color: "#444",
                userSelect: "none",
                gap: 12,
              }}
            >
              {/* Addon image */}
              <img
                src={addon.image}
                alt={addon.name}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 6,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
              />

              {/* Addon Name and price */}
              <span style={{ flexGrow: 1 }}>
                {addon.name}{" "}
                <span style={{ color: "#888" }}> (+Rs.{addon.price})</span>
              </span>

              {/* Quantity controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: "#f0f4f8",
                  borderRadius: 6,
                  padding: "6px 10px",
                }}
              >
                <button
                  onClick={() => decrementAddon(addon._id)}
                  aria-label={`Decrease quantity of ${addon.name}`}
                  style={{
                    border: "none",
                    backgroundColor: quantity > 0 ? "#2c3e50" : "#ccc",
                    color: "white",
                    cursor: quantity > 0 ? "pointer" : "not-allowed",
                    borderRadius: 4,
                    width: 28,
                    height: 28,
                    fontWeight: "bold",
                    fontSize: 18,
                    lineHeight: 1,
                    userSelect: "none",
                    display: "flex", // Add
                    alignItems: "center", // Add
                    justifyContent: "center", // Add
                  }}
                  disabled={quantity === 0}
                >
                  –
                </button>
                <span
                  style={{
                    minWidth: 20,
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => incrementAddon(addon._id)}
                  aria-label={`Increase quantity of ${addon.name}`}
                  style={{
                    border: "none",
                    backgroundColor: "#2c3e50",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: 4,
                    width: 28,
                    height: 28,
                    fontWeight: "bold",
                    fontSize: 18,
                    lineHeight: 1,
                    userSelect: "none",
                    display: "flex", // Add
                    alignItems: "center", // Add
                    justifyContent: "center", // Add
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </section>
    );

  const renderPriceWithCounter = () => (
    <section
      className="container"
      style={{
        padding: "0 10px",
        marginBottom: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "var(--white-color)",
          borderRadius: "var(--border-radius)",
          boxShadow: "0 2px 7px rgba(0,0,0,0.07)",
          padding: "14px 24px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#222222",
              letterSpacing: 0.3,
            }}
          >
            Rs.{dish?.price}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <button
            style={{
              padding: 14,
              border: "none",
              backgroundColor: "#e5e5e5",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
            onClick={decrementQuantity}
            aria-label="Remove one item"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#d4d4d4")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#e5e5e5")
            }
          >
            <svg.MinusSvg />
          </button>
          <span
            className="t14"
            style={{
              fontSize: 16,
              fontWeight: "600",
              minWidth: 22,
              textAlign: "center",
            }}
          >
            {dishQuantity}
          </span>
          <button
            style={{
              padding: 14,
              border: "none",
              backgroundColor: "#2c3e50",
              borderRadius: 8,
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
            onClick={incrementQuantity}
            aria-label="Add one item"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1f2b37")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2c3e50")
            }
          >
            <svg.PlusSvg />
          </button>
        </div>
      </div>
    </section>
  );

  const formatTime = (timeStr: string) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    // Format to 12-hour am/pm format (optional)
    const ampm = hour >= 12 ? "PM" : "AM";
    const hr12 = hour % 12 === 0 ? 12 : hour % 12;
    const paddedMinute = minute.toString().padStart(2, "0");
    return `${hr12}:${paddedMinute} ${ampm}`;
  };

  const renderActions = () => {
    if (!dish) return null;

    const [hour, minute] = dish.availableBefore.split(":").map(Number);
    const availableUntil = new Date();
    availableUntil.setHours(hour, minute, 0, 0);

    const isAvailable = isDishAvailable(dish);

    // Assuming availableFrom is midnight 00:00
    const availableFromTime = "00:00"; // You can adjust this if you have actual start time.
    const availableFromFormatted = formatTime(availableFromTime);

    const addonsTotalPrice = addons
      .filter((addon) => (selectedAddons[addon._id] ?? 0) > 0)
      .reduce(
        (acc, addon) => acc + addon.price * (selectedAddons[addon._id] ?? 0),
        0
      );

    const dishTotalPrice = (Number(dish?.price) || 0) * dishQuantity;

    return (
      <section
        className="container"
        style={{
          paddingTop: 10,
          paddingBottom: 40,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <components.Button
          label={
            isAvailable
              ? `Add to Cart (Rs.${dishTotalPrice + addonsTotalPrice})`
              : `Available from ${availableFromFormatted}`
          }
          onClick={handleAddToCart}
          disabled={!isAvailable}
          containerStyle={{
            marginBottom: 14,
            width: "100%",
            fontSize: 18,
            fontWeight: "700",
            borderRadius: 12,
          }}
        />

        <components.Button
          label="Reviews"
          href="/reviews"
          colorScheme="secondary"
          containerStyle={{ width: "100%", fontSize: 16, fontWeight: "600" }}
        />
      </section>
    );
  };

  if (loading) {
    return renderLoader();
  }

  if (!dish) {
    return <p style={{ padding: 20, textAlign: "center" }}>Dish not found</p>;
  }

  return (
    <components.Screen>
      <components.Header showGoBack showBasket />
      <div
        className="scrollable"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fafafa",
          borderRadius: 16,
          margin: "0 10px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          overflowY: "auto",
          paddingBottom: 10,
        }}
      >
        {renderImage()}
        {renderDetails()}
        {renderParcelOptions()}
        {renderAddOns()}
        {renderPriceWithCounter()}
        {renderActions()}
      </div>
    </components.Screen>
  );
};
