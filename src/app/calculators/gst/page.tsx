"use client";

import { useState, useMemo } from "react";
import { FaPercent, FaRupeeSign, FaReceipt, FaTag, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

// --- Utility function for GST calculations ---
const calculateGST = (amount: number, rate: number, isInclusive: boolean) => {
  if (amount <= 0 || rate < 0) {
    return { gstAmount: 0, totalAmount: 0, baseAmount: 0 };
  }

  const decimalRate = rate / 100;

  if (isInclusive) {
    // Case 2: Amount is inclusive of GST (Calculate base amount and GST component)
    const baseAmount = amount / (1 + decimalRate);
    const gstAmount = amount - baseAmount;
    return {
      gstAmount: gstAmount,
      totalAmount: amount, // The input is the total
      baseAmount: baseAmount,
    };
  } else {
    // Case 1: Amount is exclusive of GST (Calculate GST amount and total)
    const gstAmount = amount * decimalRate;
    const totalAmount = amount + gstAmount;
    return {
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      baseAmount: amount, // The input is the base
    };
  }
};

// --- Helper for formatting numbers ---
const formatCurrency = (value: number, decimal: boolean = true) => {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: decimal ? 2 : 0,
    minimumFractionDigits: decimal ? 2 : 0
  });
};

export default function GSTCalculator() {
  const [inputAmount, setInputAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [isInclusive, setIsInclusive] = useState(false); // false = Add GST (Exclusive), true = Remove GST (Inclusive)

  // --- Calculation Logic using useMemo for efficiency ---
  const { gstAmount, totalAmount, baseAmount } = useMemo(() => {
    return calculateGST(inputAmount, gstRate, isInclusive);
  }, [inputAmount, gstRate, isInclusive]);

  // Determine the theme color
  const themeColor = "blue";

  return (
    // Main Container: Modern background gradient (Blue theme)
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950 p-4 sm:p-8">

      {/* Calculator Card: Elegant, responsive, shadowed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 transition-shadow duration-300 hover:shadow-blue-500/40 dark:hover:shadow-blue-500/20 border border-gray-100 dark:border-gray-700"
      >

        {/* Header/Title Component (Blue theme) */}
        <CardTitle
          Icon={FaReceipt}
          title="GST Calculator"
          subtitle="Calculate GST components quickly for Indian markets."
          color={themeColor}
        />

        {/* Calculation Type Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-700 p-1 shadow-inner">
            <button
              onClick={() => setIsInclusive(false)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${!isInclusive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              + Add GST
            </button>
            <button
              onClick={() => setIsInclusive(true)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${isInclusive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              - Remove GST
            </button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="space-y-8">

          {/* 1. Base/Total Amount Input */}
          <InputControl
            label={isInclusive ? "Total Amount (Incl. GST)" : "Base Price (Excl. GST)"}
            unit="₹"
            value={inputAmount}
            min={100}
            max={100000}
            step={100}
            onChange={setInputAmount}
            Icon={FaRupeeSign}
            color={themeColor}
            formatValue={formatCurrency}
          />

          {/* 2. GST Rate */}
          <InputControl
            label="GST Rate"
            unit="%"
            value={gstRate}
            min={0}
            max={28} // Max standard GST rate in India
            step={0.1}
            onChange={setGstRate}
            Icon={FaPercent}
            color="indigo"
            formatValue={(val) => val.toFixed(1)}
          />
        </div>

        {/* --- Results Section --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <FaTag className={`text-${themeColor}-600 dark:text-${themeColor}-400`} /> Final Breakdown
          </h2>

          {/* Result Card: Final Amount (Highlighted) */}
          <div className={`p-5 bg-${themeColor}-100 dark:bg-${themeColor}-900/50 rounded-xl shadow-lg border-l-4 border-${themeColor}-600 dark:border-${themeColor}-400 mb-6`}>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium uppercase">
              {isInclusive ? "Original Base Price" : "Total Price Payable"}
            </p>
            <p className={`text-5xl font-extrabold text-${themeColor}-700 dark:text-${themeColor}-300 mt-2`}>
              {formatCurrency(isInclusive ? baseAmount : totalAmount, true)}
            </p>
          </div>

          {/* Result Grid: Component Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <ResultItem
              label={isInclusive ? "GST Component Removed" : "GST Payable Added"}
              value={formatCurrency(gstAmount, true)}
              iconColor="text-red-500" // Use red for tax component
            />
            <ResultItem
              label={isInclusive ? "Total Amount Received" : "Base Price"}
              value={formatCurrency(isInclusive ? baseAmount : inputAmount, true)}
              iconColor="text-green-500"
            />
            <div className="col-span-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-lg shadow-inner">
              {isInclusive ? "Final Base Price" : "Final Total Price"}:
              <span className={`float-right text-${themeColor}-600 dark:text-${themeColor}-400`}>
                {formatCurrency(isInclusive ? baseAmount : totalAmount, true)}
              </span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// --- Sub-Components (Reused for consistency) ---
// ----------------------------------------------------------------------

interface CardTitleProps {
  Icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ Icon, title, subtitle, color }) => (
  <header className="text-center pb-4">
    <div className={`flex items-center justify-center text-3xl font-extrabold text-${color}-600 dark:text-${color}-400 gap-3`}>
      <Icon className="w-8 h-8" />
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
    </div>
    <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">{subtitle}</p>
  </header>
);


interface InputControlProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  Icon: React.ElementType;
  color: string;
  formatValue: (value: number) => string;
}

const InputControl: React.FC<InputControlProps> = ({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  Icon,
  color,
  formatValue
}) => {
  const [isSliding, setIsSliding] = useState(false);

  return (
    <div className="relative bg-white dark:bg-gray-700/50 p-5 rounded-xl shadow-md border-t border-gray-100 dark:border-gray-700">
      <label className="flex items-center justify-between text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
        <span className="flex items-center gap-2">
          <Icon className={`w-4 h-4 text-${color}-500`} />
          {label}
        </span>

        <div className={`text-xl font-bold text-${color}-600 dark:text-${color}-400`}>
          {formatValue(value)} {unit}
        </div>
      </label>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onMouseDown={() => setIsSliding(true)}
        onMouseUp={() => setIsSliding(false)}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors duration-300 
                    range-lg accent-${color}-600 dark:accent-${color}-400`}
      />

      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>

      {/* Live Slider Value Popup */}
      {isSliding && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`absolute mt-2 p-1 px-3 rounded-full text-white text-xs font-bold shadow-md bg-${color}-600 dark:bg-${color}-500`}
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 40px)` }}
        >
          {formatValue(value)} {unit}
        </motion.div>
      )}
    </div>
  );
};


interface ResultItemProps {
  label: string;
  value: string;
  iconColor: string;
}

const ResultItem: React.FC<ResultItemProps> = ({ label, value, iconColor }) => (
  <div className="flex flex-col bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className={`text-xl font-bold ${iconColor}`}>{value}</p>
  </div>
);