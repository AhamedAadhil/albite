"use client";

import React from "react";

import { components } from "../../components";

const privacyPolicy = [
  {
    id: 1,
    title: "Terms",
    content:
      "By accessing or using this website/application, you agree to be bound by these Terms and Conditions, applicable laws, and regulations. If you disagree with any part of the Terms, you are prohibited from using this website/application. All content, code, graphics, and materials are protected under copyright and trademark law.",
  },
  {
    id: 2,
    title: "Use Licence",
    content:
      "Permission is granted to temporarily download one copy of the materials (data or programming) for personal, non-commercial use only. This is a license, not a transfer of ownership, and does not permit modification or redistribution of the content.",
  },
  {
    id: 3,
    title: "User Account",
    content:
      "Users may be required to create an account to access certain features. You are responsible for maintaining the confidentiality of your account information, and you agree to accept responsibility for all activities that occur under your account.",
  },
  {
    id: 4,
    title: "Privacy & Personal Information",
    content:
      "We respect your privacy. Any personal information you provide, such as name, email, and phone number, is collected solely for the purpose of providing and improving our services. We do not sell or share your personal information with third parties without consent, except as required by law.",
  },
  {
    id: 5,
    title: "Data Security",
    content:
      "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no system can guarantee absolute security, and you use the service at your own risk.",
  },
  {
    id: 6,
    title: "Cookies",
    content:
      "Our website/app may use cookies and similar tracking technologies to enhance user experience, remember preferences, and gather analytics. You may disable cookies in your browser settings, but some features may not function properly.",
  },
  {
    id: 7,
    title: "Third-Party Services",
    content:
      "We may use third-party services for payments, analytics, or other functionalities. These third-party services have their own privacy policies, and we encourage you to review them before using their services.",
  },
  {
    id: 8,
    title: "Intellectual Property",
    content:
      "All content, software, graphics, and trademarks on this website/application are the property of the Company or its licensors. You may not copy, distribute, or create derivative works without prior written permission.",
  },
  {
    id: 9,
    title: "Prohibited Uses",
    content:
      "You may not use this website/application for any unlawful purposes or to transmit harmful or disruptive content. Activities including hacking, spamming, or transmitting viruses are strictly prohibited.",
  },
  {
    id: 10,
    title: "Changes to Policies",
    content:
      "We reserve the right to update or modify these terms, privacy, or policies at any time without prior notice. Continued use of the service constitutes acceptance of the updated terms.",
  },
  {
    id: 11,
    title: "Limitation of Liability",
    content:
      "The Company is not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the website/application, including loss of data, profits, or business opportunities.",
  },
  {
    id: 12,
    title: "Governing Law",
    content:
      "These terms and policies are governed by the laws of Sri Lanka. Any disputes arising shall be resolved under the jurisdiction of the courts of Sri Lanka.",
  },
];

export const PrivacyPolicy: React.FC = () => {
  const renderHeader = () => {
    return <components.Header showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main className="scrollable container" style={{ paddingTop: 10 }}>
        <h2 style={{ marginBottom: 20 }}>Privacy policy</h2>
        <ul>
          {privacyPolicy.map((item, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <li key={index} style={{ marginBottom: isLast ? 0 : 30 }}>
                <div
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ marginRight: 4 }}>{item.id}.</h4>
                  <h4>{item.title}</h4>
                </div>
                <span className="t16">{item.content}</span>
              </li>
            );
          })}
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
