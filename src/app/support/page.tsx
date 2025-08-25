"use client";

import React from "react";
import { components } from "../../components";

const CONTACT_INFO = {
  phone: "+94 1234 567890",
  email: "support@albite.lk",
  addressLine1: "123 Albite Street",
  addressLine2: "Colombo 07, Sri Lanka",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63253.3520549492!2d79.83983362405462!3d6.927079670587713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259128ebc0e45%3A0x1ddc91b8c9c06f49!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1692960000000!5m2!1sen!2sus",
};

const Support: React.FC = () => {
  const renderHeader = () => (
    <components.Header showGoBack={true} title="Support" />
  );

  const renderContactDetails = () => (
    <section
      style={{
        backgroundColor: "#FFF7F2",
        borderRadius: 10,
        padding: "15px 20px",
        marginBottom: 30,
        boxShadow: "0 2px 8px rgb(255 138 113 / 0.2)",
      }}
    >
      <h3 style={{ marginBottom: 15, color: "#f9a826" }}>Contact Details</h3>
      <p>
        <strong>Phone: </strong>
        <a href={`tel:${CONTACT_INFO.phone}`} style={{ color: "#f9a826" }}>
          {CONTACT_INFO.phone}
        </a>
      </p>
      <p>
        <strong>Email: </strong>
        <a href={`mailto:${CONTACT_INFO.email}`} style={{ color: "#f9a826" }}>
          {CONTACT_INFO.email}
        </a>
      </p>
      <p>
        <strong>Address: </strong>
        <br />
        {CONTACT_INFO.addressLine1}
        <br />
        {CONTACT_INFO.addressLine2}
      </p>
    </section>
  );

  const renderMap = () => (
    <section
      style={{
        marginBottom: 30,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgb(255 138 113 / 0.2)",
      }}
    >
      <iframe
        src={CONTACT_INFO.mapEmbedUrl}
        width="100%"
        height="250"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Location map"
      />
    </section>
  );

  const WHATSAPP_NUMBER = "941234567890"; // Your WhatsApp number in international format without +
  const WHATSAPP_MESSAGE = encodeURIComponent(
    "Hello! I need support regarding Albite.lk app."
  );

  const renderWhatsAppButton = () => (
    <section
      style={{
        backgroundColor: "#FFF7F2",
        borderRadius: 10,
        padding: "20px",
        marginBottom: 20,
        boxShadow: "0 2px 8px rgb(255 138 113 / 0.2)",
        textAlign: "center",
      }}
    >
      <button
        onClick={() => {
          window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
            "_blank"
          );
        }}
        style={{
          backgroundColor: "#ED1A25",
          color: "white",
          border: "none",
          borderRadius: 10,
          padding: "12px 25px",
          fontSize: 16,
          cursor: "pointer",
          fontWeight: "bold",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        Contact us on WhatsApp
      </button>
    </section>
  );

  return (
    <components.Screen>
      {renderHeader()}
      <main
        className="scrollable container"
        style={{ paddingTop: 10, paddingBottom: 20 }}
      >
        {renderContactDetails()}
        {renderMap()}
        {renderWhatsAppButton()}
      </main>
    </components.Screen>
  );
};

export default Support;
