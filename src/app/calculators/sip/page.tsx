"use client";

import { useState, useMemo } from "react";
import { FaMoneyBillWave, FaPercentage, FaClock, FaChartBar, FaAngleDoubleUp } from "react-icons/fa";
import { motion } from "framer-motion";

// --- Utility function for SIP (Future Value of Annuity Due) calculation ---
const calculateSIP = (monthlyInvestment: number, annualRate: number, years: number) => {
  if (monthlyInvestment <= 0 || years <= 0) {
    return { maturityAmount: 0, totalInvested: 0, gain: 0 };
  }

  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  let maturityAmount = 0;

  if (monthlyRate === 0) {
    // Simple case: No returns
    maturityAmount = monthlyInvestment * months;
  } else {
    // Future Value of Annuity Due formula (assuming investment is at the start of the month)
    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    maturityAmount =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate)) /
      monthlyRate;
  }

  const totalInvested = monthlyInvestment * months;
  const gain = maturityAmount - totalInvested;

  return {
    maturityAmount: maturityAmount,
    totalInvested: totalInvested,
    gain: gain > 0 ? gain : 0,
  };
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

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000); // Increased default investment
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10); // Increased default duration

  // --- Calculation Logic using useMemo for efficiency ---
  const { maturityAmount, totalInvested, gain } = useMemo(() => {
    return calculateSIP(monthly, rate, years);
  }, [monthly, rate, years]);

  // Determine the theme color
  const themeColor = "emerald";

  return (
    // Main Container: Modern background gradient (Green/Emerald theme)
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-950 p-4 sm:p-8">

      {/* Calculator Card: Elegant, responsive, shadowed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 transition-shadow duration-300 hover:shadow-emerald-500/40 dark:hover:shadow-emerald-500/20 border border-gray-100 dark:border-gray-700"
      >

        {/* Header/Title Component (Emerald theme) */}
        <CardTitle
          Icon={FaChartBar}
          title="SIP Return Calculator"
          subtitle="Visualize the power of compounding on your systematic investments."
          color={themeColor}
        />

        {/* Input Controls */}
        <div className="space-y-8 mt-8">

          {/* 1. Monthly Investment */}
          <InputControl
            label="Monthly SIP Amount"
            unit="₹"
            value={monthly}
            min={500}
            max={50000}
            step={500}
            onChange={setMonthly}
            Icon={FaMoneyBillWave}
            color="emerald"
            formatValue={formatCurrency}
          />

          {/* 2. Expected Rate */}
          <InputControl
            label="Expected Annual Return"
            unit="%"
            value={rate}
            min={0.1}
            max={30}
            step={0.1}
            onChange={setRate}
            Icon={FaPercentage}
            color="lime"
            formatValue={(val) => val.toFixed(1)}
          />

          {/* 3. Duration */}
          <InputControl
            label="Investment Duration"
            unit="Years"
            value={years}
            min={1}
            max={30}
            step={1}
            onChange={setYears}
            Icon={FaClock}
            color="teal"
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
            <FaAngleDoubleUp className={`text-${themeColor}-600 dark:text-${themeColor}-400`} /> Compounding Results
          </h2>

          {/* Result Card: Maturity Amount (Highlighted) */}
          <div className={`p-5 bg-${themeColor}-100 dark:bg-${themeColor}-900/50 rounded-xl shadow-lg border-l-4 border-${themeColor}-600 dark:border-${themeColor}-400 mb-6`}>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium uppercase">Estimated Future Maturity Value</p>
            <p className={`text-5xl font-extrabold text-${themeColor}-700 dark:text-${themeColor}-300 mt-2`}>
              {formatCurrency(maturityAmount, true)}
            </p>
          </div>

          {/* Result Grid: Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <ResultItem
              label="Total Amount Invested"
              value={formatCurrency(totalInvested)}
              iconColor="text-gray-500"
            />
            <ResultItem
              label="Total Wealth Gained (Returns)"
              value={formatCurrency(gain)}
              iconColor="text-yellow-500"
            />
            <div className="col-span-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-lg shadow-inner">
              Total Wealth Creation:
              <span className={`float-right text-${themeColor}-600 dark:text-${themeColor}-400`}>
                {formatCurrency(maturityAmount)}
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