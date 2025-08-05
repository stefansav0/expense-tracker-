"use client";
import Link from "next/link";
export default function Sidebar(){
  return (
    <nav className="w-64 bg-white dark:bg-gray-800 p-4 h-screen space-y-4">
      <Link href="/dashboard" className="block hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded">Dashboard</Link>
      <Link href="/expense" className="block hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded">Expenses</Link>
      <Link href="/income" className="block hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded">Income</Link>
      <Link href="/reports" className="block hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded">Reports</Link>
      <Link href="/settings" className="block hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded">Settings</Link>
    </nav>
  );
}
