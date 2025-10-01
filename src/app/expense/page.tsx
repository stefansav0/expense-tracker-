"use client";

import TransactionForm from "@/components/TransactionForm";
import { useState } from "react";
import { FaCheckCircle, FaMinusCircle } from "react-icons/fa"; // Using FaMinusCircle for expense theme
import { motion, AnimatePresence } from "framer-motion"; // For advanced animations

export default function ExpensePage() {
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = () => {
    setSuccessMessage("Expense added successfully!");
    // Clear the message after 4 seconds (4000ms) for better readability
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    // Outer Container: Full viewport height, complex background gradient, dark mode enabled
    <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-8 overflow-hidden">
      {/* Background Gradients/Blobs - for dynamic, modern feel */}
      <div className="absolute inset-0 z-0 opacity-70 dark:opacity-50">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob dark:bg-purple-700"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 dark:bg-pink-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 dark:bg-blue-700"></div>
      </div>
      {/* Fallback background if blobs are too much or for older browsers */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 z-[-1]"></div>

      {/* Main Card Container: Glassmorphism/Frosted Glass effect */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg bg-white bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-3xl border border-gray-200 dark:border-gray-600 shadow-custom-xl p-8 sm:p-10 transition-all duration-500 transform hover:shadow-custom-xxl"
      >
        {/* Header Section with Icon */}
        <header className="mb-8 border-b border-gray-300 dark:border-gray-600 pb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-4 text-red-500 dark:text-red-400"
          >
            <FaMinusCircle className="w-9 h-9 sm:w-12 sm:h-12 drop-shadow-md" /> {/* Larger, more prominent icon */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tight leading-tight">
              Add Expense
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center text-md mt-3 text-gray-600 dark:text-gray-300 font-medium"
          >
            Log your spending to maintain financial control.
          </motion.p>
        </header>

        {/* Success Message Alert */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-6 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-800/50 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-200 rounded-xl shadow-md"
            >
              <FaCheckCircle className="w-5 h-5 flex-shrink-0 text-green-500 dark:text-green-300" />
              <span className="font-semibold text-sm sm:text-base">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction Form Component */}
        <TransactionForm type="expense" onSuccess={handleSuccess} />
      </motion.div>

      {/* Custom Tailwind CSS for animations and shadows */}
      <style jsx global>{`
        /* Custom shadows for better depth */
        .shadow-custom-xl {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        .dark .shadow-custom-xl {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .hover\\:shadow-custom-xxl:hover {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        .dark .hover\\:shadow-custom-xxl:hover {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35), 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        /* Blob background animation */
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.6, -0.28, 0.735, 0.045);
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}