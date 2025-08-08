"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  total: number;
}

export default function InvoiceDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(collection(db, "users", user.uid, "invoices"));
      const fetched: Invoice[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          invoiceNumber: data.invoiceNumber,
          invoiceDate: data.invoiceDate,
          total: data.total,
        };
      });
      setInvoices(fetched);
      setLoading(false);
    };

    fetchInvoices();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading invoices...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Invoices</h1>
        <Link href="/invoice/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Invoice
          </button>
        </Link>
      </div>

      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Invoice No.</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="p-2 border">{inv.invoiceNumber}</td>
                <td className="p-2 border">{inv.invoiceDate}</td>
                <td className="p-2 border">₹{inv.total.toFixed(2)}</td>
                <td className="p-2 border">
                  <Link href={`/invoice/view/${inv.id}`}>
                    <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
