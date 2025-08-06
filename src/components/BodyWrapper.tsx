'use client';

import Navbar from '@/components/Navbar';

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      <Navbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
