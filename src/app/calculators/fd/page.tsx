"use client";

import { useState, useMemo } from "react";
import { FaMoneyBillWave, FaPercentage, FaClock, FaChartLine, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";

// --- Utility function for simple interest (FD) calculation ---
const calculateFD = (P: number, R: number, T: number) => {
  // Note: This implements simple interest (I = PRT/100), common for basic FD calculators.
  // For compounding (FV = P * (1 + R/n)^(nt)), the logic would be slightly different.
  if (P < 0 || R < 0 || T < 0) return { interest: 0, maturityAmount: 0 };

  const interest = (P * R * T) / 100;
  const maturityAmount = P + interest;

  return { interest, maturityAmount };
};

// --- Helper for formatting numbers ---
const formatCurrency = (value: number, decimal: boolean = false) => {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: decimal ? 2 : 0,
    minimumFractionDigits: decimal ? 2 : 0
  });
};

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.5); // Using a common decimal rate
  const [years, setYears] = useState(5);

  // --- Calculation Logic using useMemo for efficiency ---
  const { interest, maturityAmount } = useMemo(() => {
    return calculateFD(principal, rate, years);
  }, [principal, rate, years]);

  return (
    // Main Container: Modern background gradient (Growth/Amber theme)
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-yellow-950 p-4 sm:p-8">

      {/* Calculator Card: Elegant, responsive, shadowed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 transition-shadow duration-300 hover:shadow-amber-500/40 dark:hover:shadow-amber-500/20 border border-gray-100 dark:border-gray-700"
      >

        {/* Header/Title Component (Amber theme) */}
        <CardTitle
          Icon={FaChartLine}
          title="FD Maturity Calculator"
          subtitle="Calculate the returns on your fixed deposit investment."
        />

        {/* Input Controls */}
        <div className="space-y-8 mt-8">

          {/* 1. Principal Amount */}
          <InputControl
            label="Principal Amount"
            unit="₹"
            value={principal}
            min={1000}
            max={5000000}
            step={1000}
            onChange={setPrincipal}
            Icon={FaMoneyBillWave}
            color="amber"
            formatValue={formatCurrency}
          />

          {/* 2. Interest Rate */}
          <InputControl
            label="Annual Interest Rate"
            unit="%"
            value={rate}
            min={0.1}
            max={15}
            step={0.1}
            onChange={setRate}
            Icon={FaPercentage}
            color="orange"
            formatValue={(val) => val.toFixed(2)}
          />

          {/* 3. Tenure */}
          <InputControl
            label="Tenure"
            unit="Years"
            value={years}
            min={1}
            max={20}
            step={1}
            onChange={setYears}
            Icon={FaClock}
            color="yellow"
            formatValue={(val) => `${val}`}
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
            <FaArrowUp className="text-amber-600 dark:text-amber-400" /> Investment Outcome
          </h2>

          {/* Result Card: Maturity Amount (Highlighted) */}
          <div className="p-5 bg-amber-100 dark:bg-amber-900/50 rounded-xl shadow-lg border-l-4 border-amber-600 dark:border-amber-400 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium uppercase">Total Maturity Amount</p>
            <p className="text-5xl font-extrabold text-amber-700 dark:text-amber-300 mt-2">
              {formatCurrency(maturityAmount, true)}
            </p>
          </div>

          {/* Result Grid: Interest and Principal */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <ResultItem
              label="Principal Invested"
              value={formatCurrency(principal)}
              iconColor="text-gray-500"
            />
            <ResultItem
              label="Total Interest Earned"
              value={formatCurrency(interest)}
              iconColor="text-green-500"
            />
            <div className="col-span-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-lg shadow-inner">
              Net Gain: <span className="float-right text-amber-600 dark:text-amber-400">{formatCurrency(maturityAmount)}</span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// --- Sub-Components (Reused and slightly modified for coloring) ---
// ----------------------------------------------------------------------

interface CardTitleProps {
  Icon: React.ElementType;
  title: string;
  subtitle: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ Icon, title, subtitle }) => (
  <header className="text-center pb-4">
    <div className="flex items-center justify-center text-3xl font-extrabold text-amber-600 dark:text-amber-400 gap-3">
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
  color: 'amber' | 'orange' | 'yellow' | 'teal' | 'pink' | 'indigo'; // Added amber/orange/yellow
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
    <div className="bg-white dark:bg-gray-700/50 p-5 rounded-xl shadow-md border-t border-gray-100 dark:border-gray-700">
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