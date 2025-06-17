"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Heart, MessageSquare, Package, Search, ShoppingBag, Star, Eye } from "lucide-react"
import { apiService } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function BuyerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [savedGigs, setSavedGigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Redirect superadmins to admin panel
  useEffect(() => {
    if (user && user.role === 'superadmin') {
      router.push("/super-admin")
    }
  }, [user, router])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Fetch buyer data
        const statsData = await apiService.buyer.getStats()
        setStats(statsData)

        const savedGigsData = await apiService.buyer.getSavedGigs()
        setSavedGigs(savedGigsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-gray-600">Manage your saved services</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-red-600 hover:bg-red-700" asChild>
            <Link href="/gigs">
              <Search className="h-4 w-4 mr-2" />
              Browse Services
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Saved Gigs</p>
                <h3 className="text-2xl font-bold">{savedGigs.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Gigs</CardTitle>
          <CardDescription>Your saved service listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedGigs.length > 0 ? (
              savedGigs.map((gig) => (
                <Card key={gig.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-500 rounded-lg overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-red-500 via-red-600 to-red-700">
                    <Image
                      src={gig.images?.[0] || "/placeholder.svg"}
                      alt={gig.title}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-300"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Price Badge */}
                    {gig.packages?.[0]?.price && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 rounded-md px-3 py-1 text-xs font-semibold shadow-lg">
                          Rs. {gig.packages[0].price}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Saved Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 backdrop-blur-sm text-red-600 border-0 rounded-md px-2 py-1 text-xs font-medium">
                        <Heart className="h-3 w-3 mr-1 fill-red-600" />
                        Saved
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg line-clamp-1 text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                        {gig.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {gig.description}
                      </p>
                      
                      {/* Package Info */}
                      {gig.packages?.[0] && (
                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Featured Package</p>
                          <div className="flex justify-between items-center">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate">{gig.packages[0].name}</p>
                              <p className="text-xs text-gray-500 truncate">{gig.packages[0].description}</p>
                            </div>
                            <div className="text-right ml-2">
                              <p className="text-lg font-bold text-red-600">Rs. {gig.packages[0].price}</p>
                              <p className="text-xs text-gray-500">{gig.packages[0].delivery_days} days</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-2">
                        <Button variant="outline" size="sm" asChild className="border-gray-200 hover:border-red-500 hover:text-red-600 rounded-md">
                          <Link href={`/gigs/${gig.id}`}>View Details</Link>
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                            <Heart className="h-4 w-4 fill-red-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600 mb-4">You haven't saved any gigs yet</p>
                <Button className="bg-red-600 hover:bg-red-700" asChild>
                  <Link href="/gigs">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Services
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
          <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
