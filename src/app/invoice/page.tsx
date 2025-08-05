"use client";

import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

  const handleItemChange = (index: number, field: "description" | "quantity" | "price", value: string | number) => {
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

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const gst = (subtotal * gstRate) / 100;
  const cgst = gst / 2;
  const sgst = gst / 2;
  const total = subtotal + gst;

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Invoice Generator (Full)</h1>

      {/* Logo Upload */}
      <div className="mb-4">
        <label className="font-medium">Upload Logo</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLogo)} />
        {logo && <img src={logo} alt="Logo" className="h-16 mt-2" />}
      </div>

      {/* UPI QR Upload */}
      <div className="mb-4">
        <label className="font-medium">Upload UPI QR Code</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setQrCode)} />
        {qrCode && <img src={qrCode} alt="QR Code" className="h-24 mt-2" />}
      </div>

      {/* Invoice Info */}
      <div className="flex gap-4 mb-6">
        <div>
          <label>Invoice No.</label>
          <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="p-2 border rounded w-full" />
        </div>
        <div>
          <label>Date</label>
          <input value={invoiceDate} disabled className="p-2 border rounded w-full bg-gray-100" />
        </div>
      </div>

      {/* Parties Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="font-semibold mb-2">Sender Info</h2>
          <input placeholder="Name" value={sender.name} onChange={(e) => setSender({ ...sender, name: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="Address" value={sender.address} onChange={(e) => setSender({ ...sender, address: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="GSTIN" value={sender.gstin} onChange={(e) => setSender({ ...sender, gstin: e.target.value })} className="w-full p-2 border rounded" />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Client Info</h2>
          <input placeholder="Name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="Email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="Address" value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input placeholder="GSTIN" value={client.gstin} onChange={(e) => setClient({ ...client, gstin: e.target.value })} className="w-full p-2 border rounded" />
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Description</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
              <th className="p-2">Total</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td className="p-2"><input className="w-full border p-1" value={item.description} onChange={(e) => handleItemChange(i, "description", e.target.value)} /></td>
                <td className="p-2"><input type="number" className="w-full border p-1" value={item.quantity} onChange={(e) => handleItemChange(i, "quantity", +e.target.value)} /></td>
                <td className="p-2"><input type="number" className="w-full border p-1" value={item.price} onChange={(e) => handleItemChange(i, "price", +e.target.value)} /></td>
                <td className="p-2">₹{(item.quantity * item.price).toFixed(2)}</td>
                <td className="p-2"><button onClick={() => removeItem(i)} className="text-red-600">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={addItem} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded">+ Add Item</button>

      {/* Totals */}
      <div className="text-right mb-6">
        <div className="space-y-1">
          <label>GST Rate (%)</label>
          <input type="number" value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="w-32 p-2 border rounded" />
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>CGST ({gstRate / 2}%): ₹{cgst.toFixed(2)}</p>
          <p>SGST ({gstRate / 2}%): ₹{sgst.toFixed(2)}</p>
          <p className="text-lg font-bold">Total: ₹{total.toFixed(2)}</p>
        </div>
      </div>

      {/* Bank Info */}
      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={showBankDetails} onChange={() => setShowBankDetails(!showBankDetails)} />
          <span className="font-semibold">Add Bank Details</span>
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
  className="bg-white text-black text-sm mx-auto p-10"
  style={{
    width: "210mm",
    minHeight: "297mm",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>

        {logo && <img src={logo} alt="Logo" className="h-16 mb-2" />}
        <h2 className="text-xl font-bold">Invoice</h2>
        <p><strong>No:</strong> {invoiceNumber} | <strong>Date:</strong> {invoiceDate}</p>
        <hr className="my-2" />
        <p><strong>From:</strong> {sender.name}, {sender.address}, GSTIN: {sender.gstin}</p>
        <p><strong>To:</strong> {client.name}, {client.address}, GSTIN: {client.gstin}</p>

        <table className="w-full border mt-4 text-xs">
          <thead>
            <tr>
              <th className="border px-2 py-1">Item</th>
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

        <div className="mt-4 space-y-1">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>CGST: ₹{cgst.toFixed(2)}</p>
          <p>SGST: ₹{sgst.toFixed(2)}</p>
          <p className="font-bold text-base">Total: ₹{total.toFixed(2)}</p>
        </div>

        {showBankDetails && (
          <div className="mt-6">
            <h4 className="font-semibold mb-1">Bank Details</h4>
            <p>{bank.accountName} | {bank.bankName} | A/C: {bank.accountNumber}</p>
            <p>IFSC: {bank.ifsc}, Branch: {bank.branch}</p>
          </div>
        )}

        {qrCode && (
          <div className="mt-6">
            <h4 className="font-semibold mb-1">Scan UPI QR to Pay</h4>
            <img src={qrCode} alt="UPI QR" className="h-24" />
          </div>
        )}

        <div className="mt-8 text-right">
          <p>Authorized Signature</p>
          <div className="border-t mt-4 w-40 ml-auto"></div>
        </div>
      </div>

      <button onClick={downloadPDF} className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Download Invoice PDF
      </button>
    </div>
  );
}
