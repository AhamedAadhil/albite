import React from "react";

type InfoPopupProps = {
  message: string;
  onClose: () => void;
};

export default function InfoPopup({ message, onClose }: InfoPopupProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose} // click outside to close
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          maxWidth: 400,
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()} // prevent close on clicking inside box
      >
        <h2 style={{ marginBottom: 10 }}>Info</h2>
        <p>{message}</p>
        <button
          style={{
            marginTop: 20,
            padding: "8px 16px",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
