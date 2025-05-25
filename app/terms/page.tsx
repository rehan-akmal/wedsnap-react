import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - WedSnap",
  description: "WedSnap's terms of service and user agreement",
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-600">
            By accessing or using WedSnap's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-gray-600 mb-4">
            Permission is granted to temporarily access the materials (information or software) on WedSnap's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on WedSnap's website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="text-gray-600 mb-4">
            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
          </p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Maintaining the confidentiality of your account and password</li>
            <li>Restricting access to your computer and account</li>
            <li>Accepting responsibility for all activities that occur under your account or password</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Booking and Payments</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              All bookings are subject to availability and confirmation. Payment terms are as follows:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>A deposit is required to secure your booking</li>
              <li>Full payment is due before the service date</li>
              <li>All prices are subject to change without notice</li>
              <li>Refunds are subject to our cancellation policy</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className="text-gray-600">
            The Service and its original content, features, and functionality are owned by WedSnap and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-600">
            In no event shall WedSnap, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p className="text-gray-600">
            Questions about the Terms of Service should be sent to us at:
          </p>
          <p className="text-gray-600">
            Email: legal@wedsnap.com<br />
            Address: 123 Wedding Street, Suite 456, New York, NY 10001
          </p>
          <p className="text-gray-600 mt-4">
            Last Updated: March 15, 2024
          </p>
        </section>
      </div>
    </div>
  )
} 