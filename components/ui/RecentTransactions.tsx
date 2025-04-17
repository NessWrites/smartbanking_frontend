'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import TransactionsTable from './TransactionsTable';
import { useRouter } from 'next/navigation';

// Load jsPDF and autoTable via CDN
const loadJsPDF = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
};

const loadAutoTable = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
};

interface Transaction {
  transactionID: string;
  date: string;
  reference: string;
  description: string;
  transactionTypeID: string;
  amount: string;
}

const RecentTransactions = ({ transaction }: { transaction: Transaction[] }) => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:8000/api/account-statement", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const transactionsData = await response.json();
        const sortedTransactions = transactionsData.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAllTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions.slice(0, 10));
      } catch (err) {
        setError(err.message || "Failed to fetch transactions");
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [router]);

  const handleFilter = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = allTransactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= start && transactionDate <= end;
    });

    setFilteredTransactions(filtered);
    setIsPopupOpen(false);
  };

  const handleDownloadPDF = async () => {
    // Load jsPDF and autoTable
    await Promise.all([loadJsPDF(), loadAutoTable()]);

    // Access jsPDF from window
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    const title = startDate && endDate 
      ? `Transaction Statement (${startDate} to ${endDate})`
      : 'Recent Transaction Statement';
    doc.text(title, 14, 20);

    // Prepare table data
    const tableData = filteredTransactions.map((t) => {
      const typeId = parseInt(t.transactionTypeID, 10);
      const amount = parseFloat(t.amount);
      return [
        t.date,
        t.reference,
        t.description,
        typeId === 1 ? `$${amount.toFixed(2)}` : '-',
        typeId === 2 ? `$${amount.toFixed(2)}` : '-',
      ];
    });

    // Add table to PDF
    doc.autoTable({
      head: [['Date', 'Reference', 'Description', 'Debit', 'Credit']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 102, 204] },
    });

    // Download the PDF
    const fileName = startDate && endDate 
      ? `statement_${startDate}_to_${endDate}.pdf`
      : 'recent_statement.pdf';
    doc.save(fileName);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStart = new Date(e.target.value);
    const maxEndDate = new Date(selectedStart);
    maxEndDate.setDate(selectedStart.getDate() + 180);

    const today = new Date();
    if (maxEndDate > today) {
      maxEndDate.setTime(today.getTime());
    }

    setStartDate(e.target.value);
    if (endDate && new Date(endDate) > maxEndDate) {
      setEndDate(maxEndDate.toISOString().split('T')[0]);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const today = new Date().toISOString().split('T')[0];
  const minEndDate = startDate
    ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 180)).toISOString().split('T')[0]
    : today;

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="view-all-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Select Dates
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download PDF
          </button>
        </div>
      </header>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  max={today}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={startDate}
                  max={minEndDate > today ? today : minEndDate}
                  disabled={!startDate}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleFilter}
                  disabled={!startDate || !endDate}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Apply Filter
                </button>
                <button
                  onClick={() => {
                    setIsPopupOpen(false);
                    setStartDate('');
                    setEndDate('');
                    setFilteredTransactions(allTransactions.slice(0, 10));
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TransactionsTable transactions={filteredTransactions} />
    </section>
  );
};

export default RecentTransactions;