"use client";


import { useState } from "react";
// Imports from lucide-react are kept. LucideIcon type is added for type safety.
import { Calculator, Percent, TrendingUp, Wallet, Banknote, Gauge, Target, Sparkles, Zap, ArrowRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

// --- TypeScript Interfaces to resolve 'implicitly has an any type' errors ---

// 1. Define the structure for a single calculator item in the array
interface CalculatorItem {
  name: string;
  href: string;
  description: string;
  icon: LucideIcon; // LucideIcon is the correct type for the imported Lucide components
  color: string;
  iconColor: string;
}

// 2. Define the props for the CalculatorCard component
interface CalculatorCardProps extends Omit<CalculatorItem, 'icon'> { // Omit icon from this interface as we map it to Icon prop below
  Icon: LucideIcon;
  index: number;
}

// --- Calculator Data (Refined with Dark Theme Colors) ---
const calculators: CalculatorItem[] = [
  {
    name: "SIP Calculator",
    href: "/calculators/sip", // Corrected link
    description: "Forecast your investment growth and total returns through systematic investing.",
    icon: TrendingUp,
    color: "emerald",
    iconColor: "text-emerald-400",
  },
  {
    name: "Percentage Calculator",
    href: "/calculators/percentage", // Corrected link
    description: "Quickly find the percentage of an amount, or the percentage change between two values.",
    icon: Percent,
    color: "blue",
    iconColor: "text-blue-400",
  },
  {
    name: "EMI Calculator",
    href: "/calculators/emi", // Corrected link
    description: "Calculate your equated monthly installment (EMI) for home, car, or personal loans.",
    icon: Wallet,
    color: "red",
    iconColor: "text-red-400",
  },
  {
    name: "GST Calculator",
    href: "/calculators/gst", // Corrected link
    description: "Accurately compute GST components (exclusive or inclusive) for products and services.",
    icon: Calculator,
    color: "amber",
    iconColor: "text-amber-400",
  },
  {
    name: "FD Calculator",
    href: "/calculators/fd", // Corrected link
    description: "Determine the maturity value and interest earned on your fixed deposit investments.",
    icon: Banknote,
    color: "sky",
    iconColor: "text-sky-400",
  },
  {
    name: "Inflation Adjusted Return",
    href: "/calculators/inflation", // Corrected link
    description: "Understand the true purchasing power of your investment returns after adjusting for inflation.",
    icon: Gauge,
    color: "fuchsia",
    iconColor: "text-fuchsia-400",
  },
  {
    name: "Goal-based Savings",
    href: "/calculators/goal", // Corrected link
    description: "Calculate the required monthly saving to achieve a specific future financial goal.",
    icon: Target,
    color: "rose",
    iconColor: "text-rose-400",
  },
];

// --- Sub-Component: Calculator Card ---
const CalculatorCard: React.FC<CalculatorCardProps> = ({ name, href, description, Icon, iconColor, color, index }) => {
  return (
    <motion.a
      href={href}
      // Animation for staggered entrance
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}

      // Hover effects: subtle lift and shadow glow
      whileHover={{ scale: 1.03, y: -4, boxShadow: `0 15px 30px rgba(var(--color-${color}-500), 0.4)` }}
      whileTap={{ scale: 0.98 }}

      className={`
                relative flex flex-col p-8 rounded-3xl transition-all duration-500
                bg-gray-800 dark:bg-gray-900/50 
                border border-gray-700
                shadow-xl shadow-black/30 dark:shadow-black/70
                
                // Modern Hover Glow (simulated via ring and border change)
                group
                hover:border-${color}-500/80 
                hover:ring-2 hover:ring-${color}-500/30 
            `}
    >
      {/* Corner Highlight (Modern Detail) */}
      <div className={`absolute top-0 right-0 w-8 h-8 rounded-bl-3xl bg-transparent border-b-2 border-l-2 border-${color}-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      <div className="flex items-center gap-4 mb-4 z-10">
        {/* Icon Container with Enhanced Animated Background */}
        <motion.div
          className={`p-4 rounded-xl transition-all duration-300 ${iconColor} bg-gray-700/50 dark:bg-gray-700/70 group-hover:bg-${color}-900/70 group-hover:shadow-lg group-hover:shadow-${color}-500/20`}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="w-7 h-7" />
        </motion.div>

        {/* Name */}
        <h3 className={`text-2xl font-bold text-white group-hover:${iconColor} transition-colors`}>
          {name}
        </h3>
      </div>

      {/* Description */}
      <p className="text-base text-gray-400 mb-6 z-10">
        {description}
      </p>

      {/* Call to Action/Arrow Hint */}
      <span className={`mt-auto text-sm font-semibold flex items-center gap-2 ${iconColor} transition-colors duration-300`}>
        Launch Calculator <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </motion.a>
  );
};

// --- Main App Component ---
export default function App() {
  return (
    // Deep, immersive dark background with subtle radial glow
    <div className="min-h-screen bg-gray-900 font-sans text-white relative overflow-hidden">

      {/* Background Radial Gradient Effect (for dramatic depth) */}
      <div className="absolute top-0 left-0 w-full h-full" style={{
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(30,58,138,0.1) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(109,40,217,0.1) 0%, transparent 50%)'
      }}></div>

      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto pt-20 pb-12 px-6 text-center relative z-10"
      >
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
        </div>
        <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 leading-tight">
          Your Financial Intelligence Hub
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          A comprehensive suite of tools designed for precision, clarity, and control over your investments and future.
        </p>
      </motion.header>

      {/* Calculator Grid */}
      <div className="max-w-6xl mx-auto p-6 pb-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {calculators.map((calc, index) => (
            <CalculatorCard
              key={calc.href}
              name={calc.name}
              href={calc.href}
              description={calc.description}
              Icon={calc.icon}
              iconColor={calc.iconColor}
              color={calc.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
