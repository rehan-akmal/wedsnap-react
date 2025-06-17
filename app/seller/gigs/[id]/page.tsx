"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { getActiveStorageUrl } from "@/lib/api"
import { api } from "@/lib/api"

interface GigImage {
  url: string
}

interface Gig {
  id: number
  title: string
  description: string
  images: GigImage[]
  // Add other gig properties as needed
}

export default function GigDetailPage() {
  const params = useParams()
  const [gig, setGig] = useState<Gig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await api.get<Gig>(`/gigs/${params.id}`)
        setGig(response)
      } catch (error) {
        console.error("Error fetching gig:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGig()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!gig) {
    return <div>Gig not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{gig.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {gig.images.map((image, index) => (
            <div key={index} className="relative aspect-video">
              <Image
                src={getActiveStorageUrl(image.url)}
                alt={`Gig image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700">{gig.description}</p>
        </div>
      </div>
    </div>
  )
} 