"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  FaSignOutAlt,
  FaSignInAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import {
  MdDashboard,
  MdMoneyOff,
  MdAttachMoney,
  MdCalculate,
} from "react-icons/md";
import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-64 min-h-screen bg-white text-gray-800 p-6 shadow-lg flex flex-col justify-between">
      <div>
        {/* User Info */}
        {user ? (
          <div className="mb-6 flex items-center gap-3 border-b border-gray-300 pb-4">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="User Photo"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold">{user.displayName || "User"}</p>
              <p className="text-sm text-gray-600 truncate max-w-[150px]">
                {user.email}
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 mb-6 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <FaSignInAlt /> Login
          </button>
        )}

        {/* Navigation Links */}
        <ul className="space-y-3">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 transition"
            >
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/expense"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 transition"
            >
              <MdMoneyOff /> Expenses
            </Link>
          </li>
          <li>
            <Link
              href="/income"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 transition"
            >
              <MdAttachMoney /> Income
            </Link>
          </li>
          <li>
            <Link
              href="/calculators"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-green-100 transition"
            >
              <MdCalculate /> Financial Calculators
            </Link>
          </li>
          <li>
            <Link
              href="/invoice"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-purple-100 transition"
            >
              <FaFileInvoiceDollar /> Invoice Generator
            </Link>
          </li>
        </ul>
      </div>

      {/* Logout Button */}
      {user && (
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
