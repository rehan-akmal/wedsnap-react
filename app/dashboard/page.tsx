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
} from "lucide-react"
import { apiService } from "@/lib/api"

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [sellerStats, setSellerStats] = useState<any>(null)
  const [buyerStats, setBuyerStats] = useState<any>(null)
  const [sellerGigs, setSellerGigs] = useState<any[]>([])
  const [sellerOrders, setSellerOrders] = useState<any[]>([])
  const [buyerOrders, setBuyerOrders] = useState<any[]>([])
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

        // Fetch seller data
        const sellerStatsData = await apiService.seller.getStats()
        setSellerStats(sellerStatsData)

        const sellerGigsData = await apiService.seller.getGigs()
        setSellerGigs(sellerGigsData)

        const sellerOrdersData = await apiService.seller.getActiveOrders()
        setSellerOrders(sellerOrdersData)

        // Fetch buyer data
        const buyerStatsData = await apiService.buyer.getStats()
        setBuyerStats(buyerStatsData)

        const buyerOrdersData = await apiService.buyer.getOrders()
        setBuyerOrders(buyerOrdersData)

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

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        <div className="h-12 w-full bg-gray-200 animate-pulse rounded-lg mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, index) => (
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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Manage your gigs, orders, and activity</p>
        </div>
        <div className="flex gap-3">
          <Link href="/seller/gigs/create">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Gig
            </Button>
          </Link>
          <Link href="/gigs">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Browse Services
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="selling" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Selling
          </TabsTrigger>
          <TabsTrigger value="buying" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Buying
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {sellerStats && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                      <h3 className="text-2xl font-bold">Rs. {sellerStats.earnings.total.toLocaleString()}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Gigs</p>
                    <h3 className="text-2xl font-bold">{sellerGigs.filter((gig) => gig.isActive).length}</h3>
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
                    <p className="text-sm font-medium text-gray-500">Selling Orders</p>
                    <h3 className="text-2xl font-bold">{sellerOrders.length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Buying Orders</p>
                    <h3 className="text-2xl font-bold">{buyerOrders.length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Selling Orders</CardTitle>
                <CardDescription>Your latest orders as a seller</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sellerOrders.slice(0, 2).map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={order.buyer.avatar || "/placeholder.svg"} alt={order.buyer.name} />
                        <AvatarFallback>{order.buyer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{order.gig.title}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{order.buyer.name}</span>
                          <span className="mx-1">•</span>
                          <span>Rs. {order.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <Badge
                        variant={order.status === "Revision Requested" ? "destructive" : "outline"}
                        className={order.status === "In Progress" ? "bg-blue-600" : ""}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                  {sellerOrders.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No selling orders yet</p>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/seller/orders">View All Selling Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Buying Orders</CardTitle>
                <CardDescription>Your latest orders as a buyer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buyerOrders.slice(0, 2).map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={order.seller.avatar || "/placeholder.svg"} alt={order.seller.name} />
                        <AvatarFallback>{order.seller.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{order.gig.title}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{order.seller.name}</span>
                          <span className="mx-1">•</span>
                          <span>Rs. {order.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <Badge
                        variant={order.status === "Completed" ? "default" : "outline"}
                        className={
                          order.status === "Completed"
                            ? "bg-green-600"
                            : order.status === "In Progress"
                              ? "bg-blue-600"
                              : ""
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                  {buyerOrders.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No buying orders yet</p>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/orders">View All Buying Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Selling Tab */}
        <TabsContent value="selling">
          {sellerStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                      <h3 className="text-2xl font-bold">Rs. {sellerStats.earnings.total.toLocaleString()}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">{sellerStats.earnings.growth}</span>
                    <span className="text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Orders</p>
                      <h3 className="text-2xl font-bold">{sellerStats.orders.active}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">
                      {sellerStats.orders.completed} completed, {sellerStats.orders.cancelled} cancelled
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Profile Views</p>
                      <h3 className="text-2xl font-bold">{sellerStats.views.total}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">{sellerStats.views.growth}</span>
                    <span className="text-gray-500 ml-2">this week ({sellerStats.views.thisWeek})</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="my-gigs" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="my-gigs">My Gigs</TabsTrigger>
              <TabsTrigger value="active-orders">Active Orders</TabsTrigger>
            </TabsList>

            {/* My Gigs Tab */}
            <TabsContent value="my-gigs">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellerGigs.length > 0 ? (
                  sellerGigs.map((gig) => (
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
                                setSellerGigs(updatedGigs)
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
                  <Card className="col-span-3 flex flex-col items-center justify-center h-full border-dashed">
                    <CardContent className="p-6 text-center">
                      <div className="rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Plus className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="font-medium mb-2">Create a New Gig</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Start selling your photography or videography services
                      </p>
                      <Button className="bg-red-600 hover:bg-red-700" asChild>
                        <Link href="/seller/gigs/create">Create Gig</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Active Orders Tab */}
            <TabsContent value="active-orders">
              <Card>
                <CardHeader>
                  <CardTitle>Active Orders</CardTitle>
                  <CardDescription>Manage your ongoing orders and their progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {sellerOrders.length > 0 ? (
                      sellerOrders.map((order) => (
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
                              <p className="text-sm text-gray-500 mt-1">Due: {order.deliveryDate}</p>
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
                              <Link href={`/seller/orders/${order.id}`}>View Details</Link>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message Buyer
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Upload className="h-4 w-4 mr-2" />
                              Deliver Work
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">You don't have any active orders</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Buying Tab */}
        <TabsContent value="buying">
          {buyerStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Orders</p>
                      <h3 className="text-2xl font-bold">{buyerStats.activeOrders}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                      <h3 className="text-2xl font-bold">{buyerStats.completedOrders}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Saved Gigs</p>
                      <h3 className="text-2xl font-bold">{savedGigs.length}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="my-orders" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="my-orders">My Orders</TabsTrigger>
              <TabsTrigger value="saved-gigs">Saved Gigs</TabsTrigger>
            </TabsList>

            {/* My Orders Tab */}
            <TabsContent value="my-orders">
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>Track and manage your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {buyerOrders.length > 0 ? (
                      buyerOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0">
                              <Image
                                src={order.gig.image || "/placeholder.svg"}
                                alt={order.gig.title}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row justify-between mb-2">
                                <h4 className="font-medium">{order.gig.title}</h4>
                                <Badge
                                  variant={
                                    order.status === "Completed"
                                      ? "default"
                                      : order.status === "Revision"
                                        ? "destructive"
                                        : "outline"
                                  }
                                  className={
                                    order.status === "Completed"
                                      ? "bg-green-600"
                                      : order.status === "In Progress"
                                        ? "bg-blue-600"
                                        : ""
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={order.seller.avatar || "/placeholder.svg"}
                                    alt={order.seller.name}
                                  />
                                  <AvatarFallback>{order.seller.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{order.seller.name}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div>
                                  <span className="text-gray-500">Order ID:</span> {order.id}
                                </div>
                                <div>
                                  <span className="text-gray-500">Price:</span> Rs. {order.price.toLocaleString()}
                                </div>
                                <div>
                                  <span className="text-gray-500">Order Date:</span> {order.orderDate}
                                </div>
                                <div>
                                  <span className="text-gray-500">Delivery Date:</span> {order.deliveryDate}
                                </div>
                              </div>

                              {order.status !== "Completed" && (
                                <div className="space-y-2 mb-3">
                                  <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span>{order.progress}%</span>
                                  </div>
                                  <Progress value={order.progress} className="h-2" />
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2 mt-3">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/orders/${order.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Contact Seller
                                </Button>
                                {order.status === "Completed" && (
                                  <Button variant="outline" size="sm" className="flex items-center">
                                    <Star className="h-4 w-4 mr-2" />
                                    Leave Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
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
            </TabsContent>

            {/* Saved Gigs Tab */}
            <TabsContent value="saved-gigs">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedGigs.length > 0 ? (
                  savedGigs.map((gig) => (
                    <Card key={gig.id}>
                      <div className="relative h-48 w-full">
                        <Image
                          src={gig.image || "/placeholder.svg"}
                          alt={gig.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                          onClick={async () => {
                            try {
                              await apiService.buyer.toggleSavedGig(gig.id)
                              // Refresh saved gigs after toggling
                              const updatedSavedGigs = await apiService.buyer.getSavedGigs()
                              setSavedGigs(updatedSavedGigs)
                            } catch (error) {
                              console.error("Error toggling saved gig:", error)
                            }
                          }}
                        >
                          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={gig.seller.avatar || "/placeholder.svg"}
                              alt={gig.seller.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium">{gig.seller.name}</span>
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-2">{gig.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{gig.description}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{gig.rating}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <Badge variant="outline" className="text-xs">
                            {gig.location}
                          </Badge>
                          <span className="font-bold">Rs. {gig.price.toLocaleString()}</span>
                        </div>
                        <Button className="w-full mt-4 bg-red-600 hover:bg-red-700" asChild>
                          <Link href={`/gigs/${gig.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Gig
                          </Link>
                        </Button>
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
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
