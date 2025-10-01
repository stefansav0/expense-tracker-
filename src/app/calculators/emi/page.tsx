"use client";

import { useState, useMemo } from "react";
import { FaCalculator, FaRupeeSign, FaPercentage, FaClock, FaCalendarAlt, FaHandsHelping, FaLightbulb } from "react-icons/fa";
import { motion } from "framer-motion";

// --- Utility function for calculating EMI ---
const calculateEMI = (P: number, R_annual: number, N_years: number): number => {
  if (P <= 0 || R_annual < 0 || N_years <= 0) return 0;

  const r = (R_annual / 100) / 12;
  const n = N_years * 12;

  if (r === 0) {
    return P / n;
  }

  const powerFactor = Math.pow(1 + r, n);
  const emi = P * r * powerFactor / (powerFactor - 1);

  return emi;
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

// --- Component Start ---
export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const calculatedEmi = calculateEMI(loanAmount, interestRate, loanTenure);
    const totalPaymentAmount = calculatedEmi * loanTenure * 12;
    const interestAmount = totalPaymentAmount - loanAmount;

    return {
      emi: calculatedEmi,
      totalInterest: interestAmount > 0 ? interestAmount : 0,
      totalPayment: totalPaymentAmount > 0 ? totalPaymentAmount : loanAmount,
    };
  }, [loanAmount, interestRate, loanTenure]);

  return (
    // Main Container: Abstract Background with Radial Gradients and Shapes
    <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-8 overflow-hidden bg-gray-50 dark:bg-gray-950">

      {/* --- Abstract Background Layer (The new beautiful part) --- */}
      <div className="absolute inset-0 z-0 opacity-80 dark:opacity-60 pointer-events-none">
        {/* Large, soft purple radial gradient */}
        <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse-slow"></div>
        {/* Medium, dynamic indigo shape */}
        <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-15 animate-pulse-slow animation-delay-3000"></div>
        {/* Subtle light overlay for texture in light mode */}
        <div className="absolute inset-0 bg-white dark:bg-transparent opacity-10 dark:opacity-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #f0f4ff 1px, transparent 1px)' }}></div>
      </div>
      {/* -------------------------------------------------------- */}

      {/* Calculator Card: Brought to the foreground with motion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 transition-shadow duration-300 hover:shadow-indigo-500/50 dark:hover:shadow-indigo-500/30 border border-gray-100 dark:border-gray-700"
      >

        {/* Header/Title Component */}
        <CardTitle
          Icon={FaHandsHelping}
          title="Loan EMI Calculator"
          subtitle="Estimate your monthly commitment with ease."
        />

        {/* Input Controls */}
        <div className="space-y-8 mt-8">
          <InputControl
            label="Loan Amount (Principal)" unit="₹" value={loanAmount} min={100000} max={20000000} step={50000}
            onChange={setLoanAmount} Icon={FaRupeeSign} color="indigo" formatValue={formatCurrency}
          />
          <InputControl
            label="Annual Interest Rate" unit="%" value={interestRate} min={0.1} max={30} step={0.01}
            onChange={setInterestRate} Icon={FaPercentage} color="pink" formatValue={(val) => val.toFixed(2)}
          />
          <InputControl
            label="Loan Tenure" unit="Years" value={loanTenure} min={1} max={30} step={1}
            onChange={setLoanTenure} Icon={FaClock} color="teal" formatValue={(val) => `${val}`}
          />
        </div>

        {/* --- Results Section --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <FaLightbulb className="text-indigo-600 dark:text-indigo-400" /> Financial Insight
          </h2>

          {/* Result Card: Monthly EMI (Highlighted) */}
          <div className="p-5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl shadow-lg border-l-4 border-indigo-600 dark:border-indigo-400 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium uppercase">Your Estimated Monthly EMI</p>
            <p className="text-5xl font-extrabold text-indigo-700 dark:text-indigo-300 mt-2">
              {formatCurrency(emi, true)}
            </p>
          </div>

          {/* Result Grid: Total Payments and Interest */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <ResultItem label="Total Principal Amount" value={formatCurrency(loanAmount)} iconColor="text-green-500" />
            <ResultItem label="Total Interest Payable" value={formatCurrency(totalInterest)} iconColor="text-red-500" />
            <div className="col-span-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-lg shadow-inner">
              Overall Repayment: <span className="float-right text-indigo-600 dark:text-indigo-400">{formatCurrency(totalPayment)}</span>
            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* Custom Background Animation CSS */}
      <style jsx global>{`
                @keyframes pulse-slow {
                    0% { transform: scale(1); opacity: 0.15; }
                    50% { transform: scale(1.05); opacity: 0.25; }
                    100% { transform: scale(1); opacity: 0.15; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 15s infinite cubic-bezier(0.4, 0, 0.6, 1);
                }
                .animation-delay-3000 { animation-delay: 3s; }
            `}</style>
    </div>
  );
}

// ----------------------------------------------------------------------
// --- Sub-Components (Unchanged from the previous version) ---
// ----------------------------------------------------------------------

interface CardTitleProps {
  Icon: React.ElementType;
  title: string;
  subtitle: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ Icon, title, subtitle }) => (
  <header className="text-center pb-4">
    <div className="flex items-center justify-center text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 gap-3">
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
  color: 'indigo' | 'pink' | 'teal';
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