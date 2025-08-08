"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { auth, db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ViewInvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const user = auth.currentUser;
      if (!user || !id) return;

      const ref = doc(db, "users", user.uid, "invoices", id as string);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        setInvoice(snapshot.data());
      }

      setLoading(false);
    };

    fetchInvoice();
  }, [id]);

  const downloadPDF = async () => {
    try {
      if (!pdfRef.current) return;

      const clone = pdfRef.current.cloneNode(true) as HTMLElement;
      clone.style.backgroundColor = "#ffffff";
      clone.style.color = "#000000";

      const allElements = clone.querySelectorAll<HTMLElement>("*");
      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bg = style.backgroundColor;

        if (color.startsWith("lab(") || color === "") el.style.color = "#000";
        if (bg.startsWith("lab(") || bg === "") el.style.backgroundColor = "#fff";
      });

      const hiddenDiv = document.createElement("div");
      hiddenDiv.style.position = "fixed";
      hiddenDiv.style.top = "-9999px";
      hiddenDiv.style.left = "-9999px";
      hiddenDiv.style.zIndex = "-1";
      hiddenDiv.appendChild(clone);
      document.body.appendChild(hiddenDiv);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(hiddenDiv);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoice.invoiceNumber || "download"}.pdf`);

      alert("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Something went wrong.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading invoice...</p>;
  if (!invoice) return <p className="text-center mt-10">Invoice not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>

        {/* PDF download button hidden for now */}
        {/* <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button> */}
      </div>

      <div ref={pdfRef} className="bg-white p-6 rounded border shadow">
        <h2 className="text-xl font-semibold mb-4">
          Invoice #{invoice.invoiceNumber}
        </h2>
        <p><strong>Date:</strong> {invoice.invoiceDate}</p>
        <p><strong>Client:</strong> {invoice.client?.name}</p>
        <p><strong>Email:</strong> {invoice.client?.email}</p>
        <p><strong>Phone:</strong> {invoice.client?.phone}</p>
        <p><strong>Address:</strong> {invoice.client?.address}</p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Items</h3>
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Description</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item: any, idx: number) => (
              <tr key={idx}>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2">₹{item.price}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right">
          <p><strong>Subtotal:</strong> ₹{invoice.subtotal?.toFixed(2)}</p>
          <p><strong>Tax:</strong> ₹{invoice.tax?.toFixed(2)}</p>
          <p className="text-xl font-bold"><strong>Total:</strong> ₹{invoice.total?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
