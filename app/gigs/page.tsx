"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Star, Search, MapPin, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useApp } from "@/context/app-context"
import { apiService, getActiveStorageUrl } from "@/lib/api"

interface Gig {
  id: number
  title: string
  description: string
  location: string
  created_at: string
  updated_at: string
  user_name: string
  packages?: Package[]
  images?: string[]
}

interface Package {
  id: number
  name: string
  description: string
  price: string
  delivery_days: number
  revisions: number
  created_at: string
  updated_at: string
}

interface ApiResponse {
  gigs: Gig[]
  pagination: any
}

export default function GigsPage() {
  const { searchQuery, setSearchQuery, cityFilter, setCityFilter, priceRange, setPriceRange } = useApp()
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange)
  const [loading, setLoading] = useState(true)
  const [cities, setCities] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [allGigs, setAllGigs] = useState<Gig[]>([])

  // Fetch gigs, cities, and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all gigs
        const response = await apiService.gigs.getAll() as ApiResponse
        setAllGigs(response.gigs)
        setFilteredGigs(response.gigs)

        // Extract unique cities from gigs
        const uniqueCities = [...new Set(response.gigs?.map((gig: Gig) => gig?.location))]
        setCities(uniqueCities)

        // Extract unique categories (if needed)
        // const uniqueCategories = [...new Set(gigsData.flatMap(gig => gig.categories || []))]
        // setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters when dependencies change
  useEffect(() => {
    if (allGigs?.length === 0) return

    const filtered = allGigs?.filter((gig) => {
      // Search query filter
      const matchesSearch =
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchQuery.toLowerCase())

      // City filter
      const matchesCity = !cityFilter || gig.location === cityFilter

      // Price range filter
      const matchesPrice = !priceRange || (
        gig.packages && 
        gig.packages.some(pkg => {
          const price = Number(pkg.price)
          return price >= priceRange[0] && price <= priceRange[1]
        })
      )

      return matchesSearch && matchesCity && matchesPrice
    })

    setFilteredGigs(filtered)
  }, [searchQuery, cityFilter, priceRange, allGigs])

  const handleSearch = () => {
    setSearchQuery(localSearchQuery)
  }

  const handlePriceRangeChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]])
  }

  const applyPriceFilter = () => {
    setPriceRange(localPriceRange as [number, number])
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocalSearchQuery("")
    setCityFilter("")
    setPriceRange([0, 100000])
    setLocalPriceRange([0, 100000])
    setSelectedCategories([])
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Photography & Videography Services</h1>
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
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
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Photography & Videography Services</h1>

      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for services..."
              className="pl-10"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            variant="outline"
            className="md:hidden flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${showFilters ? "block" : "hidden md:grid"}`}>
          {/* City Filter */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="flex items-center space-x-2">
                  <Checkbox id="all-cities" checked={!cityFilter} onCheckedChange={() => setCityFilter("")} />
                  <Label htmlFor="all-cities" className="cursor-pointer">
                    All Cities
                  </Label>
                </div>
                {cities.map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={cityFilter === city}
                      onCheckedChange={() => setCityFilter(cityFilter === city ? "" : city)}
                    />
                    <Label htmlFor={`city-${city}`} className="cursor-pointer">
                      {city}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Range Filter */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Price Range (Rs.)</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-price">From</Label>
                    <Input
                      id="min-price"
                      type="number"
                      placeholder="Min"
                      value={localPriceRange[0]}
                      onChange={(e) => setLocalPriceRange([Number(e.target.value), localPriceRange[1]])}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-price">To</Label>
                    <Input
                      id="max-price"
                      type="number"
                      placeholder="Max"
                      value={localPriceRange[1]}
                      onChange={(e) => setLocalPriceRange([localPriceRange[0], Number(e.target.value)])}
                      min={0}
                    />
                  </div>
                </div>
                <Button onClick={applyPriceFilter} className="w-full bg-red-600 hover:bg-red-700">
                  Apply Price Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories Filter */}
          {/* <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* Clear Filters */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Active Filters</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {cityFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {cityFilter}
                  </Badge>
                )}
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <Badge variant="secondary">
                    Rs. {priceRange[0].toLocaleString()} - Rs. {priceRange[1].toLocaleString()}
                  </Badge>
                )}
              </div>
              <Button variant="outline" className="w-full" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">Showing {filteredGigs?.length} results</p>
      </div>

      {/* Gigs Grid */}
      {filteredGigs?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {filteredGigs.map((gig) => (
            <Link href={`/gigs/${gig.id}`} key={gig.id} className="h-full">
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500 rounded-none">
                <div className="relative h-48 w-full bg-gradient-to-r from-blue-500 to-purple-500">
                  <Image
                    src={gig?.images && gig?.images.length > 0 && getActiveStorageUrl(gig?.images[0]) || "/placeholder.svg"}
                    alt={gig.title}
                    fill
                    className="object-cover opacity-75 rounded-none"
                  />
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
                            Starting at Rs. {gig.packages[0].price}
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
                                  <span className="text-blue-600 font-semibold">Rs. {pkg.price}</span>
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
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button onClick={clearFilters} className="bg-red-600 hover:bg-red-700">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
