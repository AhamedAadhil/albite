"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Routes } from "../../routes";
import { components } from "../../components";

export const ConfirmationCode: React.FC = () => {
  const inputLength = 5;
  const [otp, setOtp] = useState(Array(inputLength).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // ✅ Retrieve userId from localStorage (set during signup)
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("pending_user_id");
    if (storedId) setUserId(storedId);
  }, []);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, inputLength);
    const newOtp = pasteData.split("").slice(0, inputLength);
    setOtp((prev) => {
      const updated = [...prev];
      for (let i = 0; i < newOtp.length; i++) {
        updated[i] = newOtp[i];
        const el = inputRefs.current[i];
        if (el) {
          el.value = newOtp[i];
        }
      }
      inputRefs.current[newOtp.length - 1]?.focus();
      return updated;
    });
    e.preventDefault();
  };

  // Handle verify otp
  const handleSubmit = async () => {
    const fullOtp = otp.join("");
    console.log("Full OTP:", fullOtp);

    if (fullOtp.length !== 5) {
      toast.error("Please enter the full OTP.");
      return;
    }

    if (!userId) {
      toast.error("Invalid user ID. Please try again.");
      return;
    }

    try {
      const res = await fetch("/api/auth/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp: fullOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      toast.success("Account verified successfully!");
      localStorage.removeItem("pending_user_id"); // Clear stored userId
      router.replace(Routes.SIGN_UP_ACCOUNT_CREATED);
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
    }
  };

  const handleResend = async () => {
    if (!userId) {
      toast.error("User not found. Please sign up again.");
      return;
    }

    try {
      const res = await fetch("/api/auth/resendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.waitTimeInSeconds) {
          toast.error(
            data.message ||
              `Please wait ${Math.floor(data.waitTimeInSeconds / 60)}m ${
                data.waitTimeInSeconds % 60
              }s before requesting a new OTP.`
          );
        } else {
          toast.error(data.message || "Could not resend OTP.");
        }
        return;
      }

      toast.success("OTP resent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  const renderHeader = () => (
    <components.Header showGoBack={true} title="Verify your phone number" />
  );

  const renderContent = () => (
    <main
      className="scrollable container"
      style={{ paddingTop: 13, paddingBottom: 20 }}
    >
      <section
        className="container"
        style={{
          paddingTop: 30,
          paddingBottom: 30,
          borderRadius: 10,
          backgroundColor: "var(--white-color)",
        }}
      >
        <span className="t16" style={{ marginBottom: 30, display: "block" }}>
          Enter your OTP code here.
        </span>

        <ul
          style={{
            marginBottom: 30,
            display: "grid",
            gridTemplateColumns: `repeat(${inputLength}, 1fr)`,
            gap: 9,
          }}
        >
          {otp.map((digit, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                width: "100%",
                aspectRatio: "1 / 1",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid var(--main-turquoise)",
              }}
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                defaultValue={digit}
                style={{
                  textAlign: "center",
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                  border: "none",
                  fontSize: 20,
                }}
                onChange={(e) =>
                  handleChange(e.target.value.replace(/\D/, ""), index)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            </li>
          ))}
        </ul>

        <span className="t16">
          Didn’t receive the OTP?{" "}
          <span
            style={{ color: "var(--main-turquoise)" }}
            className="clickable"
            onClick={handleResend}
          >
            Resend.
          </span>
        </span>

        <components.Button
          label="Verify"
          style={{ marginTop: 30 }}
          onClick={handleSubmit}
        />
      </section>
    </main>
  );

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
