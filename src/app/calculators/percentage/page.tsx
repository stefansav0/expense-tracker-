"use client";

import { useState, useMemo } from "react";
import { FaCalculator, FaPercent, FaRupeeSign, FaMinus, FaPlus, FaTag } from "react-icons/fa";
import { motion } from "framer-motion";

// --- Utility function for Percentage calculations ---
const calculatePercentage = (amount: number, percentage: number) => {
  // 1. Calculate the percentage OF the amount
  const resultOfAmount = (amount * percentage) / 100;

  // 2. Calculate the increase/decrease
  const amountPlus = amount + resultOfAmount;
  const amountMinus = amount - resultOfAmount;

  return { resultOfAmount, amountPlus, amountMinus };
};

// --- Utility function for Percentage Difference (Calculation Type 2) ---
const calculatePercentageDifference = (part: number, whole: number) => {
  if (whole === 0) return 0;
  return (part / whole) * 100;
};

// --- Helper for formatting numbers ---
const formatNumber = (value: number, decimal: boolean = true) => {
  // Use toLocaleString for clear separation of thousands
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: decimal ? 2 : 0,
    minimumFractionDigits: decimal ? 2 : 0
  });
};

export default function PercentageCalculator() {
  const [calculationType, setCalculationType] = useState<'of' | 'diff'>('of');

  // State for Type 1: X% of Y
  const [amountY, setAmountY] = useState(10000);
  const [percentX, setPercentX] = useState(15);

  // State for Type 2: X is what % of Y
  const [partX, setPartX] = useState(500);
  const [wholeY, setWholeY] = useState(2000);

  // --- Calculation Logic using useMemo for efficiency ---
  const { resultOfAmount, amountPlus, amountMinus } = useMemo(() => {
    return calculatePercentage(amountY, percentX);
  }, [amountY, percentX]);

  const percentageDifference = useMemo(() => {
    return calculatePercentageDifference(partX, wholeY);
  }, [partX, wholeY]);

  // Determine the theme color
  const themeColor = "slate";

  return (
    // Main Container: Modern background gradient (Neutral/Gray theme)
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-950 p-4 sm:p-8">

      {/* Calculator Card: Elegant, responsive, shadowed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 transition-shadow duration-300 hover:shadow-slate-500/40 dark:hover:shadow-slate-500/20 border border-gray-100 dark:border-gray-700"
      >

        {/* Header/Title Component */}
        <CardTitle
          Icon={FaCalculator}
          title="Universal Percentage Tool"
          subtitle="Calculate percentages, find differences, and more."
          color={themeColor}
        />

        {/* Calculation Type Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-700 p-1 shadow-inner">
            <button
              onClick={() => setCalculationType('of')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${calculationType === 'of'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              X% of Y
            </button>
            <button
              onClick={() => setCalculationType('diff')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${calculationType === 'diff'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              X is Y% of Z
            </button>
          </div>
        </div>

        {/* --- Input Controls Based on Type --- */}
        {calculationType === 'of' ? (
          <motion.div
            key="type-of"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* 1. Percentage (X) */}
            <InputControl
              label="Percentage (X)"
              unit="%"
              value={percentX}
              min={0}
              max={100}
              step={0.1}
              onChange={setPercentX}
              Icon={FaPercent}
              color="indigo"
              formatValue={(val) => val.toFixed(1)}
            />

            {/* 2. Amount (Y) */}
            <InputControl
              label="of Amount (Y)"
              unit="Value"
              value={amountY}
              min={1}
              max={100000}
              step={100}
              onChange={setAmountY}
              Icon={FaRupeeSign}
              color="slate"
              formatValue={formatNumber}
            />
          </motion.div>
        ) : (
          <motion.div
            key="type-diff"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* 1. Part Amount (X) */}
            <InputControl
              label="Part (X)"
              unit="Value"
              value={partX}
              min={0}
              max={100000}
              step={10}
              onChange={setPartX}
              Icon={FaRupeeSign}
              color="red"
              formatValue={formatNumber}
            />

            {/* 2. Whole Amount (Y) */}
            <InputControl
              label="Whole (Y)"
              unit="Value"
              value={wholeY}
              min={1}
              max={100000}
              step={100}
              onChange={setWholeY}
              Icon={FaRupeeSign}
              color="green"
              formatValue={formatNumber}
            />
          </motion.div>
        )}

        {/* --- Results Section --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <FaTag className={`text-${themeColor}-600 dark:text-${themeColor}-400`} /> Calculation Results
          </h2>

          {calculationType === 'of' ? (
            <>
              {/* Result Card: Percentage Result (Highlighted) */}
              <div className={`p-5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl shadow-lg border-l-4 border-indigo-600 dark:border-indigo-400 mb-6`}>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium uppercase">
                  {percentX.toFixed(1)}% of {formatNumber(amountY)} is
                </p>
                <p className={`text-5xl font-extrabold text-indigo-700 dark:text-indigo-300 mt-2`}>
                  ₹{formatNumber(resultOfAmount, true)}
                </p>
              </div>

              {/* Result Grid: Plus/Minus Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <ResultItem
                  label={`Amount Minus ${percentX.toFixed(1)}%`}
                  value={`₹${formatNumber(amountMinus, true)}`}
                  iconColor="text-red-500"
                />
                <ResultItem
                  label={`Amount Plus ${percentX.toFixed(1)}%`}
                  value={`₹${formatNumber(amountPlus, true)}`}
                  iconColor="text-green-500"
                />
              </div>
            </>
          ) : (
            <>
              {/* Result Card: Percentage Difference (Highlighted) */}
              <div className={`p-5 bg-red-100 dark:bg-red-900/50 rounded-xl shadow-lg border-l-4 border-red-600 dark:border-red-400 mb-6`}>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium uppercase">
                  {formatNumber(partX)} is this much percentage of {formatNumber(wholeY)}
                </p>
                <p className={`text-5xl font-extrabold text-red-700 dark:text-red-300 mt-2`}>
                  {percentageDifference.toFixed(2)}%
                </p>
              </div>

              <div className="col-span-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-lg shadow-inner">
                The percentage of change is a powerful metric.
              </div>
            </>
          )}
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