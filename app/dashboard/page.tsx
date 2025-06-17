"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Heart,
  MessageSquare,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Store,
  TrendingUp,
  Upload,
  Users,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { apiService, getActiveStorageUrl } from "@/lib/api"
import toast from "react-hot-toast"

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [sellerStats, setSellerStats] = useState<any>(null)
  const [buyerStats, setBuyerStats] = useState<any>(null)
  const [overviewStats, setOverviewStats] = useState<any>(null)
  const [sellerGigs, setSellerGigs] = useState<any[]>([])
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

        // Fetch overview data
        const overviewData = await apiService.dashboard.overview.getStats()
        setOverviewStats(overviewData)

        // Fetch seller data
        // const sellerStatsData = await apiService.dashboard.seller.getStats()
        // setSellerStats(sellerStatsData)

        const sellerGigsData = await apiService.seller.getGigs()
        setSellerGigs(sellerGigsData)

        // Fetch buyer data
        // const buyerStatsData = await apiService.dashboard.buyer.getStats()
        // setBuyerStats(buyerStatsData)

        // const savedGigsData = await apiService.buyer.getSavedGigs()
        // setSavedGigs(savedGigsData)
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

  // Handle gig deletion
  const handleDeleteGig = async (gigId: string) => {
    if (!confirm("Are you sure you want to delete this gig? This action cannot be undone.")) {
      return
    }

    try {
      await apiService.gigs.delete(gigId)
      toast.success("Gig deleted successfully")
      
      // Refresh both the gigs list and overview stats
      const [updatedGigs, updatedOverviewStats] = await Promise.all([
        apiService.seller.getGigs(),
        apiService.dashboard.overview.getStats()
      ])
      
      setSellerGigs(updatedGigs)
      setOverviewStats(updatedOverviewStats)
    } catch (error) {
      console.error("Error deleting gig:", error)
      toast.error("Failed to delete gig. Please try again.")
    }
  }

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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-red-600 hover:bg-red-700" asChild>
            <Link href="/gigs">
              <Search className="h-4 w-4 mr-2" />
              Browse Services
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/seller/gigs/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Gig
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="seller">Seller Dashboard</TabsTrigger>
          <TabsTrigger value="buyer">Buyer Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Gigs</p>
                    <h3 className="text-2xl font-bold">{overviewStats?.total_gigs || 0}</h3>
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
                    <p className="text-sm font-medium text-gray-500">Active Gigs</p>
                    <h3 className="text-2xl font-bold">{overviewStats?.active_gigs || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Store className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Saved Gigs</p>
                    <h3 className="text-2xl font-bold">{overviewStats?.saved_gigs || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gigs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Gigs</CardTitle>
              <CardDescription>Manage your service listings with view and delete actions</CardDescription>
            </CardHeader>
            <CardContent>
              {sellerGigs.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellerGigs.map((gig) => (
                        <TableRow key={gig.id}>
                          <TableCell>
                            <div className="relative h-12 w-12">
                              <Image
                                src={getActiveStorageUrl(gig.images?.[0]) || "/placeholder.svg"}
                                alt={gig.title}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{gig.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-2">{gig.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">{gig.location}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              Rs. {gig.packages?.[0]?.price?.toLocaleString() || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`/gigs/${gig.id}`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Link>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteGig(gig.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <Camera className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No gigs yet</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first service listing</p>
                  <Button asChild>
                    <Link href="/seller/gigs/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Gig
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Gigs</CardTitle>
                <CardDescription>Your saved service listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedGigs.slice(0, 2).map((gig) => (
                    <div key={gig.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={gig.images?.[0] || "/placeholder.svg"}
                          alt={gig.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{gig.title}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{gig.user_name}</span>
                          <span className="mx-1">•</span>
                          <span>Rs. {gig.packages?.[0]?.price?.toLocaleString()}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/gigs/${gig.id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                  {savedGigs.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No saved gigs yet</p>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/buyer/saved">View All Saved</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seller" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                    <h3 className="text-2xl font-bold">Rs. {sellerStats?.earnings?.total?.toLocaleString() || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">This Month</p>
                    <h3 className="text-2xl font-bold">Rs. {sellerStats?.earnings?.this_month?.toLocaleString() || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <h3 className="text-2xl font-bold">{sellerStats?.orders?.total || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Average Rating</p>
                    <h3 className="text-2xl font-bold">{sellerStats?.reviews?.average_rating?.toFixed(1) || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Overview of your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Completed</span>
                    <span className="font-medium">{sellerStats?.orders?.completed || 0}</span>
                  </div>
                  <Progress value={(sellerStats?.orders?.completed / sellerStats?.orders?.total) * 100 || 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">In Progress</span>
                    <span className="font-medium">{sellerStats?.orders?.in_progress || 0}</span>
                  </div>
                  <Progress value={(sellerStats?.orders?.in_progress / sellerStats?.orders?.total) * 100 || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Performance</CardTitle>
                <CardDescription>Your profile statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Views</span>
                    <span className="font-medium">{sellerStats?.views?.total || 0}</span>
                  </div>
                  <Progress value={(sellerStats?.views?.this_month / sellerStats?.views?.total) * 100 || 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">This Month</span>
                    <span className="font-medium">{sellerStats?.views?.this_month || 0}</span>
                  </div>
                  <Progress value={(sellerStats?.views?.this_month / sellerStats?.views?.total) * 100 || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="buyer" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <h3 className="text-2xl font-bold">{buyerStats?.orders?.total || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Saved Gigs</p>
                    <h3 className="text-2xl font-bold">{buyerStats?.saved_gigs || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reviews Given</p>
                    <h3 className="text-2xl font-bold">{buyerStats?.reviews_given || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Overview of your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Completed</span>
                    <span className="font-medium">{buyerStats?.orders?.completed || 0}</span>
                  </div>
                  <Progress value={(buyerStats?.orders?.completed / buyerStats?.orders?.total) * 100 || 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">In Progress</span>
                    <span className="font-medium">{buyerStats?.orders?.in_progress || 0}</span>
                  </div>
                  <Progress value={(buyerStats?.orders?.in_progress / buyerStats?.orders?.total) * 100 || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Orders Placed</p>
                      <p className="text-xs text-gray-500">{buyerStats?.orders?.total || 0} total orders</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Saved Gigs</p>
                      <p className="text-xs text-gray-500">{buyerStats?.saved_gigs || 0} saved services</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reviews Given</p>
                      <p className="text-xs text-gray-500">{buyerStats?.reviews_given || 0} reviews submitted</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
