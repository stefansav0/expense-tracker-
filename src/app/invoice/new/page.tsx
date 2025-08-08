"use client";

import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { auth, db } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function InvoicePage() {
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]);
  const [client, setClient] = useState({ name: "", email: "", address: "", gstin: "" });
  const [sender, setSender] = useState({ name: "", address: "", gstin: "" });
  const [gstRate, setGstRate] = useState(18);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [invoiceDate] = useState(new Date().toLocaleDateString());
  const [invoiceNumber, setInvoiceNumber] = useState("INV-" + Date.now());

  const [logo, setLogo] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const [bank, setBank] = useState({
    accountName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    branch: "",
  });

  const invoiceRef = useRef<HTMLDivElement>(null);

  // Totals
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const gst = (subtotal * gstRate) / 100;
  const cgst = gst / 2;
  const sgst = gst / 2;
  const total = subtotal + gst;

  const handleItemChange = (
    index: number,
    field: "description" | "quantity" | "price",
    value: string | number
  ) => {
    const updated = [...items];
    updated[index][field] = value as never;
    setItems(updated);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, price: 0 }]);
  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const saveInvoiceToFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to save invoice.");
      return;
    }

    const invoiceData = {
      invoiceNumber,
      invoiceDate,
      sender,
      client,
      items,
      gstRate,
      subtotal,
      cgst,
      sgst,
      total,
      bankDetails: showBankDetails ? bank : null,
      logo,
      qrCode,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "users", user.uid, "invoices"), invoiceData);
      console.log("Invoice saved successfully!");
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice.");
    }
  };

  const downloadPDF = async () => {
    try {
      await saveInvoiceToFirestore(); // Save before download

      if (!invoiceRef.current) return;
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNumber}.pdf`);

      alert("Invoice saved and downloaded successfully!");
    } catch (error) {
      console.error("Error during PDF generation or saving:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center">Professional Invoice Generator</h1>

      {/* Uploads */}
      <div className="mb-6">
        <label className="block font-semibold">Upload Logo</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLogo)} />
        {logo && <img src={logo} alt="Logo" className="h-16 mt-2" />}
      </div>

      <div className="mb-6">
        <label className="block font-semibold">Upload UPI QR Code</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setQrCode)} />
        {qrCode && <img src={qrCode} alt="QR Code" className="h-24 mt-2" />}
      </div>

      {/* Invoice Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-medium mb-1">Invoice No.</label>
          <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="p-2 border rounded w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input value={invoiceDate} disabled className="p-2 border rounded w-full bg-gray-100" />
        </div>
      </div>

      {/* Sender & Client */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Sender Information</h2>
          <input placeholder="Name" value={sender.name} onChange={(e) => setSender({ ...sender, name: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="Address" value={sender.address} onChange={(e) => setSender({ ...sender, address: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="GSTIN" value={sender.gstin} onChange={(e) => setSender({ ...sender, gstin: e.target.value })} className="w-full p-2 border rounded" />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Client Information</h2>
          <input placeholder="Name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="Email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="Address" value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="GSTIN" value={client.gstin} onChange={(e) => setClient({ ...client, gstin: e.target.value })} className="w-full p-2 border rounded" />
        </div>
      </div>

      {/* Items */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td className="border p-2"><input className="w-full border p-1" value={item.description} onChange={(e) => handleItemChange(i, "description", e.target.value)} /></td>
                <td className="border p-2"><input type="number" className="w-full border p-1" value={item.quantity} onChange={(e) => handleItemChange(i, "quantity", +e.target.value)} /></td>
                <td className="border p-2"><input type="number" className="w-full border p-1" value={item.price} onChange={(e) => handleItemChange(i, "price", +e.target.value)} /></td>
                <td className="border p-2">₹{(item.quantity * item.price).toFixed(2)}</td>
                <td className="border p-2 text-center"><button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addItem} className="mb-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Item</button>

      {/* Totals */}
      <div className="text-right mb-8 space-y-1">
        <div>
          <label className="mr-2 font-medium">GST Rate (%)</label>
          <input type="number" value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="w-24 p-2 border rounded" />
        </div>
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>CGST ({gstRate / 2}%): ₹{cgst.toFixed(2)}</p>
        <p>SGST ({gstRate / 2}%): ₹{sgst.toFixed(2)}</p>
        <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
      </div>

      {/* Bank Info */}
      <div className="mb-6">
        <label className="flex items-center gap-2 font-semibold">
          <input type="checkbox" checked={showBankDetails} onChange={() => setShowBankDetails(!showBankDetails)} />
          Add Bank Details
        </label>
        {showBankDetails && (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <input placeholder="Account Name" value={bank.accountName} onChange={(e) => setBank({ ...bank, accountName: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Bank Name" value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Account Number" value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} className="p-2 border rounded" />
            <input placeholder="IFSC" value={bank.ifsc} onChange={(e) => setBank({ ...bank, ifsc: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Branch" value={bank.branch} onChange={(e) => setBank({ ...bank, branch: e.target.value })} className="p-2 border rounded" />
          </div>
        )}
      </div>

      {/* Invoice Preview for PDF */}
      <div
        ref={invoiceRef}
        className="bg-white text-black text-sm mx-auto p-10 border shadow-lg"
        style={{
          width: "210mm",
          minHeight: "297mm",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {logo && <img src={logo} alt="Logo" className="h-16 mb-4" />}
        <h2 className="text-xl font-bold mb-2">Invoice</h2>
        <p><strong>Invoice No:</strong> {invoiceNumber} | <strong>Date:</strong> {invoiceDate}</p>
        <hr className="my-2" />
        <p><strong>From:</strong> {sender.name}, {sender.address}, GSTIN: {sender.gstin}</p>
        <p><strong>To:</strong> {client.name}, {client.address}, GSTIN: {client.gstin}</p>

        <table className="w-full border mt-4 text-xs">
          <thead>
            <tr>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{item.description}</td>
                <td className="border px-2 py-1">{item.quantity}</td>
                <td className="border px-2 py-1">₹{item.price}</td>
                <td className="border px-2 py-1">₹{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 space-y-1 text-sm">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>CGST: ₹{cgst.toFixed(2)}</p>
          <p>SGST: ₹{sgst.toFixed(2)}</p>
          <p className="font-bold text-base">Total: ₹{total.toFixed(2)}</p>
        </div>

        {showBankDetails && (
          <div className="mt-6 text-sm">
            <h4 className="font-semibold mb-1">Bank Details</h4>
            <p>{bank.accountName} | {bank.bankName}</p>
            <p>A/C: {bank.accountNumber} | IFSC: {bank.ifsc} | Branch: {bank.branch}</p>
          </div>
        )}

        {qrCode && (
          <div className="mt-6">
            <h4 className="font-semibold mb-1">Scan to Pay via UPI</h4>
            <img src={qrCode} alt="UPI QR Code" className="h-24" />
          </div>
        )}

        <div className="mt-8 text-right">
          <p>Authorized Signature</p>
          <div className="border-t mt-4 w-40 ml-auto"></div>
        </div>
      </div>

      {/* ✅ Replace the download button at the bottom */}
      <button
        onClick={downloadPDF}
        className="mt-10 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save & Download PDF
      </button>
    </div>
  );
}
