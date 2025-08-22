import React from "react";
import ReactDOM from "react-dom";

interface PreOrderModalProps {
  show: boolean;
  cancelPreOrder: () => void;
  confirmPreOrder: () => void;
}

const PreOrderModal = ({
  show,
  cancelPreOrder,
  confirmPreOrder,
}: PreOrderModalProps) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.45)",
        padding: "1rem",
        zIndex: 2000,
        overflowY: "auto",
      }}
      onClick={cancelPreOrder}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          maxHeight: "90vh",
          backgroundColor: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <h3>Pre-order for tomorrow</h3>
        <p style={{ color: "#444", marginBottom: 18 }}>
          This dish is not available for immediate preparation. If you proceed,
          your order will be prepared for tomorrow. Do you want to continue?
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={cancelPreOrder}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={confirmPreOrder}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#2c3e50",
              color: "white",
              cursor: "pointer",
            }}
          >
            Confirm Pre-order
          </button>
        </div>
      </div>
    </div>,
    document.body // Render modal directly into body
  );
};

export default PreOrderModal;
