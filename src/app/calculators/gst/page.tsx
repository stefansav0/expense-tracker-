"use client";

import { useState } from "react";

export default function GSTCalculator() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);

  const gstAmount = (amount * gstRate) / 100;
  const totalAmount = amount + gstAmount;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 GST Calculator</h1>

      <div className="space-y-4">
        <div>
          <label>Amount (₹):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>GST Rate (%):</label>
          <input
            type="number"
            value={gstRate}
            onChange={(e) => setGstRate(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p><strong>GST Amount:</strong> ₹{gstAmount.toFixed(2)}</p>
          <p><strong>Total Amount (with GST):</strong> ₹{totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
