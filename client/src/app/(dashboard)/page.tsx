"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; 

// catagory wise colour code
const pill: Record<string, string> = {
  Shopping: "bg-purple-100 text-purple-600",
  Income: "bg-brand-50 text-brand-600",
  "Food & Dining": "bg-orange-100 text-orange-600",
  Housing: "bg-blue-100 text-blue-600",
  Transportation: "bg-cyan-100 text-cyan-700",
};

export default function DashboardOverview() {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          let totalIncome = 0;
          let totalExpense = 0;

          data.forEach((t: any) => {
            if (t.type === "income") totalIncome += Number(t.amount);
            if (t.type === "expense") totalExpense += Number(t.amount);
          });

          setSummary({
            income: totalIncome,
            expense: totalExpense,
            balance: totalIncome - totalExpense,
          });

          // Ekhane change kora hoyeche: Amount onujayi (Boro theke choto) sort kora
          const sortedByAmount = [...data].sort((a: any, b: any) => Number(b.amount) - Number(a.amount));

          // Tarpor shekhan theke top 5 ti neya holo
          setRecentTransactions(sortedByAmount.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your financial summary.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loading ? "..." : `৳ ${summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {loading ? "..." : `৳ ${summary.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Expense</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {loading ? "..." : `৳ ${summary.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          <Link href="/transactions" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition">
            View All →
          </Link>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-gray-500">
                <th className="px-6 py-4 font-medium whitespace-nowrap">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : recentTransactions.length > 0 ? (
                recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${pill[t.category] || "bg-slate-100 text-slate-600"}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${t.type === "expense" ? "text-red-500" : "text-brand-600"}`}>
                      {t.type === "expense" ? "-" : "+"}৳{Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No recent transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}