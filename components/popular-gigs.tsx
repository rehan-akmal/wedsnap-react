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
        <Link href={`/gigs/${gig.id}`} key={gig.id} className="h-full">
          <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-red-500 rounded-none">
            <div className="relative h-48 w-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Image src={gig?.images && gig?.images.length > 0 && getActiveStorageUrl(gig?.images[0]) || "/placeholder.svg"} alt={gig.title} fill className="object-cover opacity-75 rounded-none" />
            </div>
            <CardContent className="p-4 flex flex-col h-[calc(100%-12rem)]">
              <div className="flex flex-col h-full">
                {/* Top Section */}
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center rounded-none">
                      <span className="text-sm font-medium text-white">
                        {gig.user_name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{gig.user_name}</span>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="font-semibold mb-1 line-clamp-1 text-gray-800">{gig.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{gig.description}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 rounded-none">
                      {gig.location}
                    </Badge>
                    {gig.packages && gig.packages.length > 0 && (
                      <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 rounded-none">
                        Starting at ${gig.packages[0].price}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Bottom Section */}
                {gig.packages && gig.packages.length > 0 && (
                  <div className="mt-auto">
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">Available Packages:</p>
                      <div className="space-y-1">
                        {gig.packages.map((pkg: Package) => (
                          <div key={pkg.id} className="flex justify-between items-center text-xs bg-gray-50 p-1.5 rounded-none">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-700">{pkg.name}</span>
                              <span className="text-gray-500 text-[10px] line-clamp-1">{pkg.description}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-blue-600 font-semibold">${pkg.price}</span>
                              <span className="text-[10px] text-gray-500">{pkg.delivery_days} days</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                      <span>Posted on</span>
                      <span>{new Date(gig.created_at).toLocaleDateString()}</span>
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
