import { NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "buyer",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "seller",
  },
]

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Check if user exists
    const user = users.find((u) => u.email === email)
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return NextResponse.json({ message: "If your email is registered, you will receive a password reset link." })
    }

    // In a real app, generate a reset token and send an email
    // For this demo, we'll just return a success message

    return NextResponse.json({ message: "If your email is registered, you will receive a password reset link." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
