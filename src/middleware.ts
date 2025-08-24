import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Define your protected routes explicitly
const PROTECTED_ROUTES = [
  "/edit-profile",
  "/tab-navigator",
  "/order-history",
  "/order-history-empty",
  "/api/auth/me",
  "/checkout",
  "/menu-list/:category",
  "/menu-item/:id",
  "/order-successful",
  "/special-orders",
  "/track-your-order",
  "/order-successful",
  "/order-failed",
  "/reviews",
  "/privacy-policy",
];

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If route is not protected, allow it
  if (!PROTECTED_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // Redirect to login if token not found
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/sign-in";
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    // Optional: Role-based logic if needed later
    if (pathname.startsWith("/admin") && payload.role !== 7) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/sign-in";
    return NextResponse.redirect(loginUrl);
  }
}

// Only run middleware on /edit-profile and /tab-navigator
export const config = {
  matcher: [
    "/edit-profile",
    "/tab-navigator",
    "/order-history",
    "/order-history-empty",
    "/api/auth/me",
    "/checkout",
    "/menu-list/:category",
    "/menu-item/:id",
    "/order-successful",
    "/special-orders",
    "/track-your-order",
    "/order-successful",
    "/order-failed",
    "/reviews",
    "/privacy-policy",
  ],
};
