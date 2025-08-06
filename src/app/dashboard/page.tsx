"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { exportToPDF } from "@/utils/pdfExport";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  createdAt: Date;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState("This Month");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          type: d.type,
          amount: Number(d.amount || 0),
          category: d.category || "Uncategorized",
          createdAt: d.createdAt?.toDate?.() || new Date(),
        } as Transaction;
      });
      setTransactions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    let data = [...transactions];
    const now = dayjs();

    if (filterType === "This Week") {
      data = data.filter((t) => dayjs(t.createdAt).isAfter(now.startOf("week")));
    } else if (filterType === "This Month") {
      data = data.filter((t) => dayjs(t.createdAt).isAfter(now.startOf("month")));
    } else if (filterType === "Custom" && customRange.from && customRange.to) {
      const from = dayjs(customRange.from);
      const to = dayjs(customRange.to).endOf("day");
      data = data.filter(
        (t) => dayjs(t.createdAt).isAfter(from) && dayjs(t.createdAt).isBefore(to)
      );
    }

    data.sort((a, b) =>
      sortOrder === "asc"
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime()
    );

    setFiltered(data);
  }, [transactions, filterType, customRange, sortOrder]);

  const deleteTrx = async (id: string) => {
    await deleteDoc(doc(db, "transactions", id));
  };

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const groupByCategory = filtered.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(groupByCategory).map(([category, amount]) => ({
    category,
    amount,
  }));

  const timeSeries = filtered.reduce((acc, t) => {
    const dateKey = dayjs(t.createdAt).format("YYYY-MM-DD");
    const amt = t.type === "expense" ? -t.amount : t.amount;
    acc[dateKey] = (acc[dateKey] || 0) + amt;
    return acc;
  }, {} as Record<string, number>);

  const lineData = Object.entries(timeSeries)
    .sort(([a], [b]) => dayjs(a).unix() - dayjs(b).unix())
    .map(([date, amount]) => ({ date, amount }));

  if (!user) return <p className="p-6">Loading user...</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 bg-white dark:bg-gray-800 shadow gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Expense Tracker
        </h1>
        <button
          onClick={() => exportToPDF(filtered)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Download PDF
        </button>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 py-4 flex flex-wrap gap-3 items-center bg-white dark:bg-gray-800 shadow-sm">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>Custom</option>
        </select>

        {filterType === "Custom" && (
          <>
            <input
              type="date"
              value={customRange.from}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="border p-2 rounded text-sm"
            />
            <input
              type="date"
              value={customRange.to}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="border p-2 rounded text-sm"
            />
          </>
        )}

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>

      {/* Summary */}
      <div className="px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow font-semibold text-center">
          Income: ₹{totalIncome}
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow font-semibold text-center">
          Expense: ₹{totalExpense}
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow font-semibold text-center">
          Balance: ₹{totalIncome - totalExpense}
        </div>
      </div>

      {/* Charts */}
      <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-bold mb-2">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-bold mb-2">Date-wise Flow</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4 sm:px-6 py-6 bg-white dark:bg-gray-800 mt-6 rounded shadow overflow-auto">
        <h2 className="font-semibold mb-3">All Transactions</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-2">{dayjs(t.createdAt).format("YYYY-MM-DD")}</td>
                    <td className="p-2 capitalize">{t.type}</td>
                    <td className="p-2">{t.category}</td>
                    <td className="p-2">₹{t.amount}</td>
                    <td className="p-2">
                      <button
                        onClick={() => deleteTrx(t.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-2 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
