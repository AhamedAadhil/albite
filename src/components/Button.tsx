"use client";

import React from "react";
import Link from "next/link";
import { UrlObject } from "url";

type Props = {
  href?: string | UrlObject;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  colorScheme?: "primary" | "secondary";
  containerStyle?: React.CSSProperties;
};

export const Button: React.FC<Props> = ({
  label,
  style,
  onClick,
  href = "#",
  containerStyle,
  disabled = false, // default to false
  colorScheme = "primary",
}) => {
  // If it's just a navigation link
  if (href && !onClick) {
    return (
      <div style={{ ...containerStyle }}>
        <Link
          href={href ?? "#"}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 10,
            color:
              colorScheme === "primary"
                ? "var(--white-color)"
                : "var(--main-turquoise)",
            textTransform: "capitalize",
            fontWeight: "var(--fw-bold)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 14,
            border: "1px solid var(--main-turquoise)",
            background:
              colorScheme === "primary"
                ? "var(--main-turquoise)"
                : "transparent",
            ...style,
          }}
        >
          {label}
        </Link>
      </div>
    );
  }

  // If it's a button (submit / form)
  return (
    <div style={{ ...containerStyle }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: "100%",
          height: 50,
          borderRadius: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color:
            colorScheme === "primary"
              ? "var(--white-color)"
              : "var(--main-turquoise)",
          textTransform: "capitalize",
          fontWeight: "var(--fw-semibold)",
          border: "1px solid var(--main-turquoise)",
          background:
            colorScheme === "primary" ? "var(--main-turquoise)" : "transparent",
          opacity: disabled ? 0.5 : 1, // ✅ Disabled style
          cursor: disabled ? "not-allowed" : "pointer", // ✅ Cursor style
          ...style,
        }}
        className="flex-center t16"
      >
        {label}
      </button>
    </div>
  );
};
