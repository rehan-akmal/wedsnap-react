"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Upload, X } from "lucide-react"
import Image from "next/image"

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
  deliveryTime: string
  revisions: string
  features: string[]
}

interface FAQ {
  id: string
  question: string
  answer: string
}

export default function CreateGigPage() {
  const { toast } = useToast()

  // Basic Info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Images
  const [images, setImages] = useState<string[]>([])

  // Packages
  const [packages, setPackages] = useState<Package[]>([
    {
      id: "p1",
      name: "Basic",
      description: "",
      price: "",
      deliveryTime: "7",
      revisions: "1",
      features: ["Digital delivery"],
    },
    {
      id: "p2",
      name: "Standard",
      description: "",
      price: "",
      deliveryTime: "7",
      revisions: "2",
      features: ["Digital delivery"],
    },
    {
      id: "p3",
      name: "Premium",
      description: "",
      price: "",
      deliveryTime: "7",
      revisions: "3",
      features: ["Digital delivery"],
    },
  ])

  // FAQs
  const [faqs, setFaqs] = useState<FAQ[]>([{ id: "f1", question: "", answer: "" }])

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Handle image upload
  const handleImageUpload = () => {
    // In a real app, this would handle file upload
    // For this demo, we'll just add a placeholder
    if (images.length < 5) {
      setImages([...images, "/placeholder.svg?height=300&width=400"])
    } else {
      toast({
        title: "Maximum images reached",
        description: "You can upload a maximum of 5 images per gig.",
        variant: "destructive",
      })
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Update package
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

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!title) {
      toast({
        title: "Title is required",
        description: "Please enter a title for your gig.",
        variant: "destructive",
      })
      return
    }

    if (!description) {
      toast({
        title: "Description is required",
        description: "Please enter a description for your gig.",
        variant: "destructive",
      })
      return
    }

    if (!location) {
      toast({
        title: "Location is required",
        description: "Please select your location.",
        variant: "destructive",
      })
      return
    }

    if (selectedCategories.length === 0) {
      toast({
        title: "Categories are required",
        description: "Please select at least one category.",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "Images are required",
        description: "Please upload at least one image.",
        variant: "destructive",
      })
      return
    }

    // Check packages
    for (const pkg of packages) {
      if (!pkg.name || !pkg.description || !pkg.price) {
        toast({
          title: "Package information is incomplete",
          description: "Please fill in all package details.",
          variant: "destructive",
        })
        return
      }
    }

    // In a real app, this would submit to an API
    toast({
      title: "Gig created successfully!",
      description: "Your gig has been created and is now pending review.",
    })
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
                  />
                </div>

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
                  <Button type="button" onClick={handleImageUpload} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-40 w-full rounded-md overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
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
                          />
                        </div>

                        <div>
                          <Label htmlFor={`pkg-desc-${pkg.id}`}>Description</Label>
                          <Textarea
                            id={`pkg-desc-${pkg.id}`}
                            value={pkg.description}
                            onChange={(e) => updatePackage(pkg.id, "description", e.target.value)}
                            className="mt-1 h-20"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`pkg-price-${pkg.id}`}>Price (PKR)</Label>
                          <Input
                            id={`pkg-price-${pkg.id}`}
                            type="number"
                            value={pkg.price}
                            onChange={(e) => updatePackage(pkg.id, "price", e.target.value)}
                            className="mt-1"
                            placeholder="e.g., 25000"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`pkg-delivery-${pkg.id}`}>Delivery (days)</Label>
                            <Input
                              id={`pkg-delivery-${pkg.id}`}
                              type="number"
                              value={pkg.deliveryTime}
                              onChange={(e) => updatePackage(pkg.id, "deliveryTime", e.target.value)}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`pkg-revisions-${pkg.id}`}>Revisions</Label>
                            <Input
                              id={`pkg-revisions-${pkg.id}`}
                              type="number"
                              value={pkg.revisions}
                              onChange={(e) => updatePackage(pkg.id, "revisions", e.target.value)}
                              className="mt-1"
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
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            Publish Gig
          </Button>
        </div>
      </form>
    </div>
  )
}
