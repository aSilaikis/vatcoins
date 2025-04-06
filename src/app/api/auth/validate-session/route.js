import { validateSession } from "@/lib/authService"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { sessionToken } = await req.json()

    if (!sessionToken) {
      return NextResponse.json({ error: "Session token missing" }, { status: 400 })
    }

    const user = await validateSession(sessionToken)

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
        },
      },
    )
  } catch (error) {
    console.error("Session validation error:", error.message)

    const status = error.message.includes("expired") ? 401 : 400

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  }
}