"use client"

import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { user } = useAuth()

  // Hide header and footer for super admins
  if (user?.role === 'superadmin') {
    return <main className="flex-1">{children}</main>
  }

  // Show header and footer for all other users
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
} 