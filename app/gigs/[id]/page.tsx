"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  MapPin,
  Clock,
  CheckCircle,
  MessageSquare,
  CalendarIcon,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  Send,
  Info,
  Package,
  Heart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function GigDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [gig, setGig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true)
        const data = await apiService.gigs.getById(params.id)
        setGig(data)
        // Set default selected package to the standard (middle) package
        if (data.packages && data.packages.length > 0) {
          const middleIndex = Math.min(1, data.packages.length - 1)
          setSelectedPackage(data.packages[middleIndex])
        }
      } catch (error) {
        console.error("Error fetching gig:", error)
        toast({
          title: "Error",
          description: "Failed to load gig details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchGig()
  }, [params.id, toast])

  const nextImage = () => {
    if (!gig || !gig.images || gig.images.length === 0) return
    setCurrentImageIndex((prev) => (prev + 1) % gig.images.length)
  }

  const prevImage = () => {
    if (!gig || !gig.images || gig.images.length === 0) return
    setCurrentImageIndex((prev) => (prev - 1 + gig.images.length) % gig.images.length)
  }

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book this service.",
        variant: "destructive",
      })
      return
    }

    if (!selectedPackage) {
      toast({
        title: "Package required",
        description: "Please select a package to continue.",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for the service.",
        variant: "destructive",
      })
      return
    }

    try {
      const orderData = {
        gigId: gig.id,
        packageId: selectedPackage.id,
        message: message,
        date: date.toISOString(),
      }

      await apiService.orders.create(orderData)

      toast({
        title: "Booking successful",
        description: "Your order has been placed successfully!",
      })

      // Redirect to orders page
      window.location.href = "/orders"
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    }
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

  if (!gig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Gig not found</h2>
          <p className="mt-2 text-gray-600">The gig you're looking for doesn't exist or has been removed.</p>
          <Link href="/gigs">
            <Button className="mt-4 bg-red-600 hover:bg-red-700">
              <Package className="mr-2 h-4 w-4" />
              Browse Other Gigs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Gig Details */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={gig.seller.avatar || "/placeholder.svg"} alt={gig.seller.name} />
                <AvatarFallback>{gig.seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/seller/${gig.seller.id}`} className="font-medium hover:text-red-600">
                  {gig.seller.name}
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{gig.rating}</span>
              <span className="text-gray-500 ml-1">({gig.reviews})</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span>{gig.location}</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8 relative">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image
                src={gig.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${gig.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {gig.images.map((_: any, index: number) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="description" className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                Packages
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <h2 className="text-xl font-semibold">About This Service</h2>
              <p className="text-gray-700">{gig.description}</p>

              <h3 className="text-lg font-semibold mt-6">About The Seller</h3>
              <div className="flex items-start gap-4 mt-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={gig.seller.avatar || "/placeholder.svg"} alt={gig.seller.name} />
                  <AvatarFallback>{gig.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{gig.seller.name}</h4>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{gig.seller.rating}</span>
                    <span className="text-gray-500 ml-1">({gig.seller.reviews} reviews)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm">Response time: {gig.seller.responseTime}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm">Member since: {gig.seller.memberSince}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">{gig.seller.description}</p>
                  <Button variant="outline" className="mt-3">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Seller
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="packages">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gig.packages.map((pkg: any) => (
                  <Card
                    key={pkg.id}
                    className={`cursor-pointer transition-all ${
                      selectedPackage?.id === pkg.id ? "border-red-500 shadow-md" : ""
                    }`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
                      <p className="text-2xl font-bold mb-2">Rs. {pkg.price.toLocaleString()}</p>
                      <p className="text-gray-700 mb-4">{pkg.description}</p>
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Delivery in {pkg.deliveryTime}</span>
                      </div>
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{pkg.revisions} revisions</span>
                      </div>
                      <h4 className="font-semibold mb-2">What's Included:</h4>
                      <ul className="space-y-2">
                        {pkg.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold">{gig.rating}</span>
                  <span className="text-gray-500">({gig.reviews} reviews)</span>
                </div>

                <div className="space-y-6">
                  {gig.reviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar>
                          <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{review.user.name}</h4>
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-500 text-sm ml-2">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq">
              <div className="space-y-6">
                {gig.faq.map((item: any, index: number) => (
                  <div key={index} className="border-b pb-4">
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Booking */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Book This Service</h3>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Selected Package:</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{selectedPackage?.name}</span>
                    <span className="font-bold">Rs. {selectedPackage?.price.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{selectedPackage?.description}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Delivery in {selectedPackage?.deliveryTime}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Select Date:</h4>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Message to Seller:</h4>
                <Textarea
                  placeholder="Describe your event details, requirements, or ask questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-24"
                />
              </div>

              <div className="space-y-4">
                {user ? (
                  <>
                    <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleBooking}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Continue to Checkout
                    </Button>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Contact Seller
                    </Button>
                    <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                      <Heart className="h-4 w-4" />
                      Save to Favorites
                    </Button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-700">Please sign in to book this service</p>
                    <Link href="/auth/login">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        <Send className="mr-2 h-4 w-4" />
                        Sign In to Continue
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
