"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { apiService, getActiveStorageUrl } from "@/lib/api"

interface Package {
  id: number;
  name: string;
  description: string;
  price: string;
  delivery_days: number;
  revisions: number;
  created_at: string;
  updated_at: string;
}

interface Gig {
  id: number;
  title: string;
  description: string;
  location: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  packages: Package[];
  images: string[];
}

export default function PopularGigs() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularGigs = async () => {
      try {
        setLoading(true)
        const response = await apiService.gigs.getAll({
          sort: "rating",
          limit: "4",
          order: "desc",
        })
        console.log("API Response:", response)
        console.log("Gigs data:", response)
        if (response && Array.isArray(response)) {
          setGigs(response)
        } else if (response && response.gigs && Array.isArray(response.gigs)) {
          setGigs(response.gigs)
        } else {
          console.error("Invalid response structure:", response)
          setGigs([])
        }
      } catch (error) {
        console.error("Error fetching popular gigs:", error)
        setGigs([])
      } finally {
        setLoading(false)
      }
    }

    fetchPopularGigs()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="h-full">
            <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
            <CardContent className="p-4">
              <div className="h-4 w-4/5 bg-gray-200 animate-pulse mb-3"></div>
              <div className="h-6 w-full bg-gray-200 animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse mb-3"></div>
              <div className="h-4 w-1/4 bg-gray-200 animate-pulse mb-2"></div>
              <div className="h-4 w-1/3 bg-gray-200 animate-pulse"></div>
            </CardContent>
            <CardFooter className="pt-0 px-4 pb-4 border-t">
              <div className="w-full flex justify-between items-center">
                <div className="h-4 w-1/4 bg-gray-200 animate-pulse"></div>
                <div className="h-6 w-1/4 bg-gray-200 animate-pulse"></div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!gigs || gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No gigs available</h3>
        <p className="text-gray-600">Check back later for new photography services.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
      {gigs.map((gig) => (
        <Link href={`/gigs/${gig.id}`} key={gig.id} className="h-full group">
          <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-500 rounded-lg overflow-hidden group-hover:scale-[1.02]">
            {/* Image Section with Overlay */}
            <div className="relative h-48 w-full bg-gradient-to-br from-red-500 via-red-600 to-red-700">
              <Image src={gig?.images && gig?.images.length > 0 && getActiveStorageUrl(gig?.images[0]) || "/placeholder.svg"} alt={gig.title} fill className="object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-300" />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Price Badge */}
              {gig.packages && gig.packages.length > 0 && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 rounded-md px-3 py-1 text-xs font-semibold shadow-lg">
                    Rs. {gig.packages[0].price}
                  </Badge>
                </div>
              )}
              
              {/* Location Badge */}
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 rounded-md px-2 py-1 text-xs font-medium">
                  {gig.location}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 flex flex-col h-[calc(100%-12rem)]">
              <div className="flex flex-col h-full">
                {/* User Info Section */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-10 h-10 overflow-hidden bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center rounded-lg shadow-md">
                    <span className="text-sm font-bold text-white">
                      {gig.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{gig.user_name}</p>
                    <p className="text-xs text-gray-500">Professional Photographer</p>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                    {gig.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {gig.description}
                  </p>
                </div>

                {/* Bottom Section */}
                {gig.packages && gig.packages.length > 0 && (
                  <div className="mt-auto space-y-3">
                    {/* Package Preview */}
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

                    {/* Additional Info */}
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <span>Posted</span>
                        <span className="font-medium">{new Date(gig.created_at).toLocaleDateString()}</span>
                      </div>
                      {gig.packages.length > 1 && (
                        <Badge variant="outline" className="text-xs border-gray-200 text-gray-600 rounded-md">
                          +{gig.packages.length - 1} more packages
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
