"use client";

import { useState } from "react";
import { db } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

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

export default function TransactionForm({
  type,
  onSuccess,
}: {
  type: "income" | "expense";
  onSuccess?: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !amount || !category || !date) {
      alert("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    setStatus("Adding...");

    try {
      const parsedAmount = parseFloat(amount);
      const parsedDate = new Date(`${date}T00:00:00`);

      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        amount: parsedAmount,
        category,
        type,
        date: parsedDate,
        createdAt: serverTimestamp(),
      });

      setAmount("");
      setCategory("");
      setDate("");
      setStatus("✅ Added!");

      if (onSuccess) onSuccess();

      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Error adding transaction:", err);
      setStatus("❌ Error!");
    } finally {
      setLoading(false);
    }
  };

  const categories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl space-y-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
        {type === "income" ? "💰 Add Income" : "💸 Add Expense"}
      </h2>

      {/* Category */}
      <div>
        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Amount (₹)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded font-semibold transition duration-200 ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {status || `Add ${type}`}
      </button>

      {/* Optional Success/Error Message */}
      {status && (
        <p
          className={`text-center text-sm font-medium ${
            status.includes("✅")
              ? "text-green-600 dark:text-green-400"
              : status.includes("❌")
              ? "text-red-500 dark:text-red-400"
              : "text-gray-500 dark:text-gray-300"
          }`}
        >
          {status}
        </p>
      )}
    </form>
  );
}
