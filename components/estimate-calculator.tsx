"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, Camera, Video, Plane, Zap, Palette, Scissors, Clock } from "lucide-react"
import { apiService } from "@/lib/api"

interface EstimateCalculatorProps {
  sellerId: string
  sellerName: string
}

interface ServiceOption {
  id: string
  name: string
  price: number
  icon: React.ReactNode
  description: string
}

export default function EstimateCalculator({ sellerId, sellerName }: EstimateCalculatorProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [expressDelivery, setExpressDelivery] = useState(false)
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Default service options
  const defaultServices: ServiceOption[] = [
    {
      id: "photography_coverage",
      name: "Photography Coverage",
      price: 18000,
      icon: <Camera className="h-4 w-4" />,
      description: "Professional photography coverage for your event"
    },
    {
      id: "videography_coverage",
      name: "Videography Coverage",
      price: 25000,
      icon: <Video className="h-4 w-4" />,
      description: "Complete video coverage and editing"
    },
    {
      id: "drone_footage",
      name: "Drone Footage",
      price: 8000,
      icon: <Plane className="h-4 w-4" />,
      description: "Aerial photography and videography"
    },
    {
      id: "gimbal_stabilizer",
      name: "Gimbal/Stabilizer",
      price: 5000,
      icon: <Zap className="h-4 w-4" />,
      description: "Smooth, stabilized footage"
    },
    {
      id: "basic_color_correction",
      name: "Basic Color Correction",
      price: 4000,
      icon: <Palette className="h-4 w-4" />,
      description: "Basic color grading and correction"
    },
    {
      id: "advanced_editing_package",
      name: "Advanced Editing Package",
      price: 7000,
      icon: <Scissors className="h-4 w-4" />,
      description: "Advanced editing with special effects"
    }
  ]

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiService.users.getEstimateCalculatorSettings(sellerId)
        setSettings(data)
      } catch (error) {
        console.error("Error fetching estimate calculator settings:", error)
        // Use default settings if fetch fails
        setSettings({
          photography_coverage: 18000,
          videography_coverage: 25000,
          drone_footage: 8000,
          gimbal_stabilizer: 5000,
          basic_color_correction: 4000,
          advanced_editing_package: 7000,
          express_delivery_surcharge: 20
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [sellerId])

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const getServicePrice = (serviceId: string): number => {
    if (!settings) return 0
    return settings[serviceId] || 0
  }

  const calculateSubtotal = (): number => {
    return selectedServices.reduce((total, serviceId) => {
      return total + getServicePrice(serviceId)
    }, 0)
  }

  const calculateExpressSurcharge = (): number => {
    if (!expressDelivery || !settings) return 0
    const subtotal = calculateSubtotal()
    return (subtotal * settings.express_delivery_surcharge) / 100
  }

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateExpressSurcharge()
  }

  const services = defaultServices.map(service => ({
    ...service,
    price: getServicePrice(service.id)
  }))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Estimate Calculator
          </CardTitle>
          <CardDescription>Loading calculator settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Estimate Calculator
        </CardTitle>
        <CardDescription>
          Select services to get an instant cost estimate from {sellerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Available Services</h3>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedServices.includes(service.id)
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleService(service.id)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <div className="flex items-center gap-2">
                    {service.icon}
                    <div>
                      <Label className="font-medium cursor-pointer">
                        {service.name}
                      </Label>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">PKR {service.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Express Delivery Option */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={expressDelivery}
                onCheckedChange={(checked) => setExpressDelivery(checked === true)}
              />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <div>
                  <Label className="font-medium cursor-pointer">
                    Express Delivery (24 hrs)
                  </Label>
                  <p className="text-sm text-gray-600">
                    +{settings?.express_delivery_surcharge || 20}% surcharge
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-red-600">
                +{settings?.express_delivery_surcharge || 20}%
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="border-t pt-4 space-y-3">
          <h3 className="font-semibold text-lg">Cost Breakdown</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>PKR {calculateSubtotal().toLocaleString()}</span>
            </div>
            
            {expressDelivery && (
              <div className="flex justify-between text-red-600">
                <span>Express Delivery Surcharge:</span>
                <span>PKR {calculateExpressSurcharge().toLocaleString()}</span>
              </div>
            )}
            
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Estimate:</span>
                <span className="text-red-600">
                  PKR {calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              setSelectedServices([])
              setExpressDelivery(false)
            }}
          >
            Reset
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          * This is an estimate. Final pricing may vary based on specific requirements.
        </div>
      </CardContent>
    </Card>
  )
} 