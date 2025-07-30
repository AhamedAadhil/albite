"use client";

import { stores } from "@/stores";

export const handleSignOut = async (router: any) => {
  try {
    const res = await fetch("/api/auth/signout", {
      method: "GET",
    });

    const data = await res.json();

    if (data.success) {
      // Clear Zustand auth store
      stores.useAuthStore.getState().logout();

      // Redirect to sign-in
      router.push("/sign-in");
    } else {
      console.error("Failed to sign out:", data.message);
    }
  } catch (err) {
    console.error("Signout error:", err);
  }
};
