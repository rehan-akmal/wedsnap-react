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
  const { user, switchRole } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [savedGigs, setSavedGigs] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Redirect if not a buyer
  useEffect(() => {
    if (user && user.activeRole !== "buyer") {
      switchRole("buyer")
    } else if (!user) {
      router.push("/auth/login")
    }
  }, [user, router, switchRole])

  // Fetch buyer data
  useEffect(() => {
    const fetchBuyerData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Fetch buyer stats
        const statsData = await apiService.buyer.getStats()
        setStats(statsData)

        // Fetch buyer orders
        const ordersData = await apiService.buyer.getOrders()
        setOrders(ordersData)

        // Fetch saved gigs
        const savedGigsData = await apiService.buyer.getSavedGigs()
        setSavedGigs(savedGigsData)
      } catch (error) {
        console.error("Error fetching buyer data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBuyerData()
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>

        <div className="h-12 w-full bg-gray-200 animate-pulse rounded-lg mb-6"></div>

        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-gray-600">Manage your orders and saved gigs</p>
        </div>
        <Link href="/gigs">
          <Button className="bg-red-600 hover:bg-red-700">
            <Search className="h-4 w-4 mr-2" />
            Browse Services
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Orders</p>
                  <h3 className="text-2xl font-bold">{stats.activeOrders}</h3>
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
                  <h3 className="text-2xl font-bold">{stats.completedOrders}</h3>
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

      <Tabs defaultValue="orders" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            My Orders
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Saved Gigs
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        {/* My Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orders.length > 0 ? (
                  orders.map((order) => (
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
                              <AvatarImage src={order.seller.avatar || "/placeholder.svg"} alt={order.seller.name} />
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
                              <Link href={`/buyer/orders/${order.id}`}>
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
                    <p className="text-gray-600 mb-4">You don't have any orders yet</p>
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
        <TabsContent value="saved">
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

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>Manage your schedule and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-lg">
                <p className="text-gray-500">Calendar view will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
