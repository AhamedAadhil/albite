"use client";

import React from "react";

import { Routes } from "../../routes";
import { stores } from "../../stores";
import { components } from "../../components";

import { useAuthStore } from "@/stores/useAuthStore";

export const Checkout: React.FC = () => {
  const { total, discount, delivery, list, addonsList } = stores.useCartStore();

  const user = useAuthStore((state) => state.user);

  console.log(user?.region, "region");

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
        </section>

        {/* SHIPPING DETAILS */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            marginBottom: 14,
            backgroundColor: "var(--white-color)",
          }}
          className="clickable"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: 12,
              backgroundColor: "var(--white-color)",
              borderRadius: 10,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <span
              className="t14"
              style={{
                fontWeight: 600,
                marginBottom: 8,
                color: "var(--main-dark)",
                textTransform: "capitalize",
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: 4,
              }}
            >
              Delivery Details
            </span>

            {user ? (
              <>
                <div style={{ display: "flex", gap: 8 }}>
                  <strong>Name:</strong>
                  <span>{user.name}</span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <strong>Email:</strong>
                  <span>{user.email}</span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <strong>Mobile:</strong>
                  <span>{user.mobile}</span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <strong>Region:</strong>
                  <span>{user.region || "Region not set"}</span>
                </div>
              </>
            ) : (
              <span
                className="t12"
                style={{ color: "var(--text-muted-color)" }}
              >
                No shipping information available. Please update your profile.
              </span>
            )}
          </div>
        </section>

        {/* DELIVERY OPTION */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
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
