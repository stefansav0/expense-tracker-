"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { FaDollarSign, FaTag, FaRegCalendarAlt, FaSpinner, FaPlus, FaMinus } from "react-icons/fa";

// --- CATEGORIES (Moved outside component for stability) ---
const incomeCategories = [
  "Salary",
  "Business",
  "Investments",
  "Bonus",
  "Others",
];

const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Travel",
  "Health",
  "Uber",
  "Grocery",
  "Bike Repair",
  "Bank Maintenance",
  "Internet",
  "Recharges",
  "Subscriptions",
  "Friends",
  "Family",
  "Investment",
  "Petrol",
  "House Rent",
  "Electricity",
  "Water Bills",
  "Credit Card Bill",
  "Others",
];

// --- COMPONENT PROPS ---
export default function TransactionForm({
  type,
  onSuccess,
}: {
  type: "income" | "expense";
  onSuccess?: () => void;
}) {
  const isIncome = type === "income";
  const categories = isIncome ? incomeCategories : expenseCategories;

  // --- STATE VARIABLES ---
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Set default category on initial load or type change
  useEffect(() => {
    // Set the first category as default when component mounts
    if (categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- HANDLER FUNCTIONS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to add transactions.");
      return;
    }
    if (!amount || !category || !date) {
      setError("Please fill in all the required fields.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setLoading(true);
    setStatus("Adding...");

    try {
      // Note: Use 'T00:00:00' to ensure date is correctly parsed as local day start
      const parsedDate = new Date(`${date}T00:00:00`);

      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        amount: parsedAmount,
        category,
        type,
        date: parsedDate,
        createdAt: serverTimestamp(),
      });

      // Reset Form State
      setAmount("");
      setDate("");
      // Keep the current category selected for quick entry
      setStatus("✅ Added!");

      if (onSuccess) onSuccess();

      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Error adding transaction:", err);
      setStatus("❌ Error!");
      setError(`Failed to add ${type}. Please check your connection.`);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  const accentColor = isIncome ? 'green' : 'red';
  const accentHex = isIncome ? '#10B981' : '#EF4444'; // Tailwind green-500/red-500

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dynamic Status/Error Message Area */}
      {error && (
        <div className="mb-4 text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300 px-4 py-3 rounded-xl border border-red-300 dark:border-red-700 font-medium transition-opacity duration-300">
          {error}
        </div>
      )}
      {status && !error && (
        <p
          className={`text-center text-sm font-medium p-2 rounded-lg ${status.includes("✅")
            ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/40"
            : status.includes("❌")
              ? "text-red-500 dark:text-red-400"
              : "text-gray-500 dark:text-gray-300"
            }`}
        >
          {status}
        </p>
      )}


      {/* Category Select (Styled with Icon) */}
      <div className="relative">
        <label htmlFor="category" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
        <div className={`relative flex items-center border border-gray-300 dark:border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-${accentColor}-500 transition-all duration-200 shadow-sm`}>
          <FaTag className="absolute left-4 text-gray-400 dark:text-gray-500" />
          <select
            id="category"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setError(null); }}
            required
            className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-70 rounded-xl text-gray-900 dark:text-white outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled className="dark:bg-gray-800">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="dark:bg-gray-800 dark:text-white">{cat}</option>
            ))}
          </select>
          {/* Custom dropdown arrow for better look */}
          <div className="absolute right-4 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Amount Input (Styled with Icon) */}
      <div className="relative">
        <label htmlFor="amount" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Amount (₹)</label>
        <div className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-${accentColor}-500 transition-all duration-200 shadow-sm`}>
          <FaDollarSign className="absolute left-4 text-gray-400 dark:text-gray-500" />
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(null); }}
            required
            min="0.01"
            step="0.01"
            className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-70 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none appearance-none"
          />
        </div>
      </div>

      {/* Date Input (Styled with Icon) */}
      <div className="relative">
        <label htmlFor="date" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Date</label>
        <div className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-${accentColor}-500 transition-all duration-200 shadow-sm`}>
          <FaRegCalendarAlt className="absolute left-4 text-gray-400 dark:text-gray-500" />
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setError(null); }}
            required
            className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-70 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
      </div>

      {/* Submit Button (Themed and Animated) */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center py-3 px-8 rounded-full font-bold transition duration-300 transform hover:scale-[1.01] shadow-lg mt-8
          ${loading
            ? 'bg-gray-400 text-white cursor-not-allowed shadow-none'
            : isIncome
              ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-green-500/50'
              : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-red-500/50'
          }
          disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none`
        }
      >
        {loading ? (
          <span className="flex items-center">
            <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Saving...
          </span>
        ) : (
          <>
            {isIncome ? <FaPlus className="w-4 h-4 mr-2" /> : <FaMinus className="w-4 h-4 mr-2" />}
            {isIncome ? 'Add Income' : 'Add Expense'}
          </>
        )}
      </button>
    </form>
  );
}