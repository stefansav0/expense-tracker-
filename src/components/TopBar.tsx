"use client";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
export default function TopBar(){
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900">
      <h1 className="text-xl font-bold">Expense Tracker</h1>
      <div className="space-x-4 flex items-center">
        <ThemeToggle />
        <span>{user?.email}</span>
        <button onClick={() => { logout(); router.push('/login') }} className="text-red-600">Logout</button>
      </div>
    </header>
  );
}
