"use client";

import { useState } from "react";

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const interest = (principal * rate * years) / 100;
  const maturityAmount = principal + interest;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">💰 FD Calculator</h1>

      <div className="space-y-4">
        <div>
          <label>Principal Amount (₹):</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Interest Rate (%):</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Tenure (Years):</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p><strong>Total Interest:</strong> ₹{interest.toFixed(2)}</p>
          <p><strong>Maturity Amount:</strong> ₹{maturityAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
