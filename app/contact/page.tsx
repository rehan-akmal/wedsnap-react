import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - WedSnap",
  description: "Get in touch with the WedSnap team",
}

export default function ContactUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Customer Support</h3>
                <p className="text-gray-600">support@wedsnap.com</p>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
              
              <div>
                <h3 className="font-medium">Business Inquiries</h3>
                <p className="text-gray-600">business@wedsnap.com</p>
                <p className="text-gray-600">+1 (555) 987-6543</p>
              </div>
              
              <div>
                <h3 className="font-medium">Office Location</h3>
                <p className="text-gray-600">
                  123 Wedding Street<br />
                  Suite 456<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
            <div className="space-y-2">
              <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
              <p>Saturday: 10:00 AM - 4:00 PM EST</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
} 