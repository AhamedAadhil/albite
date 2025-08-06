import { User } from "@/stores/useAuthStore";

export async function fetchUserProfile(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include", // important to send cookie
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

    return data.user as User;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}
