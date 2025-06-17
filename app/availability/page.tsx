"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Check, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { apiService } from "@/lib/api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { format } from "date-fns"

interface Availability {
  id: string
  date: string
  available: boolean
}

export default function AvailabilityPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [updating, setUpdating] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to access availability settings")
      router.push("/auth/login")
      return
    }
  }, [user, authLoading, router])

  // Fetch availabilities
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!user) return

      try {
        setLoading(true)
        const data = await apiService.availability.getAll()
        setAvailabilities(data)
      } catch (error) {
        console.error("Error fetching availabilities:", error)
        toast.error("Failed to load availability settings")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchAvailabilities()
    }
  }, [user])

  // Handle date selection and availability toggle
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date || !user || updating) return

    const dateString = format(date, "yyyy-MM-dd")
    const existingAvailability = availabilities.find(avail => avail.date === dateString)

    try {
      setUpdating(true)

      if (existingAvailability) {
        // Toggle existing availability
        const newAvailable = !existingAvailability.available
        const updatedAvailability = await apiService.availability.update(existingAvailability.id, {
          date: dateString,
          available: newAvailable
        })

        setAvailabilities(prev => 
          prev.map(avail => 
            avail.id === existingAvailability.id 
              ? updatedAvailability
              : avail
          )
        )

        toast.success(`Marked ${format(date, "MMM dd, yyyy")} as ${newAvailable ? "available" : "busy"}`)
      } else {
        // Create new availability (set as available when clicked)
        const newAvailability = await apiService.availability.create({
          date: dateString,
          available: true
        })

        setAvailabilities(prev => [...prev, newAvailability])
        toast.success(`Marked ${format(date, "MMM dd, yyyy")} as available`)
      }
    } catch (error: any) {
      console.error("Error updating availability:", error)
      if (error.status === 422) {
        // Validation error
        const errorMessage = error.data?.errors?.join(', ') || "Invalid date or availability setting"
        toast.error(errorMessage)
      } else {
        toast.error("Failed to update availability")
      }
    } finally {
      setUpdating(false)
    }
  }

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

  // Render loading state
  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading availability settings...</p>
          </div>
        </div>
      </div>
    )
  }

  // Render nothing if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Availability Calendar</h1>
          <p className="text-gray-600">
            Manage your availability by clicking on dates to mark them as available or busy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Your Calendar
                </CardTitle>
                <CardDescription>
                  Click on any date to toggle its availability status
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
                  disabled={updating}
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
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const today = new Date()
                    handleDateSelect(today)
                  }}
                  disabled={updating}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark Today as Available
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const today = new Date()
                    const dateString = format(today, "yyyy-MM-dd")
                    const existing = availabilities.find(avail => avail.date === dateString)
                    if (existing && existing.available) {
                      handleDateSelect(today) // This will toggle to busy
                    }
                  }}
                  disabled={updating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Mark Today as Busy
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available Days:</span>
                  <Badge variant="secondary">
                    {availabilities.filter(avail => avail.available).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Busy Days:</span>
                  <Badge variant="secondary">
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
      </div>
    </div>
  )
} 