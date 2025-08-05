"use client";

import { useState } from "react";

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTenure, setLoanTenure] = useState(15);

  const emi =
    (loanAmount * (interestRate / 12 / 100) * Math.pow(1 + interestRate / 12 / 100, loanTenure * 12)) /
    (Math.pow(1 + interestRate / 12 / 100, loanTenure * 12) - 1);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">💸 EMI Calculator</h1>

      <div className="space-y-4">
        <div>
          <label>Loan Amount (₹):</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Interest Rate (%):</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Loan Tenure (Years):</label>
          <input
            type="number"
            value={loanTenure}
            onChange={(e) => setLoanTenure(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p><strong>Monthly EMI:</strong> ₹{emi.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
