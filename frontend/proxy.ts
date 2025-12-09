import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/dashboard", 
    "/dashboard/:path*",
  ],
};

export async function proxy(req: NextRequest) {
  // Cookie holen (vom Backend gesetzter HttpOnly Cookie)
  const session = req.cookies.get("jwt")?.value; 
  console.log("Session Cookie:", session);
  // oder: req.cookies.get("jwt")?.value;

  // Kein Cookie → direkt auf Login redirecten
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optional: Backend check (nur wenn du willst)
  // Wichtig: include sorgt dafür, dass Cookies mitgeschickt werden
  try {
    const res = await fetch(`http://localhost:8080/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `jwt=${session}`
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Wenn alles ok → Seite freigeben
  return NextResponse.next();
}
