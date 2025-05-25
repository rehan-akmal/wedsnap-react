"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Calculator, Camera, Clock, Users } from "lucide-react"

interface Feature {
  id: string
  name: string
  description: string
  price: number
}

interface Package {
  id: string
  name: string
  description: string
  basePrice: number
}

// Photography packages
const photographyPackages: Package[] = [
  {
    id: "photo-basic",
    name: "Basic Photography",
    description: "Essential coverage for small events",
    basePrice: 15000,
  },
  {
    id: "photo-standard",
    name: "Standard Photography",
    description: "Complete coverage with premium editing",
    basePrice: 25000,
  },
  {
    id: "photo-premium",
    name: "Premium Photography",
    description: "Comprehensive coverage with all premium features",
    basePrice: 40000,
  },
]

// Videography packages
const videographyPackages: Package[] = [
  {
    id: "video-basic",
    name: "Basic Videography",
    description: "Essential video coverage",
    basePrice: 20000,
  },
  {
    id: "video-standard",
    name: "Standard Videography",
    description: "Full video coverage with highlights",
    basePrice: 35000,
  },
  {
    id: "video-premium",
    name: "Premium Videography",
    description: "Cinematic video with drone shots",
    basePrice: 50000,
  },
]

// Additional features
const additionalFeatures: Feature[] = [
  {
    id: "feature-drone",
    name: "Drone Shots",
    description: "Aerial photography and videography",
    price: 8000,
  },
  {
    id: "feature-album",
    name: "Premium Photo Album",
    description: "High-quality printed album (30 pages)",
    price: 5000,
  },
  {
    id: "feature-same-day",
    name: "Same-Day Edit",
    description: "Get a preview of selected photos on the same day",
    price: 3000,
  },
  {
    id: "feature-engagement",
    name: "Engagement Session",
    description: "Pre-wedding photoshoot (2 hours)",
    price: 10000,
  },
  {
    id: "feature-extra-photographer",
    name: "Additional Photographer",
    description: "Add another photographer to your team",
    price: 7000,
  },
  {
    id: "feature-extra-hours",
    name: "Extended Hours",
    description: "Add extra hours of coverage",
    price: 2500,
  },
]

export default function EstimationCalculator() {
  const [serviceType, setServiceType] = useState<"photography" | "videography" | "both">("photography")
  const [selectedPackage, setSelectedPackage] = useState<string>("photo-standard")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [hours, setHours] = useState<number>(8)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  // Calculate total price whenever selections change
  useEffect(() => {
    let price = 0

    // Add package price
    if (serviceType === "photography" || serviceType === "both") {
      const photoPackage = photographyPackages.find((p) => p.id === selectedPackage)
      if (photoPackage) {
        price += photoPackage.basePrice
      }
    }

    if (serviceType === "videography" || serviceType === "both") {
      const videoPackage = videographyPackages.find((p) => p.id === selectedPackage)
      if (videoPackage) {
        price += videoPackage.basePrice
      }
    }

    // Add feature prices
    selectedFeatures.forEach((featureId) => {
      const feature = additionalFeatures.find((f) => f.id === featureId)
      if (feature) {
        price += feature.price
      }
    })

    // Add price for extra hours (if more than 8)
    if (hours > 8) {
      price += (hours - 8) * 2500 // 2500 per extra hour
    }

    setTotalPrice(price)
  }, [serviceType, selectedPackage, selectedFeatures, hours])

  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Service Estimation Calculator</h1>
      <p className="text-gray-600 mb-8">Calculate the estimated cost of your photography or videography service</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Options Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <span>Service Type</span>
              </CardTitle>
              <CardDescription>Select the type of service you need</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={serviceType}
                onValueChange={(value) => {
                  setServiceType(value as "photography" | "videography" | "both")
                  // Reset package selection based on service type
                  if (value === "photography") {
                    setSelectedPackage("photo-standard")
                  } else if (value === "videography") {
                    setSelectedPackage("video-standard")
                  }
                }}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="photography" id="photography" />
                  <Label htmlFor="photography" className="cursor-pointer">
                    Photography Only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="videography" id="videography" />
                  <Label htmlFor="videography" className="cursor-pointer">
                    Videography Only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="cursor-pointer">
                    Both Photography & Videography
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <span>Package Selection</span>
              </CardTitle>
              <CardDescription>Choose your preferred package</CardDescription>
            </CardHeader>
            <CardContent>
              {(serviceType === "photography" || serviceType === "both") && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Photography Package</h3>
                  <Select
                    value={serviceType === "photography" ? selectedPackage : "photo-standard"}
                    onValueChange={(value) => setSelectedPackage(value)}
                    disabled={serviceType === "videography"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a package" />
                    </SelectTrigger>
                    <SelectContent>
                      {photographyPackages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - Rs. {pkg.basePrice.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-2">
                    {
                      photographyPackages.find(
                        (p) => p.id === (serviceType === "photography" ? selectedPackage : "photo-standard"),
                      )?.description
                    }
                  </p>
                </div>
              )}

              {(serviceType === "videography" || serviceType === "both") && (
                <div>
                  <h3 className="font-semibold mb-3">Videography Package</h3>
                  <Select
                    value={serviceType === "videography" ? selectedPackage : "video-standard"}
                    onValueChange={(value) => setSelectedPackage(value)}
                    disabled={serviceType === "photography"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a package" />
                    </SelectTrigger>
                    <SelectContent>
                      {videographyPackages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - Rs. {pkg.basePrice.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-2">
                    {
                      videographyPackages.find(
                        (p) => p.id === (serviceType === "videography" ? selectedPackage : "video-standard"),
                      )?.description
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Coverage Hours</span>
              </CardTitle>
              <CardDescription>Select how many hours of coverage you need</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Hours: {hours}</span>
                  <span className="text-gray-500">
                    {hours > 8 ? `+Rs. ${((hours - 8) * 2500).toLocaleString()} for extra hours` : ""}
                  </span>
                </div>
                <Slider min={4} max={12} step={1} value={[hours]} onValueChange={(value) => setHours(value[0])} />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>4 hours</span>
                  <span>8 hours</span>
                  <span>12 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Additional Features</span>
              </CardTitle>
              <CardDescription>Select additional services to enhance your package</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {additionalFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={feature.id}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor={feature.id} className="cursor-pointer font-medium">
                        {feature.name} - Rs. {feature.price.toLocaleString()}
                      </Label>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Price Estimate</CardTitle>
              <CardDescription>Summary of your selected services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Service Type */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">SERVICE TYPE</h3>
                  <p className="font-medium">
                    {serviceType === "photography"
                      ? "Photography Only"
                      : serviceType === "videography"
                        ? "Videography Only"
                        : "Photography & Videography"}
                  </p>
                </div>

                <Separator />

                {/* Package */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">SELECTED PACKAGE</h3>
                  {serviceType === "photography" && (
                    <div className="flex justify-between items-center">
                      <p>{photographyPackages.find((p) => p.id === selectedPackage)?.name}</p>
                      <p className="font-medium">
                        Rs. {photographyPackages.find((p) => p.id === selectedPackage)?.basePrice.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {serviceType === "videography" && (
                    <div className="flex justify-between items-center">
                      <p>{videographyPackages.find((p) => p.id === selectedPackage)?.name}</p>
                      <p className="font-medium">
                        Rs. {videographyPackages.find((p) => p.id === selectedPackage)?.basePrice.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {serviceType === "both" && (
                    <>
                      <div className="flex justify-between items-center">
                        <p>{photographyPackages.find((p) => p.id === "photo-standard")?.name}</p>
                        <p className="font-medium">
                          Rs. {photographyPackages.find((p) => p.id === "photo-standard")?.basePrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p>{videographyPackages.find((p) => p.id === "video-standard")?.name}</p>
                        <p className="font-medium">
                          Rs. {videographyPackages.find((p) => p.id === "video-standard")?.basePrice.toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Coverage Hours */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">COVERAGE HOURS</h3>
                  <div className="flex justify-between items-center">
                    <p>{hours} hours of coverage</p>
                    <p className="font-medium">
                      {hours > 8 ? `+Rs. ${((hours - 8) * 2500).toLocaleString()}` : "Included"}
                    </p>
                  </div>
                </div>

                {selectedFeatures.length > 0 && (
                  <>
                    <Separator />

                    {/* Additional Features */}
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500">ADDITIONAL FEATURES</h3>
                      {selectedFeatures.map((featureId) => {
                        const feature = additionalFeatures.find((f) => f.id === featureId)
                        return feature ? (
                          <div key={feature.id} className="flex justify-between items-center mt-2">
                            <p>{feature.name}</p>
                            <p className="font-medium">Rs. {feature.price.toLocaleString()}</p>
                          </div>
                        ) : null
                      })}
                    </div>
                  </>
                )}

                <Separator />

                {/* Total */}
                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">TOTAL ESTIMATE</h3>
                    <p className="font-bold text-xl">Rs. {totalPrice.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This is an estimate. Final pricing may vary based on specific requirements.
                  </p>
                </div>

                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">Request Booking</Button>

                <p className="text-center text-sm text-gray-500">No payment required now. This is just an estimate.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
