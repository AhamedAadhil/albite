"use client";

import React, { useState } from "react";

import { svg } from "../../svg";
import { components } from "../../components";

const faqs = [
  {
    id: 1,
    question: "How do I place an order?",
    answer:
      "Browse the menu, select your items, add them to the cart, and proceed to checkout. Follow the on-screen steps to complete payment and confirm your order.",
  },
  {
    id: 2,
    question: "Can I modify my order after placing it?",
    answer:
      "Once an order is confirmed, it cannot be modified. You may cancel it within a limited time if the order status allows.",
  },
  {
    id: 3,
    question: "What payment methods are accepted?",
    answer:
      "We currently accept cash on delivery and online payment methods only (we will integrate payment gateways soon).",
  },
  {
    id: 4,
    question: "How can I track my order?",
    answer:
      "After placing an order, you can track its status in real-time under the “My Orders” section of the app.",
  },
  {
    id: 5,
    question: "I forgot my password. How can I reset it?",
    answer:
      "Use the “Forgot Password” link on the login screen. Enter your registered  email to receive an OTP and reset your password.",
  },
  {
    id: 6,
    question: "How do I earn loyalty points?",
    answer:
      "You earn loyalty points automatically when you place an order. Points can be redeemed as per the terms defined in the app.",
  },
  {
    id: 7,
    question: "How can I use my loyalty points?",
    answer:
      "Loyalty points can be applied at checkout to get discounts based on the total order value.",
  },
  {
    id: 8,
    question: "Can I save my favorite items?",
    answer:
      "Yes! You can mark items as favorites and quickly add them to your cart in future orders.",
  },
  {
    id: 9,
    question: "How do I contact customer support?",
    answer:
      "You can reach out through the “Support Center” section in the profile menu of the app, or use the contact number/email provided in the bottom of the app.",
  },
  {
    id: 10,
    question: "Is my personal information safe?",
    answer:
      "Yes. All user data is securely stored and protected in accordance with privacy standards.",
  },
  {
    id: 11,
    question: "Can I order for delivery to multiple addresses?",
    answer:
      "Currently, you can set one delivery address per order. For multiple addresses, place separate orders.",
  },
  {
    id: 12,
    question: "What if my order is late or missing items?",
    answer:
      "Contact our support team immediately via the app, and we will resolve the issue promptly.",
  },
  {
    id: 13,
    question: "Are there any delivery charges?",
    answer:
      "Delivery charges depend on your location and will be displayed during checkout.",
  },
  {
    id: 14,
    question: "Can I cancel my order?",
    answer:
      "Orders can only be canceled if the status is “Pending” or “Confirmed.” Once the restaurant starts preparing it, cancellation may not be possible.",
  },
];

export const FAQ: React.FC = () => {
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(
    null
  );

  const toggleAccordion = (index: number) => {
    if (openAccordionIndex === index) {
      setOpenAccordionIndex(null);
    } else {
      setOpenAccordionIndex(index);
    }
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="FAQ" />;
  };

  const renderContent = () => {
    return (
      <main
        className="scrollable container"
        style={{ paddingTop: "10px", paddingBottom: "20px" }}
      >
        <ul>
          {faqs.map((faq, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <details onToggle={() => toggleAccordion(index)}>
                <summary
                  style={{
                    padding: "14px 20px",
                    borderRadius: "10px",
                    backgroundColor: "#FFF7F2",
                    border:
                      openAccordionIndex === index
                        ? "1px solid #FF8A71"
                        : "1px solid transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  className="clickable"
                >
                  <h5>{faq.question}</h5>
                  {openAccordionIndex === index ? (
                    <svg.IsOpenSvg />
                  ) : (
                    <svg.IsCloseSvg />
                  )}
                </summary>
                <div style={{ padding: "14px 20px" }}>
                  <p className="t16 element">{faq.answer}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
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
