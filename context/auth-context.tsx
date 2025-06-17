"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { apiService } from "@/lib/api"
import toast from "react-hot-toast"

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

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode<User & { exp: number } & any>(token)
        console.log("Token validation - decoded:", decoded)

        // Check if token is expired
        const currentTime = Date.now() / 1000
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("token")
          setUser(null)
        } else {
          setUser({
            id: decoded.id || decoded.user_id || 'unknown',
            name: decoded.name || decoded.username || decoded.full_name || 'User',
            email: decoded.email || 'unknown@email.com',
          })
        }
      } catch (error) {
        console.error("Token validation error:", error)
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

      try {
        const decoded = jwtDecode<User & any>(response.token)
        console.log("Decoded token:", decoded)
        
        setUser({
          id: decoded.id || decoded.user_id || 'unknown',
          name: decoded.name || decoded.username || decoded.full_name || 'User',
          email: decoded.email || email,
        })

        router.push("/")
        const userName = decoded.name || decoded.username || decoded.full_name
        toast.success(`Welcome back${userName ? `, ${userName}` : ''}!`)
      } catch (decodeError) {
        console.error("Token decode error:", decodeError)
        // Still set some basic user info even if token decode fails
        setUser({
          id: 'temp',
          name: 'User',
          email: email,
        })
        router.push("/")
        toast.success("Welcome back!")
      }
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

      try {
        const decoded = jwtDecode<User & any>(response.token)
        console.log("Signup - Decoded token:", decoded)
        
        setUser({
          id: decoded.id || decoded.user_id || 'unknown',
          name: decoded.name || decoded.username || decoded.full_name || name,
          email: decoded.email || email,
        })

        router.push("/")
        const userName = decoded.name || decoded.username || decoded.full_name || name
        toast.success(`Welcome to WedSnap${userName ? `, ${userName}` : ''}!`)
      } catch (decodeError) {
        console.error("Signup token decode error:", decodeError)
        // Still set user info even if token decode fails
        setUser({
          id: 'temp',
          name: name,
          email: email,
        })
        router.push("/")
        toast.success(`Welcome to WedSnap, ${name}!`)
      }
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
    toast.success("You have been successfully logged out.")
  }

  const forgotPassword = async (email: string) => {
    setLoading(true)
    try {
      await apiService.auth.forgotPassword(email)
      toast.success("Password reset email sent")
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
      toast.success("Password reset successful")
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
