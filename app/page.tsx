import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import PopularGigs from "@/components/popular-gigs"
import HeroBanner from "@/components/hero-banner"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroBanner />

      <section className="my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Find the Perfect Photographer for Your Special Day</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            WedSnap connects you with Pakistan's top photographers and videographers to capture your precious moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Portfolios</h3>
              <p className="text-gray-600">Explore work samples from talented photographers across Pakistan</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Services</h3>
              <p className="text-gray-600">Easily book photographers based on your event needs and budget</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-gray-600">Chat directly with photographers to discuss your vision</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/gigs">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Explore All Services
            </Button>
          </Link>
        </div>
      </section>

      <section className="my-16">
        <h2 className="text-2xl font-bold mb-8">Popular Photography Services</h2>
        <PopularGigs />
      </section>
    </div>
  )
}
