"use client";

import { useState } from "react";

export default function PercentageCalculator() {
  const [amount, setAmount] = useState(1000);
  const [percent, setPercent] = useState(10);

  const result = (amount * percent) / 100;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧮 Percentage Calculator</h1>

      <div className="space-y-4">
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Percentage (%):</label>
          <input
            type="number"
            value={percent}
            onChange={(e) => setPercent(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p>
            <strong>Result:</strong> {percent}% of ₹{amount} = ₹{result.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
