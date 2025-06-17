"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Camera,
  Clock,
  DollarSign,
  Edit,
  Eye,
  MessageSquare,
  Plus,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import { apiService } from "@/lib/api"

export default function SellerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [gigs, setGigs] = useState<any[]>([])
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

        // Fetch seller data
        const statsData = await apiService.seller.getStats()
        setStats(statsData)

        const gigsData = await apiService.seller.getGigs()
        setGigs(gigsData)
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
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your services</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-red-600 hover:bg-red-700" asChild>
            <Link href="/seller/gigs/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Gig
            </Link>
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <h3 className="text-2xl font-bold">Rs. {stats.earnings.total.toLocaleString()}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">{stats.earnings.growth}</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Gigs</p>
                  <h3 className="text-2xl font-bold">{gigs.filter((gig) => gig.isActive).length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Profile Views</p>
                  <h3 className="text-2xl font-bold">{stats.views.total}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">{stats.views.growth}</span>
                <span className="text-gray-500 ml-2">this week ({stats.views.thisWeek})</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Gigs</CardTitle>
          <CardDescription>Manage your service listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.length > 0 ? (
              gigs.map((gig) => (
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
                        <Link href={`/seller/gigs/${gig.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600 mb-4">You haven't created any gigs yet</p>
                <Button className="bg-red-600 hover:bg-red-700" asChild>
                  <Link href="/seller/gigs/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Gig
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
