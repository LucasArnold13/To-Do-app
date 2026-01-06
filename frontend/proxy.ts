import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authApi } from "./lib/api/authApi";

export const config = {
  matcher: [
    "/dashboard", 
    "/dashboard/:path*",
    "/calendar",
    "/calendar/:path*",
    "/login",
    "/register",
  ],
};

export async function proxy(req: NextRequest) {
  const session = req.cookies.get("jwt")?.value;
  const { pathname } = req.nextUrl;

  console.log("[Middleware] Path:", pathname);
  console.log("[Middleware] Has JWT cookie:", !!session);

  // Eingeloggt + versucht auf Login/Register → Redirect zu Dashboard
  if (session && (pathname === "/login" || pathname === "/register")) {
    console.log("[Middleware] Logged in user accessing auth page, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Nicht eingeloggt + versucht auf geschützte Seite → Redirect zu Login
  if (!session && (pathname.startsWith("/dashboard") || pathname.startsWith("/calendar"))) {
    console.log("[Middleware] No session, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Wenn eingeloggt, prüfe ob Session noch valid ist
  if (session) {
    console.log("[Middleware] Validating session...");
    const isValid = await authApi.validateSession(session);
    console.log("[Middleware] Session valid:", isValid);
    if (!isValid) {
      console.log("[Middleware] Invalid session, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  console.log("[Middleware] Allowing request");
  return NextResponse.next();
}
