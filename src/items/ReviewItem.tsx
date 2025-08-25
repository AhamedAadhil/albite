import React from "react";
import { components } from "../components";
import getInitials from "@/libs/getInitials";

export type ReviewType = {
  _id: string;
  review: string;
  rating: number;
  createdAt: string | Date;
  user?: {
    name: string;
    avatar?: string;
  };
};

type Props = {
  review: ReviewType;
  containerStyle?: React.CSSProperties;
};

export const ReviewItem: React.FC<Props> = ({ review, containerStyle }) => {
  return (
    <li
      style={{
        padding: 20,
        borderRadius: 10,
        backgroundColor: "var(--white-color)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        ...containerStyle,
      }}
    >
      <section
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: 12,
          marginBottom: 12,
          borderBottom: "1px solid var(--border-color)",
          gap: 16,
        }}
      >
        <div
          aria-label={`Avatar initials of ${review.user?.name || "User"}`}
          role="img"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "#ED1A25",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "uppercase",
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          {getInitials(review.user?.name || "User")}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ lineHeight: 1.2, margin: 0, fontWeight: 400 }}>
              {review.user?.name || "Unknown"}
            </h5>
            {review.createdAt && (
              <span className="t10" style={{ lineHeight: 1.2, color: "#666" }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <components.Rating rating={review.rating} />
          </div>
        </div>
      </section>
      <section>
        <p className="t14 number-of-lines-2" style={{ margin: 0 }}>
          {review.review}
        </p>
      </section>
    </li>
  );
};
