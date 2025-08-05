"use client";

import { useState } from "react";

export default function GoalCalculator() {
  const [goalAmount, setGoalAmount] = useState(100000);
  const [monthlySavings, setMonthlySavings] = useState(5000);
  const [interestRate, setInterestRate] = useState(7);

  const monthsRequired = Math.ceil(goalAmount / (monthlySavings * (1 + interestRate / 100)));

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎯 Goal-based Savings Calculator</h1>

      <div className="space-y-4">
        <div>
          <label>Goal Amount (₹):</label>
          <input
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Monthly Savings (₹):</label>
          <input
            type="number"
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Expected Annual Return (%):</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p><strong>Months Required:</strong> {monthsRequired}</p>
        </div>
      </div>
    </div>
  );
}
