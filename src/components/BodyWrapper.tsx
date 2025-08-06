// components/BodyWrapper.tsx
'use client';

import Navbar from './Navbar';

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4 bg-gray-50 dark:bg-gray-900 transition-colors">
        {children}
      </main>
    </div>
  );
}
