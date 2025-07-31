// libs/verifyToken.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Types for decoded payload
interface DecodedToken {
  _id: string;
  role: number;
  email?: string;
  mobile?: string;
  name?: string;
  isVerified?: boolean;
  iat?: number;
  exp?: number;
}

export const verifyToken = async (): Promise<DecodedToken | null> => {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      console.warn("No token found in cookies.");
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // Optional: Role-based restriction
    if (decoded.role !== 0) {
      console.warn("Access denied: Not a regular user.");
      return null;
    }

    return decoded;
  } catch (error: any) {
    console.error("Invalid or expired token:", error?.message || error);
    return null;
  }
};
