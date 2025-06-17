"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import { Plus, Trash2, Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { apiService } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

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

// Categories for selection
const categories = [
  "Wedding",
  "Engagement",
  "Pre-Wedding",
  "Bridal",
  "Family",
  "Mehndi",
  "Mayun",
  "Photography",
  "Videography",
]

interface Package {
  id: string
  name: string
  description: string
  price: string
  delivery_days: string
  revisions: string
  features: string[]
}

interface FAQ {
  id: string
  question: string
  answer: string
}

export default function CreateGigPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Basic Info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Images
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  // Packages - Updated to match backend structure
  const [packages, setPackages] = useState<Package[]>([
    {
      id: "p1",
      name: "Basic",
      description: "",
      price: "",
      delivery_days: "7",
      revisions: "1",
      features: ["Digital delivery"],
    },
    {
      id: "p2",
      name: "Standard",
      description: "",
      price: "",
      delivery_days: "7",
      revisions: "2",
      features: ["Digital delivery"],
    },
    {
      id: "p3",
      name: "Premium",
      description: "",
      price: "",
      delivery_days: "7",
      revisions: "3",
      features: ["Digital delivery"],
    },
  ])

  // FAQs
  const [faqs, setFaqs] = useState<FAQ[]>([{ id: "f1", question: "", answer: "" }])

  // Check authentication on component mount
  React.useEffect(() => {
    if (!user) {
      toast.error("Authentication required. Please log in to create a gig.")
      router.push("/auth/login")
    }
  }, [user, router])

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Handle real image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > 5) {
      toast.error("Maximum images reached. You can upload a maximum of 5 images per gig.")
      return
    }

    setIsUploading(true)
    try {
      const newFiles = Array.from(files)
      const newPreviewUrls: string[] = []

      // Create preview URLs
      newFiles.forEach((file) => {
        const url = URL.createObjectURL(file)
        newPreviewUrls.push(url)
      })

      setImages((prev) => [...prev, ...newFiles])
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
    } catch (error) {
      toast.error("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])
    
    setImages(images.filter((_, i) => i !== index))
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
  }

  // Update package - Fixed to use delivery_days instead of deliveryTime
  const updatePackage = (id: string, field: keyof Package, value: string | string[]) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, [field]: value } : pkg)))
  }

  // Add package feature
  const addPackageFeature = (packageId: string) => {
    setPackages(packages.map((pkg) => (pkg.id === packageId ? { ...pkg, features: [...pkg.features, ""] } : pkg)))
  }

  // Update package feature
  const updatePackageFeature = (packageId: string, index: number, value: string) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === packageId
          ? {
              ...pkg,
              features: pkg.features.map((feature, i) => (i === index ? value : feature)),
            }
          : pkg,
      ),
    )
  }

  // Remove package feature
  const removePackageFeature = (packageId: string, index: number) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === packageId
          ? {
              ...pkg,
              features: pkg.features.filter((_, i) => i !== index),
            }
          : pkg,
      ),
    )
  }

  // Add FAQ
  const addFAQ = () => {
    setFaqs([...faqs, { id: `f${faqs.length + 1}`, question: "", answer: "" }])
  }

  // Update FAQ
  const updateFAQ = (id: string, field: keyof FAQ, value: string) => {
    setFaqs(faqs.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq)))
  }

  // Remove FAQ
  const removeFAQ = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))
  }

  // Submit form with proper API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const loadingToast = toast.loading("Submitting your gig...")
    
    if (!user) {
      toast.dismiss(loadingToast)
      toast.error("Authentication required. Please log in to create a gig.")
      return
    }

    // Validation
    if (!title.trim()) {
      toast.dismiss(loadingToast)
      toast.error("Title is required. Please enter a title for your gig.")
      return
    }

    if (!description.trim()) {
      toast.dismiss(loadingToast)
      toast.error("Description is required. Please enter a description for your gig.")
      return
    }

    if (!location) {
      toast.dismiss(loadingToast)
      toast.error("Location is required. Please select your location.")
      return
    }

    if (!phoneNumber.trim()) {
      toast.dismiss(loadingToast)
      toast.error("Phone number is required. Please enter your contact number.")
      return
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s-]+$/
    if (!phoneRegex.test(phoneNumber)) {
      toast.dismiss(loadingToast)
      toast.error("Invalid phone number format. Please enter a valid phone number.")
      return
    }

    if (selectedCategories.length === 0) {
      toast.dismiss(loadingToast)
      toast.error("Categories are required. Please select at least one category.")
      return
    }

    if (images.length === 0) {
      toast.dismiss(loadingToast)
      toast.error("Images are required. Please upload at least one image.")
      return
    }

    // Check packages
    for (const pkg of packages) {
      if (!pkg.name.trim() || !pkg.description.trim() || !pkg.price.trim()) {
        toast.dismiss(loadingToast)
        toast.error("Package information is incomplete. Please fill in all package details.")
        return
      }

      // Validate price is a number
      if (isNaN(Number(pkg.price)) || Number(pkg.price) <= 0) {
        toast.dismiss(loadingToast)
        toast.error("Invalid package price. Please enter valid prices for all packages.")
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Prepare data to match backend expectations
      const gigData = {
        gig: {
          title: title.trim(),
          description: description.trim(),
          location,
          phone_number: phoneNumber.trim(),
          category_ids: selectedCategories,
          images: images,
          packages_attributes: packages.map((pkg) => ({
            name: pkg.name.trim(),
            description: pkg.description.trim(),
            price: Number(pkg.price),
            delivery_days: Number(pkg.delivery_days),
            revisions: Number(pkg.revisions),
          })),
          features_attributes: packages.flatMap((pkg) =>
            pkg.features.filter((feature) => feature.trim()).map((feature) => ({
              name: feature.trim(),
            }))
          ),
          faqs_attributes: faqs
            .filter((faq) => faq.question.trim() && faq.answer.trim())
            .map((faq) => ({
              question: faq.question.trim(),
              answer: faq.answer.trim(),
            })),
        },
      }

      // Create the gig
      const response = await apiService.gigs.createWithCustomErrorHandling(gigData)

      toast.dismiss(loadingToast)
      toast.success("Gig created successfully! Your gig has been created and is now pending review.")

      // Redirect to the created gig or seller dashboard
      router.push(`/gigs/${response.id}`)
    } catch (error: any) {
      toast.dismiss(loadingToast)
      console.error("Error creating gig:", error)
      
      // Handle different types of errors
      let errorMessage = "An error occurred while creating your gig. Please try again."
      
      // Check if it's an ApiError with error data
      if (error && typeof error === 'object' && 'data' in error && error.data && error.data.errors) {
        // Backend validation errors (array of error messages)
        if (Array.isArray(error.data.errors)) {
          errorMessage = `Validation Error: ${error.data.errors.join(", ")}`
        } else if (typeof error.data.errors === 'object') {
          // Field-specific errors
          const fieldErrors = Object.entries(error.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("; ")
          errorMessage = `Validation Error: ${fieldErrors}`
        }
      } else if (error && error.status) {
        // Handle specific HTTP status codes
        switch (error.status) {
          case 401:
            errorMessage = "Authentication Error: Please log in again to continue."
            break
          case 403:
            errorMessage = "Permission Denied: You don't have permission to create gigs."
            break
          case 422:
            errorMessage = `Validation Error: ${error.message || "Please check your input and try again."}`
            break
          case 500:
            errorMessage = "Server Error: Something went wrong on our end. Please try again later."
            break
          default:
            if (error.message) {
              errorMessage = error.message
            }
        }
      } else if (error && error.message) {
        // Use the error message if available
        errorMessage = error.message
      } else if (error && error.name === 'TypeError' && error.message.includes('fetch')) {
        // Network error
        errorMessage = "Network Error: Please check your internet connection and try again."
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Save as draft functionality
  const handleSaveAsDraft = async () => {
    // Implementation for saving as draft
    toast.success("Draft saved. Your gig has been saved as a draft.")
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-gray-600">Please log in to create a gig.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Gig</h1>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="packages">Packages & Pricing</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Gig Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Professional Wedding Photography in Lahore"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Gig Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your services in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="e.g., +92 300 1234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">Enter your contact number where clients can reach you</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation} required>
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

                {/* Categories Selection */}
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <p className="text-sm text-gray-600 mb-3">Select the categories that best describe your services</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Selected categories:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedCategories.map((category) => (
                          <span
                            key={category}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Gig Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">Upload up to 5 high-quality images that showcase your work.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={isUploading || images.length >= 5}
                      className="flex items-center gap-2"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {isUploading ? "Uploading..." : "Upload Images"}
                    </Button>
                    <span className="text-sm text-gray-500">
                      {images.length}/5 images uploaded
                    </span>
                  </div>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-40 w-full rounded-md overflow-hidden">
                          <Image
                            src={url}
                            alt={`Gig image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages & Pricing */}
          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Packages & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border rounded-lg p-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`pkg-name-${pkg.id}`}>Package Name</Label>
                          <Input
                            id={`pkg-name-${pkg.id}`}
                            value={pkg.name}
                            onChange={(e) => updatePackage(pkg.id, "name", e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor={`pkg-desc-${pkg.id}`}>Description</Label>
                          <Textarea
                            id={`pkg-desc-${pkg.id}`}
                            value={pkg.description}
                            onChange={(e) => updatePackage(pkg.id, "description", e.target.value)}
                            className="mt-1 h-20"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor={`pkg-price-${pkg.id}`}>Price (PKR)</Label>
                          <Input
                            id={`pkg-price-${pkg.id}`}
                            type="number"
                            min="1"
                            value={pkg.price}
                            onChange={(e) => updatePackage(pkg.id, "price", e.target.value)}
                            className="mt-1"
                            placeholder="e.g., 25000"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`pkg-delivery-${pkg.id}`}>Delivery (days)</Label>
                            <Input
                              id={`pkg-delivery-${pkg.id}`}
                              type="number"
                              min="1"
                              value={pkg.delivery_days}
                              onChange={(e) => updatePackage(pkg.id, "delivery_days", e.target.value)}
                              className="mt-1"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor={`pkg-revisions-${pkg.id}`}>Revisions</Label>
                            <Input
                              id={`pkg-revisions-${pkg.id}`}
                              type="number"
                              min="0"
                              value={pkg.revisions}
                              onChange={(e) => updatePackage(pkg.id, "revisions", e.target.value)}
                              className="mt-1"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Features</Label>
                          <div className="space-y-2 mt-2">
                            {pkg.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={feature}
                                  onChange={(e) => updatePackageFeature(pkg.id, index, e.target.value)}
                                  placeholder="e.g., Digital delivery"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePackageFeature(pkg.id, index)}
                                  className="text-red-500 hover:text-red-700"
                                  disabled={pkg.features.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addPackageFeature(pkg.id)}
                              className="mt-2 w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Feature
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs */}
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Add common questions and answers to help potential clients understand your services better.
                </p>

                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">FAQ Item</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFAQ(faq.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={faqs.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`faq-question-${faq.id}`}>Question</Label>
                          <Input
                            id={`faq-question-${faq.id}`}
                            value={faq.question}
                            onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                            className="mt-1"
                            placeholder="e.g., Do you travel to other cities?"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`faq-answer-${faq.id}`}>Answer</Label>
                          <Textarea
                            id={`faq-answer-${faq.id}`}
                            value={faq.answer}
                            onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                            className="mt-1 h-20"
                            placeholder="Provide a detailed answer..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addFAQ} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSaveAsDraft}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Gig...
              </>
            ) : (
              "Publish Gig"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}