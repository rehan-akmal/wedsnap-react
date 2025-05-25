import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center - WedSnap",
  description: "Get help and support for your WedSnap experience",
}

export default function HelpCenter() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">How do I book a photographer?</h3>
              <p className="text-gray-600">
                Browse through our list of professional photographers, view their portfolios, and click the "Book Now" button on their profile. Follow the booking process to select your preferred date and package.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our platform.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">How can I cancel or reschedule my booking?</h3>
              <p className="text-gray-600">
                You can manage your bookings through your dashboard. Cancellations and rescheduling are subject to our cancellation policy, which varies by photographer.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-4">
              Need additional help? Our support team is available 24/7 to assist you.
            </p>
            <div className="space-y-2">
              <p>📧 Email: support@wedsnap.com</p>
              <p>📞 Phone: +1 (555) 123-4567</p>
              <p>💬 Live Chat: Available on the bottom right of your screen</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 