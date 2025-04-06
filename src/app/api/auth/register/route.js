import { registerUser } from "@/lib/authService"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await registerUser(email, password)

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: user.id, email: user.email },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("Registration error:", error.message)
    const status = error.message.includes("already exists") ? 409 : 400

    return NextResponse.json({ error: error.message }, { status })
  }
}