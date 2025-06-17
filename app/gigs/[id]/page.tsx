"use client"

import { useState, useEffect } from "react"
import React from "react"
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
  Send,
  Info,
  Package,
  Heart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { apiService, getActiveStorageUrl } from "@/lib/api"
import toast from "react-hot-toast"
import { useAuth } from "@/hooks/use-auth"
import { StartConversation } from "@/components/start-conversation"
import SellerAvailabilityCalendar from "@/components/seller-availability-calendar"

export default function GigDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()
  const resolvedParams = React.use(params)
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
        const data = await apiService.gigs.getById(resolvedParams.id)
        setGig(data)
        // Set default selected package to the standard (middle) package
        if (data.packages && data.packages.length > 0) {
          const middleIndex = Math.min(1, data.packages.length - 1)
          setSelectedPackage(data.packages[middleIndex])
        }
      } catch (error) {
        console.error("Error fetching gig:", error)
        toast.error("Failed to load gig details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchGig()
  }, [resolvedParams.id])

  const nextImage = () => {
    if (!gig || !gig.images || gig.images.length === 0) return
    setCurrentImageIndex((prev) => (prev + 1) % gig.images.length)
  }

  const prevImage = () => {
    if (!gig || !gig.images || gig.images.length === 0) return
    setCurrentImageIndex((prev) => (prev - 1 + gig.images.length) % gig.images.length)
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
      <div className="grid grid-cols-1 gap-8">
        {/* Gig Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={gig.seller?.avatar || "/placeholder.svg"} alt={gig.user_name} />
                <AvatarFallback>{gig.user_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/seller/${gig.user_id}`} className="font-medium hover:text-red-600">
                  {gig.user_name}
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{gig.rating}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span>{gig.location}</span>
            </div>
            {user && gig.phone_number && (
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">Phone:</span>
                <span>{gig.phone_number}</span>
              </div>
            )}
          </div>

          {/* Image Gallery */}
          <div className="mb-8 relative">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image
                src={gig?.images && gig?.images.length > 0 && getActiveStorageUrl(gig?.images[currentImageIndex]) || "/placeholder.svg"}
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
                {gig?.images && gig?.images.map((_: any, index: number) => (
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
              <TabsTrigger value="availability" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Availability
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
                  <AvatarImage src={gig?.seller?.avatar || "/placeholder.svg"} alt={gig.user_name} />
                  <AvatarFallback>{gig.user_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{gig.user_name}</h4>
                  <p className="mt-3 text-gray-700">{gig?.seller?.description}</p>
                  <StartConversation
                    recipientId={gig.user_id}
                    recipientName={gig.user_name}
                    recipientAvatar={gig.seller?.avatar}
                    gigTitle={gig.title}
                    variant="outline"
                    className="mt-3"
                  />
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
                        {pkg?.features && pkg?.features.map((feature: string, index: number) => (
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

            <TabsContent value="availability">
              <SellerAvailabilityCalendar 
                sellerId={gig.user_id.toString()} 
                sellerName={gig.user_name} 
              />
            </TabsContent>

            <TabsContent value="faq">
              <div className="space-y-6">
                {gig?.faqs && gig?.faqs.map((item: any, index: number) => (
                  <div key={index} className="border-b pb-4">
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
