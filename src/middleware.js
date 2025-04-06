import { NextResponse } from "next/server"

export async function middleware(request) {
  const sessionToken = request.cookies.get("sessionToken")?.value
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    const response = await fetch(new URL("/api/auth/validate-session", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionToken }),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Invalid or expired session")
    }

    const nextResponse = NextResponse.next()
    nextResponse.headers.set("Cache-Control", "no-store, max-age=0")
    nextResponse.headers.set("X-Content-Type-Options", "nosniff")
    return nextResponse
  } catch (error) {
    console.error("Session validation error:", error.message)

    const redirectResponse = NextResponse.redirect(new URL("/", request.url))
    redirectResponse.cookies.delete("sessionToken")
    return redirectResponse
  }
}