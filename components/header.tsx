"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { 
  Menu, 
  User, 
  MessageSquare, 
  Bell, 
  ChevronDown, 
  UserCircle, 
  Settings, 
  LogOut, 
  Calendar, 
  Home,
  Camera,
  Plus,
  Grid3X3,
  BookOpen,
  Zap
} from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100/50 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              WedSnap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Home</span>
            </Link>
            <Link 
              href="/gigs" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <Grid3X3 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Browse Gigs</span>
            </Link>
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                >
                  <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link 
                  href="/seller/gigs/create" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                >
                  <Plus className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Create Gig</span>
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <Link href="/messages">
                  <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
                    <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link href="/availability">
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
                    <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200 border border-gray-200 hover:border-red-200 hover:shadow-md group"
                    >
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity duration-200"></div>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900">{user?.email || 'user@example.com'}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 border-gray-200 shadow-xl rounded-xl">
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <Settings className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Settings</div>
                          <div className="text-xs text-gray-500">Preferences & security</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => logout()} 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 group text-red-600 focus:text-red-700"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium">Logout</div>
                        <div className="text-xs text-gray-500">Sign out of your account</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="rounded-xl border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                    Join WedSnap
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-100 mt-4 bg-gradient-to-b from-white to-gray-50/50 rounded-xl">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/gigs"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Grid3X3 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Browse Gigs</span>
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    href="/seller/gigs/create"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Create Gig</span>
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link
                    href="/messages"
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Messages</span>
                    </div>
                  </Link>
                  <Link
                    href="/availability"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Availability</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Notifications</span>
                    </div>
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      5
                    </span>
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Settings</span>
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start px-4 py-3 hover:bg-red-50 hover:text-red-600 text-left rounded-lg transition-all duration-200 group"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Logout</span>
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                      Join WedSnap
                    </Button>
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
