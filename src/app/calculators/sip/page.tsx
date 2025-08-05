"use client";

import { useState } from "react";

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(1000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);

  const months = years * 12;
  const monthlyRate = rate / 12 / 100;
  const maturityAmount =
    monthly *
    ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate)) /
    monthlyRate;
  const totalInvested = monthly * months;
  const gain = maturityAmount - totalInvested;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📈 SIP Calculator</h1>

      <div className="space-y-4">
        <div>
          <label>Monthly Investment (₹):</label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Expected Annual Return (%):</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Investment Duration (Years):</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p><strong>Total Invested:</strong> ₹{totalInvested.toFixed(2)}</p>
          <p><strong>Estimated Returns:</strong> ₹{gain.toFixed(2)}</p>
          <p><strong>Maturity Amount:</strong> ₹{maturityAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
