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
    <nav className="w-full bg-white text-gray-800 shadow-md px-6 py-3 flex justify-between items-center">
      {/* Left - Branding or Logo */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <span className="text-xl font-bold text-blue-600">Zoho Clone</span>
        </Link>
      </div>

      {/* Center - Navigation Links */}
      <ul className="flex gap-6 items-center text-sm font-medium">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <MdDashboard /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/expense"
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <MdMoneyOff /> Expenses
          </Link>
        </li>
        <li>
          <Link
            href="/income"
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <MdAttachMoney /> Income
          </Link>
        </li>
        <li>
          <Link
            href="/calculators"
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <MdCalculate /> Calculators
          </Link>
        </li>
        <li>
          <Link
            href="/invoice"
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <FaFileInvoiceDollar /> Invoice
          </Link>
        </li>
      </ul>

      {/* Right - User Info or Login/Logout */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">{user.displayName || "User"}</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-1 text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaSignInAlt /> Login
          </button>
        )}
      </div>
    </nav>
  );
}
