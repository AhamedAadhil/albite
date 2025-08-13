"use client";

import React, { useState } from "react";
import { Package, Bike } from "lucide-react";

import { hooks } from "../../hooks";
import { Routes } from "../../routes";
import { components } from "../../components";
import { renderLoader } from "@/components/Loader";

export const OrderHistory: React.FC = () => {
  const { orders, ordersLoading, error } = hooks.useGetOrders();
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  // useEffect(() => {
  //   if (orders.length === 0) {
  //     return router.push(Routes.ORDER_HISTORY_EMPTY);
  //   }
  // }, [orders.length]);

  const handleToggle = (id: string) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const deliveryIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "delivery":
        return (
          <Package
            size={16}
            color="var(--main-turquoise)"
            aria-label="Delivery"
          />
        );
      case "pickup":
      case "takeaway":
        return (
          <Bike size={16} color="var(--main-turquoise)" aria-label="Takeaway" />
        );
      default:
        return null;
    }
  };

  const statusColors: Record<string, string> = {
    placed: "#FFA462",
    accepted: "#00B0B9",
    prepared: "#00B0B9",
    delivered: "#00B0B9",
    cancelled: "#FA5555",
    rejected: "#FA5555",
    shipping: "#FFA462", // Optional additional status
  };

  // Button renderer based on status
  const renderActionButtons = (order: (typeof orders)[number]) => {
    const baseBtnStyle = { flex: 1, minWidth: 150 };

    switch (order.status) {
      case "placed":
        return (
          <components.Button
            label="Cancel Order"
            style={{
              backgroundColor: "#FA5555",
              borderColor: "#FA5555",
              color: "white",
            }}
            containerStyle={baseBtnStyle}
            onClick={() => {
              // TODO: Add cancel order logic here
              alert(`Cancel order ${order.id} requested`);
            }}
          />
        );

      case "accepted":
      case "prepared":
        return (
          <components.Button
            label="Track Order"
            containerStyle={baseBtnStyle}
            href={Routes.TRACK_YOUR_ORDER}
          />
        );

      case "delivered":
        return (
          <components.Button
            label="Leave Review"
            containerStyle={baseBtnStyle}
            href={Routes.LEAVE_A_REVIEW}
          />
        );

      case "cancelled":
      case "rejected":
        return null;

      default:
        return null;
    }
  };

  const renderHeader = () => (
    <components.Header showGoBack={true} title="Order History" />
  );

  const renderContent = () => {
    if (orders.length === 0) {
      return (
        <main
          className="scrollable container"
          style={{
            paddingBottom: "2.5rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ padding: "1.25rem" }}>No orders found.</div>
        </main>
      );
    }
    if (ordersLoading) return renderLoader();
    if (error)
      return (
        <div style={{ padding: "1.25rem", color: "#FA5555", fontWeight: 500 }}>
          Error: {error}
        </div>
      );

    return (
      <main
        className="scrollable container"
        style={{ paddingBottom: "2.5rem", fontFamily: "system-ui, sans-serif" }}
      >
        {orders.map((order) => {
          const idStr = order.id.toString();
          const isOpen = openAccordions.has(idStr);

          return (
            <div
              key={order.id}
              style={{
                backgroundColor: "var(--white-color)",
                borderRadius: 12,
                padding: "1.25rem 1.5rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                marginBottom: "1rem",
                border: isOpen
                  ? "2px solid var(--main-turquoise)"
                  : "1px solid var(--border-color)",
                transition: "border-color 0.3s ease",
                fontSize: "1rem",
                color: "var(--main-dark)",
              }}
              role="region"
              aria-expanded={isOpen}
            >
              <div
                onClick={() => handleToggle(idStr)}
                style={{ cursor: "pointer", userSelect: "none" }}
                aria-controls={`order-details-${idStr}`}
                aria-expanded={isOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleToggle(idStr);
                }}
              >
                {/* Date and Time, Delivery Method (on next line), and Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    marginBottom: "0.375rem",
                  }}
                >
                  <div>
                    <div
                      className="t14"
                      style={{
                        display: "flex",
                        gap: "0.425rem",

                        color: "var(--main-dark)",

                        marginBottom: "0.25rem",
                      }}
                    >
                      <span>{order.date}</span>
                      <span
                        className="t14"
                        style={{
                          color: "var(--text-muted-color)",
                        }}
                      >
                        at {order.time}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--main-turquoise)",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {deliveryIcon(order.deliveryMethod)}
                      <span className="t14">
                        {order.deliveryMethod === "delivery"
                          ? `Deliver to ${order.deliveryRegion}`
                          : "Takeaway"}
                      </span>
                    </div>
                  </div>
                  <div
                    className="t14"
                    style={{
                      color: "var(--main-dark)",
                      whiteSpace: "nowrap",
                      alignSelf: "center",
                    }}
                  >
                    Rs. {order.total.toFixed(2)}
                  </div>
                </div>

                {/* Status and Order ID */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    className="t12"
                    style={{
                      color: "var(--text-muted-color)",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    }}
                  >
                    Order ID: {order.id}
                  </span>
                  <span
                    className="t10"
                    style={{
                      padding: "6px 12px",
                      borderRadius: 14,
                      backgroundColor: statusColors[order.status] || "#AAA",
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      fontSize: "0.85rem",
                      userSelect: "none",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {isOpen && (
                <>
                  {/* Delivery Note */}
                  {order.deliveryNote && (
                    <div
                      style={{
                        marginTop: "1rem",
                        marginBottom: "1rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: "var(--main-turquoise-light)",
                        borderRadius: 8,
                        color: "var(--main-turquoise)",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                      }}
                    >
                      <strong>Delivery Note:</strong> {order.deliveryNote}
                    </div>
                  )}

                  {/* Products List */}
                  <ul
                    style={{
                      listStyle: "none",
                      paddingLeft: 0,
                      marginBottom: "1rem",
                      maxWidth: 600,
                    }}
                  >
                    {order.products.map((product) => (
                      <li
                        key={product.id}
                        style={{
                          padding: "0.5rem 0",
                          borderBottom: "1px solid var(--border-color)",
                          color: "var(--main-dark)",
                          fontSize: "1rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "nowrap", // keep price on same line with name container
                        }}
                      >
                        <div
                          style={{
                            flexGrow: 1,
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column", // stack children vertically
                            overflow: "hidden",
                          }}
                        >
                          {/* Product name with ellipsis */}
                          <span
                            className="t14"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontWeight: 500,
                              minWidth: 0,
                            }}
                            title={product.name}
                          >
                            {product.name}
                          </span>

                          {/* packageType on the next line, smaller font */}
                          {product.type === "dish" && product.packageType && (
                            <small
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 400,
                                marginTop: 2,
                                color: "var(--main-turquoise)",
                                backgroundColor: "var(--main-turquoise-light)",
                                padding: "2px 8px",
                                borderRadius: 12,
                                textTransform: "capitalize",
                                userSelect: "none",
                                whiteSpace: "nowrap",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                maxWidth: "100%", // allow wrapping if needed shoulder device
                              }}
                            >
                              <Package size={14} strokeWidth={2} />
                              Pack in {product.packageType}
                            </small>
                          )}
                        </div>

                        {/* Price always right-aligned and no wrap */}
                        <span
                          className="t12"
                          style={{
                            whiteSpace: "nowrap",
                            marginLeft: "1rem",
                            flexShrink: 0,
                          }}
                        >
                          {product.quantity} x Rs. {product.price}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Price breakdown */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      maxWidth: 600,
                      fontSize: "1rem",
                      color: "var(--text-muted-color)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 500,
                      }}
                    >
                      <span className="t14">Discount</span>
                      <span className="t12">
                        - Rs. {order.discount.toFixed(2)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 500,
                      }}
                    >
                      <span className="t14">Delivery Charges</span>
                      <span className="t12">
                        Rs. {order.delivery.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="row-center"
                    style={{
                      marginTop: "1.25rem",
                      gap: 16,
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: 600,
                    }}
                  >
                    {renderActionButtons(order)}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
