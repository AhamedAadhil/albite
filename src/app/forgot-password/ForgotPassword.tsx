"use client";

import React from "react";
import { components } from "../../components";
import toast from "react-hot-toast";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      toast.error("Please enter a valid email");
      return;
    }
    const res = await fetch("/api/auth/requestResetPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setLoading(false);
      toast.success(data.message || "Password reset link sent to your email");
      return;
    } else {
      setLoading(false);
      toast.error(data.message || "Something went wrong");
      return;
    }
  };
  const renderHeader = () => {
    return <components.Header title="Forgot password" showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main className="scrollable container" style={{ paddingTop: "10px" }}>
        <section
          style={{
            paddingTop: "30px",
            paddingBottom: "30px",
            borderRadius: "10px",
            backgroundColor: "var(--white-color)",
          }}
          className="container"
        >
          <p className="t16" style={{ marginBottom: "30px" }}>
            Please enter your email address. You will receive a link to create a
            new password via email.
          </p>
          <components.InputField
            type="email"
            inputType="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            containerStyle={{ marginBottom: "14px" }}
          />
          <components.Button
            label={`${loading ? "Sending..." : "Send reset link"}`}
            // href={Routes.NEW_PASSWORD}
            disabled={!email || loading}
            onClick={handleSubmit}
          />
        </section>
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
