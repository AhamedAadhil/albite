"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Bike } from "lucide-react";

import { hooks } from "../../hooks";
import { Routes } from "../../routes";
import { components } from "../../components";
import { renderLoader } from "@/components/Loader";
import toast from "react-hot-toast";
import { CancelOrderModal } from "@/components/CancelOrderModal";
import { formatDateTime } from "@/libs/formatDateTime";
import { AddReviewModal } from "@/components/AddReviewModal";
import { OrderHistoryEmpty } from "../order-history-empty/OrderHistoryEmpty";

interface Review {
  rating: number;
  review: string;
}

export const OrderHistory: React.FC = () => {
  const router = useRouter();
  const { orders, ordersLoading, error, refetch } = hooks.useGetOrders();
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  // Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null | number>(
    null
  );

  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<any>(null);

  const openReviewModal = (order: any) => {
    const unreviewedDishes = order.products.filter(
      (item: any) => item.type === "dish" && !item.isReviewed
    );
    setReviewOrder({ ...order, dishes: unreviewedDishes });
    setShowAddReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowAddReviewModal(false);
    setReviewOrder(null);
  };

  const submitReviews = async (
    reviews: Record<string, Review>,
    orderId: string
  ) => {
    const reviewArray = Object.entries(reviews).map(
      ([dish, { rating, review }]) => ({
        dish,
        rating,
        review,
      })
    );

    try {
      console.log(orderId, "order", reviewArray, "reviews");
      const response = await fetch("/api/user/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, data: reviewArray }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
      }

      toast.success("Review(s) submitted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "An error occurred submitting reviews");
    }
  };

  const openCancelModal = (orderId: string | number) => {
    setCancelOrderId(orderId);
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setCancelOrderId(null);
  };

  // Accept reason only, use cancelOrderId from state
  const handleCancelOrder = async (cancelReason: string) => {
    if (!cancelOrderId) return; // Ensure orderId is set

    try {
      const response = await fetch("/api/user/order", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          orderId: cancelOrderId,
          cancelReason,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        refetch();
        closeCancelModal();
        return;
      } else {
        closeCancelModal();
        return toast.error(data.message);
      }
    } catch (error: any) {
      closeCancelModal();
      return toast.error(error.message);
    }
  };

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
    placed: "#FFA500", // Orange - Order placed, awaiting next steps
    accepted: "#007BFF", // Blue - Order accepted, processing started
    prepared: "#17A2B8", // Teal - Order prepared, ready for delivery
    shipping: "#6F42C1", // Purple - Order en route (shipping)
    delivered: "#28A745", // Green - Successfully delivered/completed
    cancelled: "#DC3545", // Red - Order cancelled by user
    rejected: "#C82333", // Dark Red - Order rejected by system/vendor
  };

  // Button renderer based on status
  const renderActionButtons = (order: (typeof orders)[number]) => {
    const baseBtnStyle = { flex: 1, minWidth: 150 };

    // Determine if there are unreviewed dishes
    const hasUnreviewedDishes = order.products.some(
      (item: any) => item.type === "dish" && !item.isReviewed
    );

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
            onClick={() => openCancelModal(order._id)}
          />
        );

      case "accepted":
      case "prepared":
        return (
          <components.Button
            label="Track Order"
            containerStyle={baseBtnStyle}
            // href={Routes.TRACK_YOUR_ORDER}
            onClick={() => {
              localStorage.setItem("orderToTrack", String(order.id));
              router.push(Routes.TRACK_YOUR_ORDER);
            }}
          />
        );

      case "delivered":
        return (
          <>
            <components.Button
              label="Track Order"
              containerStyle={baseBtnStyle}
              href={Routes.TRACK_YOUR_ORDER}
            />
            {hasUnreviewedDishes && (
              <components.Button
                label="Leave Review"
                containerStyle={baseBtnStyle}
                style={{
                  backgroundColor: "transparent",
                  border: "1.5px solid var(--main-turquoise)",
                  borderRadius: 8,
                  color: "var(--main-turquoise)",
                  padding: "10px 20px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => openReviewModal(order)}
              />
            )}

            {reviewOrder && (
              <AddReviewModal
                isOpen={showAddReviewModal}
                orderId={reviewOrder.id}
                dishes={reviewOrder.dishes ?? []}
                onClose={closeReviewModal}
                onSubmit={(reviews: Record<string, Review>) => {
                  submitReviews(reviews, reviewOrder.id);
                  closeReviewModal();
                  refetch(); // optionally refresh orders to update UI after review
                }}
              />
            )}
          </>
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
      return <OrderHistoryEmpty />;
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

                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      fontSize: "0.65rem",
                      userSelect: "none",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {isOpen && (
                <>
                  {/* Cancellation info if cancelled */}
                  {order.status === "cancelled" && (
                    <div
                      className="t14"
                      style={{
                        marginTop: "1rem",
                        marginBottom: "1rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: "#FA5555",
                        borderRadius: 8,
                        color: "white",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <strong>Cancelled At:</strong>{" "}
                      {formatDateTime(order.cancelledTime) || "N/A"}
                      <br />
                      <strong>Reason:</strong>{" "}
                      {order.cancellationReason || "No reason provided"}
                    </div>
                  )}

                  {/* Delivery Note in separate section */}
                  {order.deliveryNote && (
                    <div
                      className="t14"
                      style={{
                        marginTop: "1.5rem",
                        marginBottom: "1rem",
                        padding: "1rem 1.25rem",
                        backgroundColor: "var(--main-turquoise-light)", // soft turquoise background
                        border: "1.5px solid var(--main-turquoise)", // border matching main turquoise color
                        borderRadius: 12,
                        color: "var(--main-turquoise)",

                        lineHeight: 1.4,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: 8 }}>
                        Delivery Note:
                      </strong>
                      <span>{order.deliveryNote}</span>
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
    <>
      <components.Screen>
        {renderHeader()}
        {renderContent()}
      </components.Screen>
      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleCancelOrder}
      />
    </>
  );
};
