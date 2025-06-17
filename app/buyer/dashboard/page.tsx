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
                <Card key={gig.id}>
                  <CardContent className="p-4">
                    <div className="relative h-48 mb-4">
                      <Image
                        src={gig.images?.[0] || "/placeholder.svg"}
                        alt={gig.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold mb-2">{gig.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{gig.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Rs. {gig.packages?.[0]?.price?.toLocaleString()}</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/gigs/${gig.id}`}>View Details</Link>
                      </Button>
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
