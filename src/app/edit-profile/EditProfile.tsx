"use client";

import React, { useState, useEffect } from "react";
import { components } from "../../components";
import { useAuthStore } from "@/stores/useAuthStore";
import getInitials from "@/libs/getInitials";
import toast from "react-hot-toast";

const regions = [
  "Akkaraipattu",
  "Palamunai",
  "Addalaichenai",
  "Sagamam",
  "Kudiyiruppu",
];

export const EditProfile: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET" });
        const data = await res.json();
        if (res.ok && data?.user) {
          updateUser(data.user);
        } else {
          console.warn("Failed to fetch profile:", data?.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.name || "");
      setRegion(user.region || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        body: JSON.stringify({ username, region, password }),
      });
      const data = await res.json();

      if (res.ok) {
        updateUser(data.user);
        toast.success(data.message || "Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <components.Screen>
      <components.Header showGoBack={true} title="Edit profile" />

      <main className="scrollable container">
        <section
          style={{
            backgroundColor: "var(--white-color)",
            padding: 20,
            borderRadius: 10,
            paddingTop: 50,
            paddingBottom: 30,
            marginTop: 10,
            boxSizing: "border-box",
          }}
        >
          {/* Initials Circle */}
          <div
            style={{
              position: "relative",
              maxWidth: 100,
              margin: "0 auto 20px auto",
              display: "block",
            }}
            className="center clickable"
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#ED1A25",
                color: "white",
                fontWeight: "bold",
                fontSize: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              {getInitials(user?.name || "User")}
            </div>
          </div>

          {/* User Stats */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-around", // equal space around both items
              marginBottom: 30,
              fontWeight: 600,
              color: "var(--main-dark)",
            }}
          >
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 24, color: "#f9a826" }}>
                {user?.points || 0}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted-color)" }}>
                Albite Loyalty Points
              </div>
            </div>

            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 24, color: "#f9a826" }}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted-color)" }}>
                Member since
              </div>
            </div>
          </div>

          {/* Username */}
          <components.InputField
            type="text"
            inputType="username"
            placeholder="Enter your username"
            containerStyle={{ marginBottom: 14 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Email (readonly) */}
          <components.InputField
            type="email"
            inputType="email"
            placeholder="Email"
            containerStyle={{ marginBottom: 14 }}
            value={user?.email || ""}
            disabled
          />

          {/* Phone (readonly) */}
          <components.InputField
            type="tel"
            inputType="phone"
            placeholder="Phone number"
            containerStyle={{ marginBottom: 14 }}
            value={user?.mobile || ""}
            disabled
          />

          {/* Region dropdown */}
          <components.InputField
            inputType="location"
            placeholder="Select your region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            options={regions}
            containerStyle={{ marginBottom: 20 }}
          />

          {/* Password */}
          <components.InputField
            type="password"
            inputType="password"
            placeholder="Enter new password (leave blank to keep current)"
            containerStyle={{ marginBottom: 20 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <components.Button
            label="Save changes"
            onClick={handleSave}
            style={{
              backgroundColor: "#ED1A25",
              color: "white",
              borderColor: "#ED1A25",
            }}
            containerStyle={{ marginBottom: 20 }}
          />
        </section>
      </main>
    </components.Screen>
  );
};
