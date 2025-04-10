import { NextResponse } from "next/server";

export async function middleware(request) {
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/" && sessionToken) {
    try {
      const response = await fetch(new URL("/api/auth/validate-session", request.url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken }),
        cache: "no-store",
      });

      if (response.ok) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        const res = NextResponse.next();
        res.cookies.delete("sessionToken");
        return res;
      }
    } catch (error) {
      console.error("Middleware - Error validating session on /:", error.message);
      const res = NextResponse.next();
      res.cookies.delete("sessionToken");
      return res;
    }
  }

  if (pathname.startsWith("/dashboard") || pathname === "/watchlist") {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const response = await fetch(new URL("/api/auth/validate-session", request.url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken }),
        cache: "no-store",
      });

      if (!response.ok) {
        const redirectResponse = NextResponse.redirect(new URL("/", request.url));
        redirectResponse.cookies.delete("sessionToken");
        return redirectResponse;
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware - Error:", error.message);
      const redirectResponse = NextResponse.redirect(new URL("/", request.url));
      redirectResponse.cookies.delete("sessionToken");
      return redirectResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/watchlist"],
};
