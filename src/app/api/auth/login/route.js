import { loginUser } from "@/lib/authService";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await loginUser(email, password);
    
    return NextResponse.json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}