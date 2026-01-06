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

  // Eingeloggt + versucht auf Login/Register → Redirect zu Dashboard
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Nicht eingeloggt + versucht auf geschützte Seite → Redirect zu Login
  if (!session && (pathname.startsWith("/dashboard") || pathname.startsWith("/calendar"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Wenn eingeloggt, prüfe ob Session noch valid ist
  if (session) {
    const isValid = await authApi.validateSession(session);
    if (!isValid) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
