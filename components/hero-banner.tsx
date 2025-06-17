import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-red-600 to-red-700 rounded-xl overflow-hidden">
      <div className="relative z-10 px-6 py-16 md:py-24 md:px-12 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Capture Your Perfect Moments with WedSnap</h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
          Connect with Pakistan's top photographers and videographers for weddings, engagements, and special events
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth/signup">
            <Button size="lg" variant="outline" className="bg-white text-red-800 hover:bg-gray-100">
              Join as Photographer
            </Button>
          </Link>
          <Link href="/gigs">
            <Button size="lg" variant="outline" className="bg-white text-red-800 hover:bg-gray-100">
              Find a Photographer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
