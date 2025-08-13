"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Onboarding } from "./Onboarding";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Start() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (user) {
      router.replace("/tab-navigator");
    }
  }, [user, router]);

  // If user exists, we don't render anything because the redirect will happen
  if (user) {
    return null;
  }
  return <Onboarding />;
}
