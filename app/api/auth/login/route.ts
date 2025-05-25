import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { apiService } from "@/lib/api"

// Mock user database


export async function POST(request: Request) {
  try {
    console.log("Login request received")
    const { email, password } = await request.json()

    const user = await apiService.auth.login(email, password)

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }
console.log(user)
    const { token, user: userData } = user


    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "your-secret-key", // In a real app, this would be an environment variable
      { expiresIn: "7d" },
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
