"use client";

import { useState, useMemo } from "react";
import { FaBullseye, FaRupeeSign, FaPercentage, FaCalendarAlt, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

// --- Utility function for time calculation ---
const calculateGoalTime = (G: number, S_monthly: number, R_annual: number) => {
  if (G <= 0 || S_monthly <= 0) return { monthsRequired: 0, yearsRequired: 0, totalInvested: 0 };

  // Monthly rate (r) = R_annual / 100 / 12
  const r = R_annual / 100 / 12;

  let monthsRequired = 0;

  if (r === 0) {
    // Simple case: No interest
    monthsRequired = G / S_monthly;
  } else {
    // Annuity Future Value formula solved for n (number of periods/months)
    // FV = S * [((1 + r)^n - 1) / r]
    // (1 + r)^n = (FV * r / S) + 1
    // n * ln(1 + r) = ln( (FV * r / S) + 1 )
    // n = ln( (FV * r / S) + 1 ) / ln(1 + r)

    const numerator = Math.log((G * r / S_monthly) + 1);
    const denominator = Math.log(1 + r);

    monthsRequired = numerator / denominator;
  }

  // Ensure it's a valid, positive number of months
  if (isNaN(monthsRequired) || !isFinite(monthsRequired) || monthsRequired < 0) {
    // Fallback for extreme cases or non-positive interest rates
    monthsRequired = G / S_monthly;
  }

  // Always round up to ensure the goal is fully met
  const finalMonths = Math.ceil(monthsRequired);
  const finalTotalInvested = finalMonths * S_monthly;
  const totalInterestEarned = finalTotalInvested > G ? G - finalTotalInvested : 0; // Simplified

  return {
    monthsRequired: finalMonths,
    yearsRequired: finalMonths / 12,
    totalInvested: finalTotalInvested,
    totalInterestEarned: G - (finalTotalInvested > G ? G : finalTotalInvested),
  };
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

export default function GoalCalculator() {
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [monthlySavings, setMonthlySavings] = useState(10000);
  const [interestRate, setInterestRate] = useState(8); // Annual rate

  // --- Calculation Logic using useMemo for efficiency ---
  const { monthsRequired, yearsRequired, totalInvested } = useMemo(() => {
    return calculateGoalTime(goalAmount, monthlySavings, interestRate);
  }, [goalAmount, monthlySavings, interestRate]);

  const totalInterest = goalAmount - totalInvested;

  return (
    // Main Container: Modern background gradient (Target/Cyan theme)
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-gray-900 dark:to-cyan-950 p-4 sm:p-8">

      {/* Calculator Card: Elegant, responsive, shadowed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 transition-shadow duration-300 hover:shadow-teal-500/40 dark:hover:shadow-teal-500/20 border border-gray-100 dark:border-gray-700"
      >

        {/* Header/Title Component (Teal theme) */}
        <CardTitle
          Icon={FaBullseye}
          title="Goal Savings Planner"
          subtitle="Find out how long it will take to reach your financial target."
        />

        {/* Input Controls */}
        <div className="space-y-8 mt-8">

          {/* 1. Goal Amount */}
          <InputControl
            label="Target Goal Amount"
            unit="₹"
            value={goalAmount}
            min={10000}
            max={5000000}
            step={10000}
            onChange={setGoalAmount}
            Icon={FaStar}
            color="cyan"
            formatValue={formatCurrency}
          />

          {/* 2. Monthly Savings */}
          <InputControl
            label="Monthly Savings / SIP"
            unit="₹"
            value={monthlySavings}
            min={500}
            max={50000}
            step={500}
            onChange={setMonthlySavings}
            Icon={FaRupeeSign}
            color="teal"
            formatValue={formatCurrency}
          />

          {/* 3. Interest Rate */}
          <InputControl
            label="Expected Annual Return"
            unit="%"
            value={interestRate}
            min={0.1}
            max={15}
            step={0.1}
            onChange={setInterestRate}
            Icon={FaPercentage}
            color="green"
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
            <FaCalendarAlt className="text-cyan-600 dark:text-cyan-400" /> Time Required
          </h2>

          {/* Result Card: Months Required (Highlighted) */}
          <div className="p-5 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl shadow-lg border-l-4 border-cyan-600 dark:border-cyan-400 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium uppercase">Total Time to Reach Goal</p>
            <p className="text-5xl font-extrabold text-cyan-700 dark:text-cyan-300 mt-2">
              {monthsRequired} <span className="text-2xl font-semibold">Months</span>
            </p>
            {yearsRequired > 1 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ({yearsRequired.toFixed(1)} years)
              </p>
            )}
          </div>

          {/* Result Grid: Investment Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <ResultItem
              label="Total Amount Saved"
              value={formatCurrency(totalInvested)}
              iconColor="text-teal-500"
            />
            <ResultItem
              label="Interest Earned (Appx.)"
              value={formatCurrency(goalAmount - totalInvested)} // Simple calculation
              iconColor="text-green-500"
            />
            <div className="col-span-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-lg shadow-inner">
              Goal Achieved: <span className="float-right text-cyan-600 dark:text-cyan-400">{formatCurrency(goalAmount)}</span>
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
}

const CardTitle: React.FC<CardTitleProps> = ({ Icon, title, subtitle }) => (
  <header className="text-center pb-4">
    <div className="flex items-center justify-center text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 gap-3">
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