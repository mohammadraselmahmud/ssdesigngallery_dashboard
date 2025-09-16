import { NextResponse } from "next/server";

export function middleware(req) {
  const { nextUrl } = req;

  // Get the accessToken value
  const isLoggedIn = req.cookies.get("prime-pilates-access-token")?.value;

  const isAuthRoute =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/sign-up";

  const isSellerPathWithObjectId = /^\/seller\/[a-f\d]{24}$/i.test(
    nextUrl.pathname,
  );

  // Allow requests to `/seller/mongodb_objectId`
  if (isSellerPathWithObjectId) {
    return NextResponse.next();
  }

  // If user exists, redirect to `/` from `login`
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user not found, redirect to `/login` from protected routes
  // no redirect happen if already in `/login`
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
