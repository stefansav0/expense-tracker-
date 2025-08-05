"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaSignInAlt,
  FaBlog,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import {
  MdDashboard,
  MdMoneyOff,
  MdAttachMoney,
  MdAdminPanelSettings,
  MdCalculate,
} from "react-icons/md";
import Image from "next/image";
import { isAdmin } from "@/utils/isAdmin";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-64 min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6 shadow-lg flex flex-col justify-between">
      <div>
        {/* User Info */}
        {user ? (
          <div className="mb-6 flex items-center gap-3 border-b border-gray-300 dark:border-gray-700 pb-4">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="User Photo"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-lg font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold">{user.displayName || "User"}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
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
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/expense"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <MdMoneyOff /> Expenses
            </Link>
          </li>
          <li>
            <Link
              href="/income"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <MdAttachMoney /> Income
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <FaBlog /> Blog
            </Link>
          </li>
          <li>
            <Link
              href="/calculators"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-green-100 dark:hover:bg-green-800 transition"
            >
              <MdCalculate /> Financial Calculators
            </Link>
          </li>

          {/* ✅ Invoice Generator */}
          <li>
            <Link
              href="/invoice"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-purple-100 dark:hover:bg-purple-800 transition"
            >
              <FaFileInvoiceDollar /> Invoice Generator
            </Link>
          </li>

          {/* Admin Only */}
          {user && isAdmin(user.email) && (
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2 rounded bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition"
              >
                <MdAdminPanelSettings /> Admin Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Theme & Logout */}
      <div className="space-y-4 mt-8">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </nav>
  );
}
