import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/new-password",
  "/forgot-password-sent-email",
  "/confirmation-code",
  "/sign-up-account-created",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/api/public",
];

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // ❌ No token — redirect to signin
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/sign-in";
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    // ✅ Role-based access
    if (pathname.startsWith("/admin") && payload.role !== 7) {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/sign-in";
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|manifest.json|logo).*)"],
};
