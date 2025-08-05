"use client";

import { useState } from "react";

export default function InflationCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8);
  const [inflationRate, setInflationRate] = useState(3);

  const adjustedAmount = amount * Math.pow(1 + (rate - inflationRate) / 100, 5);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📉 Inflation Adjusted Return</h1>

      <div className="space-y-4">
        <div>
          <label>Investment Amount (₹):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Annual Return Rate (%):</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Inflation Rate (%):</label>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p><strong>Inflation Adjusted Return:</strong> ₹{adjustedAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
