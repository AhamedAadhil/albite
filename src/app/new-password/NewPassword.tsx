"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Routes } from "../../routes";
import { components } from "../../components";
import toast from "react-hot-toast";

export const NewPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("No token found");
      router.push(Routes.FORGOT_PASSWORD);
    }
  }, [searchParams, router]);

  const handleSubmit = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/auth/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        newPassword: password,
      }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      setLoading(false);
      router.push(Routes.PASSWORD_RESET_SUCCESS);
    } else {
      toast.error(data.message);
      setLoading(false);
    }
  };

  return (
    <components.Screen>
      <components.Header title="Reset password" showGoBack={true} />
      <main className="scrollable container" style={{ paddingTop: "10px" }}>
        <section
          style={{
            paddingTop: "30px",
            paddingBottom: "30px",
            backgroundColor: "var(--white-color)",
            borderRadius: "10px",
          }}
          className="container"
        >
          <p className="t16" style={{ marginBottom: "30px" }}>
            Enter new password and confirm.
          </p>
          <components.InputField
            inputType="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            containerStyle={{ marginBottom: "14px" }}
          />
          <components.InputField
            inputType="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            containerStyle={{ marginBottom: "20px" }}
          />
          <components.Button
            label={`${loading ? "Updating..." : "Change Password"}`}
            onClick={handleSubmit}
            disabled={loading || !password || !confirmPassword || !token}
          />
        </section>
      </main>
    </components.Screen>
  );
};
