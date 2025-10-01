"use client";

import { useState, useMemo } from "react";
import { FaChartLine, FaRupeeSign, FaPercentage, FaClock, FaHeartbeat } from "react-icons/fa";
import { motion } from "framer-motion";

// --- Utility function for Inflation-Adjusted calculation ---
const calculateInflationAdjusted = (P: number, R_nominal: number, R_inflation: number, T_years: number) => {
  if (P <= 0 || T_years < 0) return { adjustedAmount: 0, nominalAmount: 0, purchasingPowerLoss: 0 };

  // Fisher Equation (Approximation for Real Rate of Return): R_real = R_nominal - R_inflation
  const R_real = (R_nominal - R_inflation) / 100;

  // Future Value (Nominal): FV_nominal = P * (1 + R_nominal)^T
  const R_nominal_decimal = R_nominal / 100;
  const nominalAmount = P * Math.pow(1 + R_nominal_decimal, T_years);

  // Future Value (Real/Adjusted): FV_real = P * (1 + R_real)^T
  const adjustedAmount = P * Math.pow(1 + R_real, T_years);

  // Loss is the difference between the Nominal future value and the Real future value
  const purchasingPowerLoss = nominalAmount - adjustedAmount;

  return { adjustedAmount, nominalAmount, purchasingPowerLoss };
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

export default function InflationCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8);
  const [inflationRate, setInflationRate] = useState(5); // Increased default inflation
  const [years, setYears] = useState(10); // Added tenure input

  // --- Calculation Logic using useMemo for efficiency ---
  const { adjustedAmount, nominalAmount, purchasingPowerLoss } = useMemo(() => {
    return calculateInflationAdjusted(amount, rate, inflationRate, years);
  }, [amount, rate, inflationRate, years]);

  // Determine the theme color
  const themeColor = "fuchsia";

  // Calculate the real rate for display
  const realRate = rate - inflationRate;

  return (
    // Main Container: Modern background gradient (Fuchsia/Erosion theme)
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-fuchsia-100 dark:from-gray-900 dark:to-fuchsia-950 p-4 sm:p-8">

      {/* Calculator Card: Elegant, responsive, shadowed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 transition-shadow duration-300 hover:shadow-fuchsia-500/40 dark:hover:shadow-fuchsia-500/20 border border-gray-100 dark:border-gray-700"
      >

        {/* Header/Title Component (Fuchsia theme) */}
        <CardTitle
          Icon={FaHeartbeat} // Icon suggesting financial health/vitality
          title="Real Return Calculator"
          subtitle="Measure your investment growth after accounting for inflation."
          color={themeColor}
        />

        {/* Input Controls */}
        <div className="space-y-8 mt-8">

          {/* 1. Investment Amount */}
          <InputControl
            label="Initial Investment Amount"
            unit="₹"
            value={amount}
            min={10000}
            max={1000000}
            step={5000}
            onChange={setAmount}
            Icon={FaRupeeSign}
            color="fuchsia"
            formatValue={formatCurrency}
          />

          {/* 2. Annual Return Rate */}
          <InputControl
            label="Nominal Annual Return"
            unit="%"
            value={rate}
            min={0}
            max={30}
            step={0.1}
            onChange={setRate}
            Icon={FaPercentage}
            color="pink"
            formatValue={(val) => val.toFixed(1)}
          />

          {/* 3. Inflation Rate */}
          <InputControl
            label="Expected Annual Inflation Rate"
            unit="%"
            value={inflationRate}
            min={0}
            max={15}
            step={0.1}
            onChange={setInflationRate}
            Icon={FaChartLine}
            color="red"
            formatValue={(val) => val.toFixed(1)}
          />

          {/* 4. Tenure */}
          <InputControl
            label="Investment Period"
            unit="Years"
            value={years}
            min={1}
            max={30}
            step={1}
            onChange={setYears}
            Icon={FaClock}
            color="indigo"
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
            <FaChartLine className={`text-${themeColor}-600 dark:text-${themeColor}-400`} /> Inflation Impact
          </h2>

          {/* Result Card: Inflation Adjusted Amount (The real value) */}
          <div className={`p-5 bg-${themeColor}-100 dark:bg-${themeColor}-900/50 rounded-xl shadow-lg border-l-4 border-${themeColor}-600 dark:border-${themeColor}-400 mb-6`}>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium uppercase">
              Future Value Adjusted for Inflation
            </p>
            <p className={`text-5xl font-extrabold text-${themeColor}-700 dark:text-${themeColor}-300 mt-2`}>
              {formatCurrency(adjustedAmount, true)}
            </p>
          </div>

          {/* Result Grid: Component Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <ResultItem
              label="Nominal Future Value (Ignoring Inflation)"
              value={formatCurrency(nominalAmount)}
              iconColor="text-pink-500"
            />
            <ResultItem
              label="Real Rate of Return (R - I)"
              value={`${realRate.toFixed(2)}%`}
              iconColor={realRate < 0 ? "text-red-500" : "text-green-500"} // Highlight if rate is negative!
            />
            <div className="col-span-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-lg shadow-inner">
              Total Purchasing Power Loss:
              <span className="float-right text-red-600 dark:text-red-400">
                {formatCurrency(purchasingPowerLoss, true)}
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