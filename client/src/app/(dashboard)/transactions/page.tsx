"use client";
import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Download } from "lucide-react";
import { transactions } from "@/data/mock";

// catagory wise colour code
const pill: Record<string, string> = {
  Shopping: "bg-purple-100 text-purple-600",
  Income: "bg-brand-50 text-brand-600",
  "Food & Dining": "bg-orange-100 text-orange-600",
  Housing: "bg-blue-100 text-blue-600",
  Transportation: "bg-cyan-100 text-cyan-700",
};

export default function TransactionsPage() {
  // state for search and filter 
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  // logic for data filter 
  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchType =
      type === "All" ||
      (type === "Income" && t.amount > 0) ||
      (type === "Expense" && t.amount < 0);
    return matchSearch && matchType;
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
          <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-500 shadow-sm shadow-brand-500/20">
            <Plus className="h-4 w-4" /> Add Transaction
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-line bg-white shadow-sm">
        
        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-md items-center gap-3 rounded-lg border border-line bg-canvas px-3 py-2 sm:w-auto focus-within:border-brand-500 focus-within:bg-white transition-colors">
            <Search className="h-4 w-4 text-muted" />
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
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 cursor-pointer"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Income">Income (+)</option>
              <option value="Expense">Expense (-)</option>
            </select>
            <button className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium hover:bg-canvas transition">
              <Filter className="h-4 w-4 text-muted" /> More Filters
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas/50 text-left text-muted">
                <th className="px-6 py-4 font-medium whitespace-nowrap">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 text-right font-medium">Amount</th>
                <th className="px-6 py-4 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((t, i) => (
                  <tr key={i} className="border-b border-line last:border-0 hover:bg-canvas/30 transition-colors">
                    <td className="px-6 py-4 text-muted whitespace-nowrap">{t.date}</td>
                    <td className="px-6 py-4 font-medium">{t.desc}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${pill[t.category] || "bg-slate-100 text-slate-600"}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${t.amount < 0 ? "text-red-500" : "text-brand-600"}`}>
                      {t.amount < 0 ? "-" : "+"}৳{Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex rounded-lg p-2 text-muted hover:bg-line hover:text-ink transition">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    No transactions found for "{search}".
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