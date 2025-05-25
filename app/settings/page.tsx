"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Camera, Save, Lock, Bell, Calendar, User } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { apiService } from "@/lib/api"

// Pakistan cities for location selection
const pakistanCities = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
]

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [userSettings, setUserSettings] = useState<any>(null)

  // Profile settings
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [phone, setPhone] = useState("")
  const [profileImage, setProfileImage] = useState("")

  // Account settings
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Availability settings (for sellers)
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")

  // Fetch user settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return

      try {
        setLoading(true)
        const data = await apiService.user.getSettings()
        setUserSettings(data)

        // Set form values
        setName(data.name || "")
        setBio(data.bio || "")
        setLocation(data.location || "")
        setPhone(data.phone || "")
        setProfileImage(data.profileImage || "/placeholder.svg?height=100&width=100")
        setEmail(data.email || "")

        // Set notification settings
        setEmailNotifications(data.notifications?.email || true)
        setMessageNotifications(data.notifications?.messages || true)
        setOrderUpdates(data.notifications?.orders || true)
        setMarketingEmails(data.notifications?.marketing || false)

        // Set availability settings
        setAvailableDays(data.availability?.days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
        setStartTime(data.availability?.startTime || "09:00")
        setEndTime(data.availability?.endTime || "17:00")
      } catch (error) {
        console.error("Error fetching user settings:", error)
        toast({
          title: "Error",
          description: "Failed to load your settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserSettings()
    }
  }, [user, toast])

  // Handle profile image upload
  const handleImageUpload = async () => {
    // In a real app, this would handle file upload
    try {
      // Mock file upload
      const fileInput = document.createElement("input")
      fileInput.type = "file"
      fileInput.accept = "image/*"

      fileInput.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        // Upload the file
        const formData = new FormData()
        formData.append("profileImage", file)

        const response = await apiService.user.uploadProfileImage(formData)

        // Update the profile image
        setProfileImage(response.imageUrl)

        toast({
          title: "Profile image updated",
          description: "Your profile image has been updated successfully.",
        })
      }

      fileInput.click()
    } catch (error) {
      console.error("Error uploading profile image:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload your profile image. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name) {
      toast({
        title: "Name is required",
        description: "Please enter your name.",
        variant: "destructive",
      })
      return
    }

    try {
      const profileData = {
        name,
        bio,
        location,
        phone,
      }

      await apiService.user.updateProfile(profileData)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!currentPassword) {
      toast({
        title: "Current password is required",
        description: "Please enter your current password.",
        variant: "destructive",
      })
      return
    }

    if (!newPassword) {
      toast({
        title: "New password is required",
        description: "Please enter a new password.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    try {
      const passwordData = {
        currentPassword,
        newPassword,
      }

      await apiService.user.updatePassword(passwordData)

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Update failed",
        description: "Failed to update your password. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle notification settings
  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const notificationData = {
        email: emailNotifications,
        messages: messageNotifications,
        orders: orderUpdates,
        marketing: marketingEmails,
      }

      await apiService.user.updateNotificationSettings(notificationData)

      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been updated.",
      })
    } catch (error) {
      console.error("Error updating notification settings:", error)
      toast({
        title: "Update failed",
        description: "Failed to update your notification settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle availability settings
  const handleAvailabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const availabilityData = {
        days: availableDays,
        startTime,
        endTime,
      }

      await apiService.user.updateAvailability(availabilityData)

      toast({
        title: "Availability settings updated",
        description: "Your availability has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating availability settings:", error)
      toast({
        title: "Update failed",
        description: "Failed to update your availability. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Toggle available day
  const toggleAvailableDay = (day: string) => {
    setAvailableDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        <div className="h-12 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Tabs defaultValue="profile" className="mb-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Availability
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and how others see you on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full bg-purple-600 hover:bg-purple-700 h-8 w-8"
                        onClick={handleImageUpload}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleImageUpload}>
                      Change Photo
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger id="location">
                            <SelectValue placeholder="Select your city" />
                          </SelectTrigger>
                          <SelectContent>
                            {pakistanCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 300 1234567"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Address</CardTitle>
                <CardDescription>Update your email address</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      Update Email
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>Permanently delete your account and all of your data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Once you delete your account, there is no going back. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => {
                    // Show confirmation dialog
                    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      apiService.user
                        .deleteAccount()
                        .then(() => {
                          // Redirect to home page
                          window.location.href = "/"
                        })
                        .catch((error) => {
                          console.error("Error deleting account:", error)
                          toast({
                            title: "Error",
                            description: "Failed to delete your account. Please try again.",
                            variant: "destructive",
                          })
                        })
                    }
                  }}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Message Notifications</h3>
                      <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
                    </div>
                    <Switch checked={messageNotifications} onCheckedChange={setMessageNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Order Updates</h3>
                      <p className="text-sm text-gray-500">Receive updates about your orders</p>
                    </div>
                    <Switch checked={orderUpdates} onCheckedChange={setOrderUpdates} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marketing Emails</h3>
                      <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                    </div>
                    <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Settings */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>Set your working days and hours for bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAvailabilitySubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Available Days</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={availableDays.includes(day)}
                          onCheckedChange={() => toggleAvailableDay(day)}
                        />
                        <Label htmlFor={`day-${day}`} className="cursor-pointer">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Save Availability
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
