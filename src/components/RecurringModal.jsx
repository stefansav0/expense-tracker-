"use client";
import { useState } from "react";

export default function RecurringModal({ addRecurring }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [interval, setInterval] = useState("daily");

  const handleAdd = () => {
    addRecurring({ amount, category, interval });
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded">Add Recurring</button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4">Add Recurring</h2>
            <input placeholder="Amount" type="number" className="w-full mb-2 px-3 py-2 border rounded"
              value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input placeholder="Category" className="w-full mb-2 px-3 py-2 border rounded"
              value={category} onChange={(e) => setCategory(e.target.value)} />
            <select value={interval} onChange={(e) => setInterval(e.target.value)} className="w-full mb-4 px-3 py-2 border rounded">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Save</button>
          </div>
        </div>
      )}
    </>
  );
}
