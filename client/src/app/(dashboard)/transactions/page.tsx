"use client";
import AddTransaction from "@/components/AddTransaction";
import { useState, useEffect } from "react";
import { Search, Download, Calendar } from "lucide-react";

// code based on the category, we will assign a pill color for each category
const pill: Record<string, string> = {
  Shopping: "bg-purple-100 text-purple-600",
  Income: "bg-brand-50 text-brand-600",
  "Food & Dining": "bg-orange-100 text-orange-600",
  Housing: "bg-blue-100 text-blue-600",
  Transportation: "bg-cyan-100 text-cyan-700",
};

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  // real data state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setTransactions(data);
        }
      } catch (error) {
        console.error("ডাটা আনতে সমস্যা হয়েছে:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // filter transactions based on search, type, and month
  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    const matchType =
      type === "All" ||
      (type === "Income" && t.type === "income") ||
      (type === "Expense" && t.type === "expense");

    // Month Filtering Logic
    const transactionDate = new Date(t.date);
    const transactionMonth = transactionDate.getMonth().toString();
    const matchMonth = selectedMonth === "All" || selectedMonth === transactionMonth;

    return matchSearch && matchType && matchMonth;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="mt-1 text-muted">View and manage your income and expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium hover:bg-canvas">
            <Download className="h-4 w-4" /> Export
          </button>

          {/* Add Transaction Modal */}
          <AddTransaction />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-line bg-white shadow-sm">
        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col gap-4 border-b border-line p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-md items-center gap-3 rounded-lg border border-line bg-canvas px-3 py-2 sm:w-auto focus-within:border-brand-500 focus-within:bg-white transition-colors">
            <Search className="h-4 w-4 text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search by description or category..."
              className="w-full bg-transparent text-sm outline-none sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              className="flex-1 sm:flex-none rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 cursor-pointer"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Income">Income (+)</option>
              <option value="Expense">Expense (-)</option>
            </select>

            {/* Month Filter Dropdown */}
            <div className="relative flex flex-1 sm:flex-none items-center">
              <Calendar className="absolute left-3 h-4 w-4 text-muted pointer-events-none" />
              <select
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-line bg-white text-sm outline-none focus:border-brand-500 cursor-pointer appearance-none"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="All">All Months</option>
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">September</option>
                <option value="9">October</option>
                <option value="10">November</option>
                <option value="11">December</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Card View (Visible on mobile, hidden on desktop) */}
        <div className="divide-y divide-line md:hidden">
          {loading ? (
            <p className="py-12 text-center text-sm text-muted">
              Loading transactions...
            </p>
          ) : filtered.length > 0 ? (
            filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 p-4 hover:bg-canvas/30 transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {t.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        pill[t.category] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {t.category}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div
                  className={`shrink-0 text-right text-sm font-semibold ${
                    t.type === "expense" ? "text-red-500" : "text-brand-600"
                  }`}
                >
                  {t.type === "expense" ? "-" : "+"}৳
                  {Number(t.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="py-12 text-center text-sm text-muted">
              No transactions found. Add a new one!
            </p>
          )}
        </div>

        {/* Desktop Table View (Hidden on mobile, visible on desktop) */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas/50 text-left text-muted">
                <th className="px-6 py-4 font-medium whitespace-nowrap">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted">
                    Loading transactions...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-line last:border-0 hover:bg-canvas/30 transition-colors"
                  >
                    {/* Date */}
                    <td className="px-6 py-4 text-muted whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium">{t.description}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          pill[t.category] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.category}
                      </span>
                    </td>
                    {/* Amount */}
                    <td
                      className={`px-6 py-4 text-right font-medium whitespace-nowrap ${
                        t.type === "expense" ? "text-red-500" : "text-brand-600"
                      }`}
                    >
                      {t.type === "expense" ? "-" : "+"}৳
                      {Number(t.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted">
                    No transactions found. Add a new one!
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