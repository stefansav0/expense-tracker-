"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <main className="flex items-center justify-center h-screen text-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Expense Clone
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Track your income & expenses effortlessly with features like recurring
          entries, charts, dark mode, and PDF export.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-lg rounded-md shadow hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
