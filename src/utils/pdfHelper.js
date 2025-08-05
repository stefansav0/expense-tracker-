import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToPDF = (transactions = []) => {
  const doc = new jsPDF();
  doc.text("Transaction Report", 14, 10);
  const tableData = transactions.map(t => [
    new Date(t.createdAt.seconds * 1000).toLocaleDateString(),
    t.type,
    t.category,
    t.amount,
  ]);
  doc.autoTable({
    head: [["Date", "Type", "Category", "Amount"]],
    body: tableData,
  });
  doc.save("transactions.pdf");
};
