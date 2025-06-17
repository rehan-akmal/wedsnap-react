"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Check, X } from "lucide-react"
import { apiService } from "@/lib/api"
import { format } from "date-fns"

interface Availability {
  id: string
  date: string
  available: boolean
}

interface SellerAvailabilityCalendarProps {
  sellerId: string
  sellerName: string
}

export default function SellerAvailabilityCalendar({ sellerId, sellerName }: SellerAvailabilityCalendarProps) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Fetch seller's availabilities
  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setLoading(true)
        const data = await apiService.users.getAvailability(sellerId)
        setAvailabilities(data)
      } catch (error) {
        console.error("Error fetching seller availabilities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailabilities()
  }, [sellerId])

  // Get availability status for a date
  const getAvailabilityStatus = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    const availability = availabilities.find(avail => avail.date === dateString)
    return availability?.available ?? null // Return null if not set
  }

  // Custom calendar modifiers
  const modifiers = {
    available: (date: Date) => getAvailabilityStatus(date) === true,
    busy: (date: Date) => getAvailabilityStatus(date) === false,
    notSet: (date: Date) => getAvailabilityStatus(date) === null,
  }

  const modifiersStyles = {
    available: { backgroundColor: "#dcfce7", color: "#166534" }, // Green for available
    busy: { backgroundColor: "#fecaca", color: "#991b1b" }, // Red for busy
    notSet: { backgroundColor: "#f3f4f6", color: "#6b7280" }, // Grey for not set
  }

  // Handle date selection (read-only for buyers)
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
  }

  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {sellerName}'s Availability
          </CardTitle>
          <CardDescription>Loading availability calendar...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {sellerName}'s Calendar
            </CardTitle>
            <CardDescription>
              View {sellerName}'s availability for bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
              disabled={(date) => date < new Date()} // Disable past dates
            />
          </CardContent>
        </Card>
      </div>

      {/* Legend and Info */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
              <span className="text-sm">Busy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
              <span className="text-sm">Not Set</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Available Days:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {availabilities.filter(avail => avail.available).length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Busy Days:</span>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {availabilities.filter(avail => !avail.available).length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Set Days:</span>
              <Badge variant="secondary">
                {availabilities.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 