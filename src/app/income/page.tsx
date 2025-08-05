"use client";

import { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import { FaCheckCircle } from "react-icons/fa";

export default function IncomePage() {
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = () => {
    setSuccessMessage("Income added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Add Income
        </h1>

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-4 py-2 rounded shadow animate-fade-in">
            <FaCheckCircle />
            <span>{successMessage}</span>
          </div>
        )}

        <TransactionForm type="income" onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
