"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Search, Menu, User, MessageSquare, Bell, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-red-600">WedSnap</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/gigs" className="text-gray-700 hover:text-red-600">
              Browse Gigs
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-red-600">
                  Dashboard
                </Link>
                <Link href="/seller/gigs/create" className="text-gray-700 hover:text-red-600">
                  Create Gig
                </Link>
              </>
            )}
            {/* <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search for services..." className="pl-10 pr-4 py-2 w-full" />
            </div> */}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-red-600" />
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/seller/orders">Manage Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-red-600 hover:bg-red-700">Join</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search for services..." className="pl-10 pr-4 py-2 w-full" />
            </div>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/gigs"
                className="text-gray-700 hover:text-red-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Gigs
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-red-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/seller/gigs/create"
                    className="text-gray-700 hover:text-red-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Gig
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <Link
                    href="/messages"
                    className="text-gray-700 hover:text-red-600 py-2 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    Messages
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                      3
                    </span>
                  </Link>
                  <Link
                    href="/notifications"
                    className="text-gray-700 hover:text-red-600 py-2 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bell className="h-5 w-5" />
                    Notifications
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                      5
                    </span>
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-red-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="text-gray-700 hover:text-red-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/seller/orders"
                    className="text-gray-700 hover:text-red-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Manage Orders
                  </Link>
                  <Link
                    href="/settings"
                    className="text-gray-700 hover:text-red-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start px-0 hover:bg-transparent hover:text-red-600"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-red-600 hover:bg-red-700">Join</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
