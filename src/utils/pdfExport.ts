import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';

export async function exportToPDF(transactions: any[]) {
  const doc = new jsPDF();
  const today = dayjs().format('MMMM DD, YYYY');
  const month = dayjs().format('MMMM YYYY');

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const balance = income - expense;

  // Optional: Load header image
  const img = new Image();
  img.src = '/images/invoice-header.png'; // Ensure this is in /public/images

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/png');

      // Add header image
      doc.addImage(imgData, 'PNG', 14, 10, 180, 30);
      doc.setFontSize(18);
      doc.text('Expense Tracker', 14, 45);
      doc.setFontSize(12);
      doc.text(`Statement Month: ${month}`, 14, 53);
      doc.text(`Generated On: ${today}`, 14, 59);

      // Summary
      doc.setFontSize(12);
      doc.text(`Total Income: ₹${income.toLocaleString()}`, 14, 71);
      doc.text(`Total Expense: ₹${expense.toLocaleString()}`, 14, 77);
      doc.text(`Balance: ₹${balance.toLocaleString()}`, 14, 83);

      // Table
      autoTable(doc, {
        startY: 93,
        head: [['Date', 'Type', 'Category', 'Amount']],
        body: transactions.map((t) => [
          dayjs(t.createdAt).format('YYYY-MM-DD'),
          t.type || 'N/A',
          t.category || 'Uncategorized',
          `₹${(t.amount || 0).toLocaleString()}`,
        ]),
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      // Save PDF
      doc.save(`Expense_Statement_${month}.pdf`);
    } else {
      console.warn('Could not get 2D context for canvas. Proceeding without header image.');
      // Fallback: No image, just text
      doc.setFontSize(18);
      doc.text('Expense Tracker', 14, 20);
      doc.setFontSize(12);
      doc.text(`Statement Month: ${month}`, 14, 30);
      doc.text(`Generated On: ${today}`, 14, 36);

      doc.text(`Total Income: ₹${income.toLocaleString()}`, 14, 48);
      doc.text(`Total Expense: ₹${expense.toLocaleString()}`, 14, 54);
      doc.text(`Balance: ₹${balance.toLocaleString()}`, 14, 60);

      autoTable(doc, {
        startY: 70,
        head: [['Date', 'Type', 'Category', 'Amount']],
        body: transactions.map((t) => [
          dayjs(t.createdAt).format('YYYY-MM-DD'),
          t.type || 'N/A',
          t.category || 'Uncategorized',
          `₹${(t.amount || 0).toLocaleString()}`,
        ]),
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      doc.save(`Expense_Statement_${month}.pdf`);
    }

  };

  img.onerror = () => {
    console.warn('Header image not found. Proceeding without it.');

    // Fallback: No image, just text
    doc.setFontSize(18);
    doc.text('Expense Tracker', 14, 20);
    doc.setFontSize(12);
    doc.text(`Statement Month: ${month}`, 14, 30);
    doc.text(`Generated On: ${today}`, 14, 36);

    doc.text(`Total Income: ₹${income.toLocaleString()}`, 14, 48);
    doc.text(`Total Expense: ₹${expense.toLocaleString()}`, 14, 54);
    doc.text(`Balance: ₹${balance.toLocaleString()}`, 14, 60);

    autoTable(doc, {
      startY: 70,
      head: [['Date', 'Type', 'Category', 'Amount']],
      body: transactions.map((t) => [
        dayjs(t.createdAt).format('YYYY-MM-DD'),
        t.type || 'N/A',
        t.category || 'Uncategorized',
        `₹${(t.amount || 0).toLocaleString()}`,
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
      },
    });

    doc.save(`Expense_Statement_${month}.pdf`);
  };
}
