import { loginUser, registerUser } from "@/lib/authService";
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

    await registerUser(email, password);
    await loginUser(email, password);
    return NextResponse.json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}