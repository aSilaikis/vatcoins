import { loginUser } from "@/lib/authService"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { id, email: userEmail, sessionToken } = await loginUser(email, password)

    const response = NextResponse.json({
      message: "Login successful",
      user: { id, email: userEmail },
    })

    response.cookies.set("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Login error:", error.message)
    const status = error.message.includes("Invalid email or password") ? 401 : 400
    
    return NextResponse.json({ error: error.message }, { status })
  }
}