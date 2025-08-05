"use client";

import Link from "next/link";
import { Calculator, Percent, TrendingUp, Wallet, Banknote, Gauge, Target } from "lucide-react";

export default function CalculatorPage() {
  const calculators = [
    {
      name: "SIP Calculator",
      href: "/calculators/sip",
      description: "Calculate your SIP returns based on investment, return rate, and duration.",
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
    },
    {
      name: "Percentage Calculator",
      href: "/calculators/percentage",
      description: "Calculate percentage of any amount with simple inputs.",
      icon: <Percent className="w-6 h-6 text-green-600" />,
    },
    {
      name: "EMI Calculator",
      href: "/calculators/emi",
      description: "Calculate your monthly EMI on loans.",
      icon: <Wallet className="w-6 h-6 text-red-500" />,
    },
    {
      name: "GST Calculator",
      href: "/calculators/gst",
      description: "Calculate GST for any product/service.",
      icon: <Calculator className="w-6 h-6 text-yellow-500" />,
    },
    {
      name: "FD Calculator",
      href: "/calculators/fd",
      description: "Calculate Fixed Deposit returns.",
      icon: <Banknote className="w-6 h-6 text-blue-500" />,
    },
    {
      name: "Inflation Adjusted Return",
      href: "/calculators/inflation",
      description: "Adjust your returns according to inflation rates.",
      icon: <Gauge className="w-6 h-6 text-purple-500" />,
    },
    {
      name: "Goal-based Savings Calculator",
      href: "/calculators/goal",
      description: "Find out how much you need to save for your financial goals.",
      icon: <Target className="w-6 h-6 text-pink-500" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Financial Calculators</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gray-100 p-2 rounded-full">{calc.icon}</div>
              <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">{calc.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{calc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
