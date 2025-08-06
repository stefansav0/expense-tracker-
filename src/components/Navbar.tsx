"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  FaSignOutAlt,
  FaSignInAlt,
  FaFileInvoiceDollar,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import {
  MdDashboard,
  MdMoneyOff,
  MdAttachMoney,
  MdCalculate,
} from "react-icons/md";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-blue-600 font-bold text-xl">
          Expense <span className="text-gray-900">Tracker</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          <li><Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1"><MdDashboard />Dashboard</Link></li>
          <li><Link href="/expense" className="hover:text-blue-600 flex items-center gap-1"><MdMoneyOff />Expenses</Link></li>
          <li><Link href="/income" className="hover:text-blue-600 flex items-center gap-1"><MdAttachMoney />Income</Link></li>
          <li><Link href="/calculators" className="hover:text-blue-600 flex items-center gap-1"><MdCalculate />Calculators</Link></li>
          <li><Link href="/invoice" className="hover:text-blue-600 flex items-center gap-1"><FaFileInvoiceDollar />Invoice</Link></li>
          {user && (
            <li className="flex items-center gap-3">
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
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-sm leading-tight">
                  <p className="font-medium">{user.displayName || "RAVI KUMAR"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <ul className="flex flex-col px-4 py-3 space-y-3 text-sm">
            <li><Link href="/dashboard" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link></li>
            <li><Link href="/expense" onClick={() => setMenuOpen(false)}>💸 Expenses</Link></li>
            <li><Link href="/income" onClick={() => setMenuOpen(false)}>💰 Income</Link></li>
            <li><Link href="/calculators" onClick={() => setMenuOpen(false)}>📈 Calculators</Link></li>
            <li><Link href="/invoice" onClick={() => setMenuOpen(false)}>📄 Invoice</Link></li>
            {user && (
              <li className="flex flex-col gap-1 border-t pt-2">
                <div className="text-sm">
                  <p className="font-medium">{user.displayName || "RAVI KUMAR"}</p>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-red-600 hover:underline"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
