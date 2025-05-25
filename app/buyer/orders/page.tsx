"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MessageSquare, Star, Eye } from "lucide-react"
import { apiService } from "@/lib/api"

export default function BuyerOrdersPage() {
  const { user, switchRole } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not a buyer
  useEffect(() => {
    if (user && user.activeRole !== "buyer") {
      switchRole("buyer")
    } else if (!user) {
      router.push("/auth/login")
    }
  }, [user, router, switchRole])

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setLoading(true)
        const data = await apiService.buyer.getOrders()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching buyer orders:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  if (!user) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="h-12 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  const activeOrders = orders.filter((order) => order.status !== "Completed")
  const completedOrders = orders.filter((order) => order.status === "Completed")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <Tabs defaultValue="active" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
        </TabsList>

        {/* Active Orders Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>Track your ongoing orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeOrders.length > 0 ? (
                  activeOrders.map((order) => (
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
                              variant={order.status === "Revision" ? "destructive" : "outline"}
                              className={order.status === "In Progress" ? "bg-blue-600" : ""}
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

                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{order.progress}%</span>
                            </div>
                            <Progress value={order.progress} className="h-2" />
                          </div>

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
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You don't have any active orders</p>
                    <Button className="mt-4 bg-red-600 hover:bg-red-700" asChild>
                      <Link href="/gigs">Browse Services</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Orders Tab */}
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
              <CardDescription>View your order history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {completedOrders.length > 0 ? (
                  completedOrders.map((order) => (
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
                            <Badge variant="default" className="bg-green-600">
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

                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/buyer/orders/${order.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Star className="h-4 w-4 mr-2" />
                              Leave Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You don't have any completed orders yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
