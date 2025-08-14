import React, { useEffect, useState } from "react";
// import { Package } from "lucide-react";
import { components } from "../components";

type CancelOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  initialReason?: string;
  title?: string;
};

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialReason = "",
  title = "We're sorry to see you cancel",
}) => {
  const [cancelReason, setCancelReason] = useState(initialReason);

  useEffect(() => {
    if (isOpen) {
      setCancelReason(initialReason);
    }
  }, [isOpen, initialReason]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-order-modal-title"
      tabIndex={-1}
      onClick={onClose}
      style={{
        position: "fixed",
        zIndex: 9999,
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--white-color, #fff)",
          borderRadius: 12,
          padding: 24,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          id="cancel-order-modal-title"
          style={{
            margin: 0,
            marginBottom: 16,
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--main-dark)",
          }}
        >
          {title}
        </h2>

        <p style={{ marginBottom: 16 }}>
          We’re very sad that you’re cancelling your order. Please let us know
          the reason (optional):
        </p>

        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Write your cancellation reason here..."
          style={{
            width: "100%",
            minHeight: 80,
            padding: 10,
            borderRadius: 6,
            border: "1px solid var(--border-color)",
            resize: "vertical",
            marginBottom: 16,
            fontSize: "1rem",
            fontFamily: "inherit",
            color: "var(--main-dark)",
          }}
          aria-label="Cancellation reason"
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <components.Button
            label="Close"
            colorScheme="secondary"
            onClick={onClose}
            containerStyle={{ minWidth: 90 }}
          />
          <components.Button
            label="Confirm Cancel"
            style={{
              backgroundColor: "#FA5555",
              borderColor: "#FA5555",
              color: "white",
            }}
            onClick={() => onConfirm(cancelReason)} // Pass cancellation reason string when clicked
            containerStyle={{ minWidth: 130 }}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};
