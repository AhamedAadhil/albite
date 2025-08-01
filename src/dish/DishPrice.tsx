import React from "react";
import { User, UserRound } from "lucide-react"; // Importing Lucide icons

import type { DishType } from "../types";

type Props = { dish: DishType };

export const DishPrice: React.FC<Props> = ({ dish }) => {
  const servings = dish.servings ?? 1;
  const adults = Math.floor(servings);
  const hasChild = servings % 1 !== 0;

  return (
    <div style={{ gap: 7, display: "flex", alignItems: "center" }}>
      {/* Price */}
      <span
        className="t14"
        style={{ fontWeight: 500, color: "var(--main-dark)" }}
      >
        Rs.{dish.price}
      </span>

      {/* Separator */}
      <div style={{ width: 1, height: 10, backgroundColor: "#D5DCE3" }} />

      {/* Serving Icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <span>Serves :</span>
        {[...Array(adults)].map((_, i) => (
          <User key={`adult-${i}`} size={16} strokeWidth={2} />
        ))}
        {hasChild && <UserRound size={14} strokeWidth={1.5} />}
      </div>
    </div>
  );
};
