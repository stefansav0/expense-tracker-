// app/privacy-policy/page.tsx
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Last updated: August 8, 2025</p>

      <p className="mb-4">
        This Privacy Policy describes how we collect, use, and disclose your information when you use our Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We collect personal information that you provide when registering or using our app, including your email, transaction data, and preferences.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to provide and improve the Service, manage your account, and communicate with you. We do not sell your personal information to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Storage</h2>
      <p className="mb-4">
        Your data is securely stored using Firebase services. While we take reasonable steps to protect your information, no system is completely secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies</h2>
      <p className="mb-4">
        We use cookies and similar technologies to enhance your experience. You can control cookie settings in your browser.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Third-Party Services</h2>
      <p className="mb-4">
        We may use third-party services like Google Analytics or Firebase Authentication, which may collect information as described in their privacy policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p className="mb-4">
        You may request access to, or deletion of, your personal data by contacting us at info@yourdomain.com.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will notify you of changes by updating the date at the top of this page.
      </p>

      <p className="mt-6">
        If you have any questions or concerns, please contact us at info@yourdomain.com.
      </p>
    </div>
  );
}
