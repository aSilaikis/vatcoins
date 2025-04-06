import { logoutUser } from "@/lib/authService"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const sessionToken = request.cookies.get("sessionToken")?.value

    const response = NextResponse.json({ message: "Logout successful" })

    response.cookies.delete("sessionToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    if (sessionToken) {
      const result = await logoutUser(sessionToken)

      response.headers.set("X-Session-Deleted", result.deletedCount > 0 ? "true" : "false")
    }

    return response
  } catch (error) {
    console.error("Logout error:", error.message)

    const response = NextResponse.json({
      message: "Logout successful",
      warning: "Session cleanup warning: " + error.message,
    })

    response.cookies.delete("sessionToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return response
  }
}