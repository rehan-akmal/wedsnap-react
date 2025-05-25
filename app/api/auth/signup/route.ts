import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"



export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: `${users.length + 1}`,
      name,
      email,
      password, // In a real app, this would be hashed
      role,
    }

    // Add user to database (in a real app)
    users.push(newUser)

    // Create JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      "your-secret-key", // In a real app, this would be an environment variable
      { expiresIn: "7d" },
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
