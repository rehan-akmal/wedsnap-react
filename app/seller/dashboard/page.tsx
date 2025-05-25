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
  const { user, switchRole } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [gigs, setGigs] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not a seller
  useEffect(() => {
    if (user && user.activeRole !== "seller") {
      switchRole("seller")
    } else if (!user) {
      router.push("/auth/login")
    }
  }, [user, router, switchRole])

  // Fetch seller data
  useEffect(() => {
    const fetchSellerData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Fetch seller stats
        const statsData = await apiService.seller.getStats()
        setStats(statsData)

        // Fetch seller gigs
        const gigsData = await apiService.seller.getGigs()
        setGigs(gigsData)

        // Fetch active orders
        const ordersData = await apiService.seller.getActiveOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error("Error fetching seller data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchSellerData()
    }
  }, [user])

  if (!user) {
    return null
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>

        <div className="h-12 w-full bg-gray-200 animate-pulse rounded-lg mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your gigs, orders, and seller performance</p>
        </div>
        <Link href="/seller/gigs/create">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New Gig
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-sm font-medium text-gray-500">Active Orders</p>
                  <h3 className="text-2xl font-bold">{stats.orders.active}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  {stats.orders.completed} completed, {stats.orders.cancelled} cancelled
                </span>
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
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">{stats.views.growth}</span>
                <span className="text-gray-500 ml-2">this week ({stats.views.thisWeek})</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rating</p>
                  <h3 className="text-2xl font-bold">{stats.rating}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(stats.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 ml-2">from {stats.reviewCount} reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="gigs" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="gigs" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            My Gigs
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Active Orders
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* My Gigs Tab */}
        <TabsContent value="gigs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.length > 0 ? (
              gigs.map((gig) => (
                <Card key={gig.id} className={gig.isActive ? "" : "opacity-70"}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={gig.image || "/placeholder.svg"}
                      alt={gig.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    {!gig.isActive && (
                      <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-sm">
                          Paused
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold line-clamp-1">{gig.title}</h3>
                      <Badge variant={gig.isActive ? "default" : "outline"} className="bg-red-600">
                        Rs. {gig.price.toLocaleString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{gig.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm">{gig.orders} orders</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm">{gig.views} views</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/gigs/${gig.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/seller/gigs/edit/${gig.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant={gig.isActive ? "destructive" : "default"}
                        size="sm"
                        className={gig.isActive ? "" : "bg-red-600 hover:bg-red-700"}
                        onClick={async () => {
                          try {
                            await apiService.seller.toggleGigStatus(gig.id)
                            // Refresh gigs after toggling status
                            const updatedGigs = await apiService.seller.getGigs()
                            setGigs(updatedGigs)
                          } catch (error) {
                            console.error("Error toggling gig status:", error)
                          }
                        }}
                      >
                        {gig.isActive ? "Pause" : "Activate"}
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
        </TabsContent>

        {/* Active Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>Manage your ongoing orders and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={order.buyer.avatar || "/placeholder.svg"} alt={order.buyer.name} />
                            <AvatarFallback>{order.buyer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{order.buyer.name}</h4>
                            <p className="text-sm text-gray-500">{order.id}</p>
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end">
                          <Badge
                            variant={
                              order.status === "In Progress"
                                ? "default"
                                : order.status === "Revision Requested"
                                  ? "destructive"
                                  : "outline"
                            }
                            className={order.status === "In Progress" ? "bg-blue-600" : ""}
                          >
                            {order.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">Due: {order.dueDate}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-1">{order.gig.title}</h4>
                        <p className="text-sm text-gray-500">Order Value: Rs. {order.price.toLocaleString()}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} className="h-2" />
                      </div>

                      <div className="flex justify-between mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/seller/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Buyer
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">You don't have any active orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>View your performance metrics and growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-lg">
                <p className="text-gray-500">Analytics charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
