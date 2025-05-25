"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode<User & { exp: number }>(token)

        // Check if token is expired
        const currentTime = Date.now() / 1000
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token")
          setUser(null)
        } else {
          setUser({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
          })
        }
      } catch (error) {
        localStorage.removeItem("token")
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await apiService.auth.login(email, password)
      console.log("Login response:", response)
      localStorage.setItem("token", response.token)

      const decoded = jwtDecode<User>(response.token)
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      })

     // router.push("/")
      toast({
        title: "Login successful",
        description: `Welcome back, ${decoded.name}!`,
      })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await apiService.auth.signup(name, email, password)
      localStorage.setItem("token", response.token)

      const decoded = jwtDecode<User>(response.token)
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      })

      router.push("/")
      toast({
        title: "Signup successful",
        description: `Welcome to WedSnap, ${decoded.name}!`,
      })
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const forgotPassword = async (email: string) => {
    setLoading(true)
    try {
      await apiService.auth.forgotPassword(email)
      toast({
        title: "Password reset email sent",
        description: "If your email is registered, you will receive a password reset link.",
      })
    } catch (error) {
      console.error("Forgot password error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string) => {
    setLoading(true)
    try {
      await apiService.auth.resetPassword(token, password)
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      })
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }
