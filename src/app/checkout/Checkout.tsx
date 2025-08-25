"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Routes } from "../../routes";
import { stores } from "../../stores";
import { components } from "../../components";

import { useAuthStore } from "@/stores/useAuthStore";
import { Gift, User, Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { fetchUserProfile } from "@/libs/getUserProfile";
import InfoPopup from "@/components/OrderInfo";
import { renderLoader } from "@/components/Loader";

export const Checkout: React.FC = () => {
  const { total, list, addonsList, resetCart } = stores.useCartStore();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [pointsPerRupee, setPointsPerRupee] = React.useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  const regionToSettingKey: Record<string, string> = {
    Akkaraipattu: "AKKARAIPATTU_DELIVERY_FEE",
    Palamunai: "PALAMUNAI_DELIVERY_FEE",
    Addalaichenai: "ADDALAICHENAI_DELIVERY_FEE",
    Sagamam: "SAGAMAM_DELIVERY_FEE",
    Kudiyiruppu: "KUDIYIRUPPU_DELIVERY_FEE",
  };

  const [fees, setFees] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    async function fetchFees() {
      setInitLoading(true);
      const settings: Record<string, number> = {};
      await Promise.all(
        Object.values(regionToSettingKey).map(async (settingKey) => {
          const res = await fetch(`/api/settings/${settingKey}`);
          if (res.ok) {
            const data = await res.json();
            settings[settingKey] = Number(data.value);
          } else {
            settings[settingKey] = 400; // default fallback fee
          }
        })
      );

      setFees(settings);
      setInitLoading(false);
    }
    fetchFees();
  }, []);

  React.useEffect(() => {
    async function fetchPointsPerRupee() {
      setInitLoading(true);
      const res = await fetch("/api/settings/POINTS_PER_RUPEE");
      if (res.ok) {
        const data = await res.json();
        setPointsPerRupee(Number(data.value));
      }
      setInitLoading(false);
    }
    fetchPointsPerRupee();
  }, []);

  // TODO:change region
  const regions = [
    "Akkaraipattu",
    "Palamunai",
    "Addalaichenai",
    "Sagamam",
    "Kudiyiruppu",
  ];
  // Use user.region or default to first option
  const [selectedRegion, setSelectedRegion] = React.useState(
    user?.region ?? regions[0]
  );
  const [usePoints, setUsePoints] = React.useState(0);
  const [deliveryNote, setDeliveryNote] = React.useState<string>("");

  React.useEffect(() => {
    if (user?.region && regions.includes(user.region.trim())) {
      setSelectedRegion(user.region.trim());
    }
  }, [user?.region]);

  // Delivery option state
  const [deliveryOption, setDeliveryOption] = React.useState<
    "delivery" | "takeaway"
  >("delivery");

  // Calculate points earned from the order
  // TODO:recalculate loyalty points math
  const orderAmountForPoints = total - usePoints; // or subtotal without delivery/discount if you prefer
  const pointsEarned = Math.floor(orderAmountForPoints * pointsPerRupee);

  const maxPoints = user?.points ?? 0;

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val > maxPoints) val = maxPoints;
    if (val < 0) val = 0;
    setUsePoints(val);
  };

  const handleDeliveryCost = (
    selectedRegion: string,
    deliveryOption: string
  ) => {
    if (deliveryOption !== "delivery") return 0;

    const settingKey = regionToSettingKey[selectedRegion];
    if (settingKey && fees[settingKey] !== undefined) {
      return fees[settingKey];
    }
    return 400; // fallback fee if missing
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!user) {
        console.warn("No user logged in");
        setLoading(false);
        return;
      }

      const orderedDishes = list.map((dish) => ({
        dish: dish._id,
        packageType: dish.packageType,
        quantity: dish.quantity,
      }));

      const orderedAddons = addonsList.map((addon) => {
        const addonId =
          typeof addon.addonId === "object" && addon.addonId !== null
            ? addon.addonId._id
            : addon.addonId;

        return {
          addon: addonId,
          quantity: addon.quantity,
        };
      });

      // Prepare order info object
      const orderInfo = {
        userId: user._id,
        deliveryRegion: selectedRegion,
        deliveryMethod: deliveryOption,
        deliveryNote,
        usedPoints: usePoints,
        dishes: orderedDishes,
        addons: orderedAddons,
        totalAmount: total,
        discount: usePoints,
        deliveryCharge: handleDeliveryCost,
      };

      const res = await fetch("/api/checkout", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderInfo),
      });

      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        toast.success(data.message || "Order submitted successfully!");
        resetCart();
        const fullProfile = await fetchUserProfile();
        if (fullProfile) {
          updateUser(fullProfile); // this will merge fields like region, etc.
        }

        router.push(Routes.ORDER_SUCCESSFUL);
      } else {
        setLoading(false);
        if (data.info) {
          setInfoMessage(data.message);
        } else {
          toast.error(data.message || "Failed to submit order.");
          router.push(Routes.ORDER_FAILED);
        }
      }

      // For now, just alert success for testing
      //  alert("Order info logged to console");
    } catch (error) {
      console.error("Error submitting order:", error);
      setLoading(false);
    }
  };

  if (initLoading) {
    return renderLoader();
  }

  const renderHeader = () => {
    return <components.Header title="Checkout" showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className="scrollable container"
        style={{ paddingTop: 10, paddingBottom: 10 }}
      >
        {/* Delivery region selection */}
        {/* <section
          style={{
            padding: 20,
            borderRadius: 10,
            marginBottom: 14,
            border: "1px solid #f9a826",
            backgroundColor: "var(--white-color)",
          }}
        >
          <label
            htmlFor="regionSelect"
            style={{
              fontWeight: 500,
              marginBottom: 8,
              display: "block",
              color: "var(--main-dark)",
            }}
          >
            Select Delivery Region
          </label>
          <select
            id="regionSelect"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid var(--border-color)",
              fontSize: "1rem",
            }}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </section> */}

        {/* USE LOYALTY */}
        <section
          style={{
            marginBottom: "14px",
            padding: 20,
            border: "1px solid #f9a826",
            borderRadius: 10,
            backgroundColor: "var(--white-color)",
            width: "100%", // full width of parent container
            boxSizing: "border-box",
          }}
        >
          <div
            className="t14"
            style={{
              marginBottom: 12,
              fontWeight: 600,
              color: "var(--main-dark)",
            }}
          >
            Use Loyalty Points ({maxPoints} available)
          </div>

          <input
            type="number"
            min={0}
            max={maxPoints}
            value={usePoints}
            onChange={handlePointsChange}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border:
                usePoints > 0
                  ? "2px solid #f9a826"
                  : "1px solid var(--border-color)",
              fontSize: "1rem",
              boxSizing: "border-box",
              fontWeight: 600,
              color: usePoints > 0 ? "#f9a826" : "var(--text-muted-color)",
              transition: "border-color 0.3s ease, color 0.3s ease",
              outline: "none",
            }}
            placeholder="Enter points to use"
          />

          {usePoints > 0 ? (
            <div
              style={{
                marginTop: 8,
                fontSize: "0.9rem",
                color: "#f9a826",
                fontWeight: 600,
              }}
            >
              {`Hooray! You saved Rs. ${usePoints}`}
            </div>
          ) : (
            <div
              style={{
                marginTop: 8,
                fontSize: "0.9rem",
                color: "var(--text-muted-color)",
              }}
            >
              Enter points to apply automatically.
            </div>
          )}
        </section>

        {/* SUMMARY */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            marginBottom: 14,
            border: "1px solid #f9a826",
            backgroundColor: "var(--white-color)",
          }}
        >
          <div
            style={{
              paddingBottom: 20,
              marginBottom: 20,
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <span
              className="t18"
              style={{ color: "var(--main-dark)", fontWeight: 600 }}
            >
              My order
            </span>
          </div>

          {/* Dishes */}
          <ul style={{ marginBottom: 14 }}>
            {list.map((dish) => (
              <li
                key={dish._id}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span className="t14">{dish.name}</span>
                <span className="t14">
                  {dish.quantity} x Rs. {dish.price}
                </span>
              </li>
            ))}
          </ul>

          {/* Addons */}
          {addonsList.length > 0 && (
            <div
              style={{
                borderTop: "1px solid var(--border-color)",
                paddingTop: 14,
                marginBottom: 14,
              }}
            >
              <span
                className="t16"
                style={{ fontWeight: 600, color: "var(--main-dark)" }}
              >
                Add-ons
              </span>
              <ul>
                {addonsList.map((addon) => {
                  const addonName =
                    typeof addon.addonId === "object" && addon.addonId !== null
                      ? addon.addonId.name
                      : "Add-on";
                  const addonPrice =
                    typeof addon.addonId === "object" && addon.addonId !== null
                      ? addon.addonId.price
                      : 0;
                  return (
                    <li
                      key={
                        addon._id ||
                        (typeof addon.addonId === "object"
                          ? addon.addonId._id
                          : addon.addonId)
                      }
                      style={{
                        marginBottom: 8,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="t14">{addonName}</span>
                      <span className="t14">
                        {addon.quantity} x Rs. {addonPrice}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Discount */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span className="t14" style={{ fontWeight: 600 }}>
              Albite Loyalty Discount
            </span>
            <span className="t14">- Rs. {usePoints?.toFixed(2)}</span>
          </div>

          {/* Delivery Charge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 0,
            }}
          >
            <span className="t14" style={{ fontWeight: 600 }}>
              Delivery
            </span>
            {/* <span className="t14">Rs. {delivery?.toFixed(2)}</span> */}
            <span className="t14">
              Rs.{handleDeliveryCost(selectedRegion, deliveryOption)}
            </span>
          </div>

          {/* Total */}
          <div
            style={{
              marginTop: 14,
              borderTop: "1px solid var(--border-color)",
              paddingTop: 14,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h4>Total</h4>
            {/* <h4>Rs. {total?.toFixed(2)}</h4> */}
            <h4>
              Rs.{" "}
              {(
                total +
                handleDeliveryCost(selectedRegion, deliveryOption) -
                usePoints
              ).toFixed(2)}
            </h4>
          </div>

          {/* Points Earned */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 12,
              marginTop: 12,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#f9a826", // bright color for reward
                color: "white",
                fontWeight: 700,
                padding: "6px 12px",
                borderRadius: 4,
                // boxShadow: "0 0 10px rgba(249, 168, 38, 0.7)",
                fontSize: "0.9rem",
                userSelect: "none",
              }}
            >
              {/* Reward/star icon (you can replace with your own icon or SVG) */}
              <Gift color="white" size={16} />

              <span style={{ color: "white" }}>
                you will earn {pointsEarned} Albite loyalty point
                {pointsEarned !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </section>

        {/* DELIVERY DETAILS */}
        <section
          style={{
            padding: 20,
            borderRadius: 12,
            marginBottom: 14,
            border: "1px solid #f9a826",
            backgroundColor: "var(--white-color)",
            boxShadow: "0 2px 8px rgba(249, 168, 38, 0.15)",
          }}
          aria-label="Delivery Details"
        >
          <h2
            className="t14"
            style={{
              fontWeight: 700,
              color: "var(--main-dark)",
              marginBottom: 20,
              borderBottom: "2px solid #f9a826",
              paddingBottom: 6,

              textTransform: "capitalize",
            }}
          >
            Delivery Details
          </h2>

          {user ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: "flex-start",
              }}
            >
              {/* Name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 160,
                  flex: "1 1 160px",
                  backgroundColor: "#FFF8E1",
                  padding: "10px 14px",
                  borderRadius: 8,
                  boxShadow: "0 1px 4px rgb(249 168 38 / 0.3)",
                  color: "var(--main-dark)",
                }}
              >
                <User color="#f9a826" size={20} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#f9a826",
                      fontSize: 12,
                      textTransform: "uppercase",
                      userSelect: "none",
                    }}
                    aria-label="Name"
                  >
                    Name
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100px",
                      display: "inline-block",
                    }}
                  >
                    {user.name}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 160,
                  flex: "1 1 160px",
                  backgroundColor: "#FFF8E1",
                  padding: "10px 14px",
                  borderRadius: 8,
                  boxShadow: "0 1px 4px rgb(249 168 38 / 0.3)",
                  color: "var(--main-dark)",
                }}
              >
                <Mail color="#f9a826" size={20} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#f9a826",
                      fontSize: 12,
                      textTransform: "uppercase",
                      userSelect: "none",
                    }}
                    aria-label="Email"
                  >
                    Email
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100px",
                      display: "inline-block",
                    }}
                  >
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Mobile */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 160,
                  flex: "1 1 160px",
                  backgroundColor: "#FFF8E1",
                  padding: "10px 14px",
                  borderRadius: 8,
                  boxShadow: "0 1px 4px rgb(249 168 38 / 0.3)",
                  color: "var(--main-dark)",
                }}
              >
                <Phone color="#f9a826" size={20} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#f9a826",
                      fontSize: 12,
                      textTransform: "uppercase",
                      userSelect: "none",
                    }}
                    aria-label="Mobile"
                  >
                    Mobile
                  </span>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>
                    {user.mobile}
                  </span>
                </div>
              </div>

              {/* Region */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 160,
                  flex: "1 1 160px",
                  backgroundColor: "#FFF8E1",
                  padding: "10px 14px",
                  borderRadius: 8,
                  boxShadow: "0 1px 4px rgb(249 168 38 / 0.3)",
                  color: "var(--main-dark)",
                }}
              >
                <MapPin color="#f9a826" size={20} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#f9a826",
                      fontSize: 12,
                      textTransform: "uppercase",
                      userSelect: "none",
                    }}
                    aria-label="Region"
                  >
                    Region
                  </span>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>
                    {selectedRegion ?? "Region not set"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p
              style={{
                color: "var(--text-muted-color)",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              No shipping information available. Please update your profile.
            </p>
          )}
        </section>

        {/* DELIVERY OPTION */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            border: "1px solid #f9a826",
            backgroundColor: "var(--white-color)",
            marginBottom: 14,
          }}
        >
          <span
            className="t14"
            style={{
              fontWeight: 600,
              marginBottom: 14,
              display: "block",
              color: "var(--main-dark)",
            }}
          >
            Select Delivery Option
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            <label style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name="deliveryOption"
                value="delivery"
                checked={deliveryOption === "delivery"}
                onChange={() => setDeliveryOption("delivery")}
              />{" "}
              Delivery
            </label>
            <label style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name="deliveryOption"
                value="takeaway"
                checked={deliveryOption === "takeaway"}
                onChange={() => setDeliveryOption("takeaway")}
              />{" "}
              Takeaway
            </label>
          </div>
        </section>

        {/* Delivery Region Selection - Show only if delivery is selected */}
        {deliveryOption === "delivery" && (
          <section
            style={{
              padding: 20,
              borderRadius: 10,
              marginBottom: 14,

              border: "1px solid #f9a826",
              backgroundColor: "var(--white-color)",
            }}
          >
            <label
              className="t14"
              htmlFor="regionSelect"
              style={{
                fontWeight: 500,
                marginBottom: 8,
                display: "block",
                color: "var(--main-dark)",
              }}
            >
              Select Delivery Region
            </label>
            <select
              id="regionSelect"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid var(--border-color)",
                fontSize: "1rem",
              }}
            >
              {/* {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))} */}

              {regions.map((region) => {
                const settingKey = regionToSettingKey[region];
                const fee =
                  settingKey && fees[settingKey] !== undefined
                    ? fees[settingKey]
                    : 400; // fallback fee

                return (
                  <option key={region} value={region}>
                    {region} - Rs. {fee}
                  </option>
                );
              })}
            </select>
          </section>
        )}

        {/* Delivery Note */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: "var(--white-color)",
            marginBottom: 14,
            border: "1px solid #f9a826",
          }}
        >
          <label
            className="t14"
            htmlFor="deliveryNote"
            style={{
              fontWeight: 600,
              marginBottom: 8,
              display: "block",
              color: "var(--main-dark)",
            }}
          >
            Delivery Note (optional)
          </label>
          <textarea
            className="t12"
            id="deliveryNote"
            value={deliveryNote}
            onChange={(e) => setDeliveryNote(e.target.value)}
            rows={4}
            placeholder="Add any special instructions for your delivery..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 6,
              border: "1px solid var(--border-color)",
              fontSize: "1rem",
              resize: "vertical",
              fontFamily: "inherit",
              color: "var(--main-dark)",
            }}
          />
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section style={{ padding: 20 }}>
        <components.Button
          label={
            loading
              ? "Confirming..."
              : `Confirm order (Rs. ${(
                  total +
                  handleDeliveryCost(selectedRegion, deliveryOption) -
                  usePoints
                ).toFixed(2)})`
          }
          disabled={loading}
          onClick={handleSubmit}
          style={{ backgroundColor: "#ed1a25", borderColor: "#ed1a25" }}
        />
        {infoMessage && (
          <InfoPopup
            message={infoMessage}
            onClose={() => setInfoMessage(null)}
          />
        )}
      </section>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </components.Screen>
  );
};
