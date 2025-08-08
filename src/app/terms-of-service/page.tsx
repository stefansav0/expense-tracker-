// app/terms-of-service/page.tsx
import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">Last updated: August 8, 2025</p>

      <p className="mb-4">
        These Terms of Service ("Terms") govern your access to and use of the Expense Tracker application (the "Service") operated by us.
        By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of the Service</h2>
      <p className="mb-4">
        You must be at least 13 years old to use this Service. You agree not to use the Service for any unlawful or prohibited purpose.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Accounts</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.
        You agree to accept responsibility for all activities that occur under your account.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Subscriptions</h2>
      <p className="mb-4">
        Premium features may require a subscription. Subscriptions are billed monthly or annually. No refunds will be provided for unused time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Intellectual Property</h2>
      <p className="mb-4">
        All content, trademarks, and data on the Service are the property of the Company or its licensors and are protected by applicable laws.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your access to the Service at any time, without prior notice or liability, for any reason.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Limitation of Liability</h2>
      <p className="mb-4">
        In no event shall the Company be liable for any indirect, incidental, special, consequential or punitive damages arising out of your use of the Service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Governing Law</h2>
      <p className="mb-4">
        These Terms shall be governed by and construed in accordance with the laws of India.
      </p>

      <p className="mt-6">
        If you have any questions about these Terms, please contact us at info@yourdomain.com.
      </p>
    </div>
  );
}
