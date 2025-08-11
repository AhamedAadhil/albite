"use client";

import React from "react";

import { Routes } from "../../routes";
import { stores } from "../../stores";
import { components } from "../../components";

import { useAuthStore } from "@/stores/useAuthStore";
import { Gift, User, Mail, Phone, MapPin } from "lucide-react";

export const Checkout: React.FC = () => {
  const { total, discount, delivery, list, addonsList } = stores.useCartStore();

  const user = useAuthStore((state) => state.user);

  // Prepare regions list (example)
  // TODO:change region
  const regions = ["North", "South", "Eastern", "West", "Central"];
  // Use user.region or default to first option
  const [selectedRegion, setSelectedRegion] = React.useState(
    user?.region ?? regions[0]
  );
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

  // const totalAddons = addonsList.reduce((sum, addon) => {
  //   const price =
  //     typeof addon.addonId === "object" && addon.addonId !== null
  //       ? addon.addonId.price ?? 0
  //       : 0;
  //   return sum + price * (addon.quantity ?? 1);
  // }, 0);

  // Calculate points earned from the order
  const orderAmountForPoints = total ?? 0; // or subtotal without delivery/discount if you prefer
  const pointsEarned = Math.floor(
    orderAmountForPoints * Number(process.env.NEXT_PUBLIC_POINTS_PER_RUPEE)!
  );

  const [usePoints, setUsePoints] = React.useState(0);

  const maxPoints = user?.points ?? 0;
  // For example, 1 point = Rs. 1 discount
  const pointsValue = usePoints;

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val > maxPoints) val = maxPoints;
    if (val < 0) val = 0;
    setUsePoints(val);
  };

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
            border: "1px solid var(--main-turquoise)",
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
            border: "1px solid var(--main-turquoise)",
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

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              type="number"
              min={0}
              max={maxPoints}
              value={usePoints}
              onChange={handlePointsChange}
              style={{
                flex: 1, // input takes remaining space
                padding: 10,
                borderRadius: 6,
                border: "1px solid var(--border-color)",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
              placeholder="Enter points to use"
            />

            <button
              className="t12"
              style={{
                flexShrink: 0,
                padding: "12px 20px",
                backgroundColor:
                  usePoints > 0
                    ? "var(--main-turquoise)"
                    : "var(--border-color)",
                color:
                  usePoints > 0
                    ? "var(--white-color)"
                    : "var(--text-muted-color)",
                border: "none",
                borderRadius: 6,
                fontWeight: 600,
                cursor: usePoints > 0 ? "pointer" : "not-allowed",
                transition: "background-color 0.3s ease",
                whiteSpace: "nowrap",
              }}
              disabled={usePoints === 0}
              onClick={() => {
                // TODO: handle points application logic here
                alert(`Applied ${usePoints} loyalty points!`);
              }}
            >
              Apply Points
            </button>
          </div>
        </section>

        {/* SUMMARY */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            marginBottom: 14,
            border: "1px solid var(--main-turquoise)",
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
              Discount
            </span>
            <span className="t14">- Rs. {discount?.toFixed(2)}</span>
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
            <span className="t14">Rs. {delivery?.toFixed(2)}</span>
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
            <h4>Rs. {total?.toFixed(2)}</h4>
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
            border: "1px solid var(--main-turquoise)",
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
                  <span style={{ fontWeight: 500, fontSize: 14 }}>
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
                  <span style={{ fontWeight: 500, fontSize: 14 }}>
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
            border: "1px solid var(--main-turquoise)",
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

              border: "1px solid var(--main-turquoise)",
              backgroundColor: "var(--white-color)",
              // Add any other styling to make it distinct and lower on page
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
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
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
            border: "1px solid var(--main-turquoise)",
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
          label="Confirm order"
          href={Routes.ORDER_SUCCESSFUL}
        />
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
