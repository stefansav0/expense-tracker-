"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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
import {
  FiDownload,
  FiTrash2,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiBriefcase,
} from 'react-icons/fi';

// TYPES
type TransactionType = "income" | "expense";

type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  createdAt: Date;
};

// COMPONENT START
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState("This Month");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  // --- Dark Mode Detection Effect (For chart compatibility) ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

      setIsDarkMode(mediaQuery.matches);
      mediaQuery.addEventListener('change', listener);

      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // --- Data Fetching and Initialization ---
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
          description: d.description || "",
          createdAt: d.createdAt?.toDate?.() || new Date(),
        } as Transaction;
      });
      setTransactions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, router]);

  // --- Filtering and Sorting Logic ---
  useEffect(() => {
    let data = [...transactions];
    const now = dayjs();

    // Filtering
    if (filterType === "This Week") {
      data = data.filter((t) => dayjs(t.createdAt).isAfter(now.startOf("week").subtract(1, 'second')));
    } else if (filterType === "This Month") {
      data = data.filter((t) => dayjs(t.createdAt).isAfter(now.startOf("month").subtract(1, 'second')));
    } else if (filterType === "Last 30 Days") {
      data = data.filter((t) => dayjs(t.createdAt).isAfter(now.subtract(30, 'days')));
    } else if (filterType === "Custom" && customRange.from && customRange.to) {
      const from = dayjs(customRange.from);
      const to = dayjs(customRange.to).endOf("day");
      data = data.filter(
        (t) => dayjs(t.createdAt).isAfter(from.subtract(1, 'second')) && dayjs(t.createdAt).isBefore(to.add(1, 'second'))
      );
    }

    // Sorting by date
    data.sort((a, b) =>
      sortOrder === "asc"
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime()
    );

    setFiltered(data);
  }, [transactions, filterType, customRange, sortOrder]);


  // --- Firebase CRUD Operations (Delete) ---
  const deleteTrx = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (error) {
      console.error("Error deleting transaction: ", error);
    }
  };

  // --- Data Aggregation for Summary and Charts ---
  const { totalIncome, totalExpense, chartData, lineData } = useMemo(() => {
    const totalIncome = filtered
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filtered
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Group by Category (for Bar Chart - Expenses only)
    const groupByCategory = filtered.reduce((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(groupByCategory).map(([category, amount]) => ({
      category,
      amount,
    })).sort((a, b) => b.amount - a.amount);

    // Time Series (for Line Chart - Daily Balance Flow)
    const timeSeries = filtered.reduce((acc, t) => {
      const dateKey = dayjs(t.createdAt).format("YYYY-MM-DD");
      // Aggregate by date: Income is positive, Expense is negative
      const amt = t.type === "expense" ? -t.amount : t.amount;
      acc[dateKey] = (acc[dateKey] || 0) + amt;
      return acc;
    }, {} as Record<string, number>);

    // Cumulative Balance Calculation for Line Chart
    const sortedDates = Object.keys(timeSeries).sort((a, b) => dayjs(a).unix() - dayjs(b).unix());
    let runningBalance = 0;
    const lineData = sortedDates.map(date => {
      runningBalance += timeSeries[date];
      return {
        date: dayjs(date).format('MMM D'),
        balance: runningBalance,
      };
    });

    return { totalIncome, totalExpense, chartData, lineData };
  }, [filtered]);

  // --- Chart Color Configuration ---
  const CHART_STROKE_COLOR = isDarkMode ? "#9ca3af" : "#1f2937";
  const GRID_STROKE_COLOR = isDarkMode ? "#4b5563" : "#e5e7eb";

  if (!user) return <p className="p-6 text-gray-700 dark:text-gray-300">Authenticating user...</p>;
  if (loading) return <p className="p-6 text-gray-700 dark:text-gray-300">Loading transactions...</p>;

  // --- Component JSX ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10 text-gray-900 dark:text-gray-100">

      {/* Header & Quick Actions */}
      <div className="sticky top-0 z-10 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 bg-white dark:bg-gray-800 shadow-xl gap-4">
        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <FiCreditCard className="w-7 h-7" />
          Finance Tracker
        </h1>
        <div className="flex items-center gap-3">

          {/* ACTION: Link to Add Income Page */}
          <button
            onClick={() => router.push("/income")}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-150 shadow-md text-sm font-semibold transform hover:scale-[1.02]"
          >
            <FiBriefcase className="w-5 h-5 mr-2" />
            Add Income
          </button>

          {/* ACTION: Link to Add Expense Page */}
          <button
            onClick={() => router.push("/expense")}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-150 shadow-md text-sm font-semibold transform hover:scale-[1.02]"
          >
            <FiCreditCard className="w-5 h-5 mr-2" />
            Add Expense
          </button>

          <button
            onClick={() => exportToPDF(filtered)}
            className="flex items-center bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150 text-sm font-semibold"
            title="Export to PDF"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* --- Filters and Controls --- */}
      <div className="px-4 sm:px-8 py-4 flex flex-wrap gap-4 items-center bg-gray-100 dark:bg-gray-800/50 shadow-sm border-b dark:border-gray-700">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Period:</label>
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCustomRange({ from: "", to: "" });
          }}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>Last 30 Days</option>
          <option>Custom</option>
        </select>

        {filterType === "Custom" && (
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="date"
              value={customRange.from}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 rounded-lg text-sm transition-colors"
            />
            <span className="text-gray-500 dark:text-gray-400 font-bold">to</span>
            <input
              type="date"
              value={customRange.to}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 rounded-lg text-sm transition-colors"
            />
          </div>
        )}

        <label className="text-sm font-medium ml-auto text-gray-700 dark:text-gray-300">Sort By Date:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* --- Summary Cards --- */}
      <div className="px-4 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl transition-shadow duration-300 hover:shadow-2xl`}>
          <div className="flex justify-between items-center border-b pb-2 mb-2 border-green-200 dark:border-green-800">
            <span className="text-lg font-bold text-gray-500 dark:text-gray-400">Total Income</span>
            <FiTrendingUp className="w-7 h-7 text-green-500" />
          </div>
          <p className="text-4xl font-extrabold mt-1 text-green-600 dark:text-green-400">
            ₹{totalIncome.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Expense Card */}
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl transition-shadow duration-300 hover:shadow-2xl`}>
          <div className="flex justify-between items-center border-b pb-2 mb-2 border-red-200 dark:border-red-800">
            <span className="text-lg font-bold text-gray-500 dark:text-gray-400">Total Expense</span>
            <FiTrendingDown className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-4xl font-extrabold mt-1 text-red-600 dark:text-red-400">
            ₹{totalExpense.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Balance Card */}
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl transition-shadow duration-300 hover:shadow-2xl`}>
          <div className="flex justify-between items-center border-b pb-2 mb-2 border-indigo-200 dark:border-indigo-800">
            <span className="text-lg font-bold text-gray-500 dark:text-gray-400">Net Balance</span>
            <FiDollarSign className="w-7 h-7 text-indigo-500" />
          </div>
          <p className="text-4xl font-extrabold mt-1 text-indigo-600 dark:text-indigo-400">
            ₹{(totalIncome - totalExpense).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* --- Charts Section ---
        (Logic is kept to display aggregated data) 
      */}
      <div className="px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Category Breakdown (Expenses) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700">Expense Breakdown by Category</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE_COLOR} />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} stroke={CHART_STROKE_COLOR} tick={{ fontSize: 12 }} />
                <YAxis stroke={CHART_STROKE_COLOR} tickFormatter={(value) => `₹${Math.floor(value / 1000)}k`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 h-[300px] flex items-center justify-center">
              <p>No expense data for this period to show the breakdown.</p>
            </div>
          )}
        </div>

        {/* Date-wise Flow (Cumulative Balance) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700">Cumulative Balance Over Time</h2>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE_COLOR} />
                <XAxis dataKey="date" stroke={CHART_STROKE_COLOR} tick={{ fontSize: 12 }} />
                <YAxis stroke={CHART_STROKE_COLOR} tickFormatter={(value) => `₹${Math.floor(value / 1000)}k`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Balance']} />
                <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 h-[300px] flex items-center justify-center">
              <p>No balance flow data for this period to plot.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Transactions List --- */}
      <div className="px-4 sm:px-8 py-6 bg-white dark:bg-gray-800 mt-6 rounded-xl shadow-xl mx-4 sm:mx-8 transition-shadow duration-300 hover:shadow-2xl">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700">Recent Transactions ({filtered.length})</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left rounded-tl-lg">Date</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="p-3 text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                      {dayjs(t.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="p-3 max-w-xs truncate">{t.description || 'No description'}</td>
                    <td className="p-3 font-medium text-gray-700 dark:text-gray-200">{t.category}</td>
                    <td className={`p-3 font-mono text-lg font-semibold text-right ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => deleteTrx(t.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900 transition"
                        title="Delete Transaction"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500">
                    No transactions found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}