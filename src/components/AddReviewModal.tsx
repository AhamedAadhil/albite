"use client";
import React, { useState } from "react";

interface Dish {
  id: string;
  name: string;
}

interface Review {
  rating: number;
  review: string;
}

interface AddReviewModalProps {
  isOpen: boolean;
  orderId: string;
  dishes: Dish[];
  onClose: () => void;
  onSubmit: (reviews: Record<string, Review>) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  orderId,
  dishes,
  onClose,
  onSubmit,
}) => {
  const [reviews, setReviews] = useState<Record<string, Review>>({});

  const handleRatingChange = (dishId: string, rating: number) => {
    setReviews((prev) => ({
      ...prev,
      [dishId]: { ...(prev[dishId] || { review: "" }), rating },
    }));
  };

  const handleCommentChange = (dishId: string, review: string) => {
    const words = review.trim().split(/\s+/);
    if (words.length <= 100) {
      setReviews((prev) => ({
        ...prev,
        [dishId]: { ...(prev[dishId] || { rating: 0 }), review },
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 24,
          maxWidth: 640,
          width: "90%",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          maxHeight: "80vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <h2
          id="review-modal-title"
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: 22,
            color: "var(--main-dark)",
          }}
        >
          Leave Review for Order {orderId}
        </h2>

        {dishes.map((dish) => (
          <div
            key={dish.id}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: 16,
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "var(--main-dark)",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {dish.name}
            </h3>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                fontSize: 26,
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  style={{
                    color:
                      (reviews[dish.id]?.rating || 0) >= star
                        ? "#FFC107"
                        : "#ccc",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: 0,
                    lineHeight: 1,
                  }}
                  onClick={() => handleRatingChange(dish.id, star)}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              placeholder="Write your feedback (max 100 words)"
              value={reviews[dish.id]?.review || ""}
              onChange={(e) => handleCommentChange(dish.id, e.target.value)}
              rows={3}
              maxLength={600}
              style={{
                marginTop: 0,
                padding: 8,
                fontFamily: "inherit",
                fontSize: 14,
                borderRadius: 6,
                border: "1.5px solid var(--border-color)",
                resize: "vertical",
                width: "100%",
                color: "var(--main-dark)",
                lineHeight: 1.4,
              }}
            />
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "1.5px solid var(--main-turquoise)",
              borderRadius: 8,
              color: "var(--main-turquoise)",
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reviews)}
            style={{
              backgroundColor: "var(--main-turquoise)",
              border: "none",
              borderRadius: 8,
              color: "white",
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            disabled={Object.keys(reviews).length === 0}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};
