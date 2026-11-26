"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  BarChart3, PieChart as PieIcon, ListFilter, Zap, Plus, Target, ArrowRight
} from "lucide-react";

// catagory wise colour code (original code)
const pill: Record<string, string> = {
  Shopping: "bg-purple-100 text-purple-600",
  Income: "bg-brand-50 text-brand-600",
  "Food & Dining": "bg-orange-100 text-orange-600",
  Housing: "bg-blue-100 text-blue-600",
  Transportation: "bg-cyan-100 text-cyan-700",
  "Savings & Goals": "bg-emerald-100 text-emerald-700",
};

const DONUT_COLORS = ["#10b981", "#3b82f6", "#f97316", "#a855f7", "#facc15", "#94a3b8"];

export default function DashboardOverview() {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // fetching Transactions and Goals together
        const [res, goalRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals`, { headers }),
        ]);

        if (goalRes.ok) {
          setGoals(await goalRes.json());
        }

        if (res.ok) {
          const data = await res.json();
          let totalIncome = 0;
          let totalExpense = 0;

          const monthMap: Record<string, { Income: number; Expenses: number }> = {};
          const categoryMap: Record<string, number> = {};
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          data.forEach((t: any) => {
            const amt = Number(t.amount);
            const date = new Date(t.date);
            const month = monthNames[date.getMonth()];

            if (!monthMap[month]) monthMap[month] = { Income: 0, Expenses: 0 };

            if (t.type === "income") {
              totalIncome += amt;
              monthMap[month].Income += amt;
            }
            if (t.type === "expense") {
              totalExpense += amt;
              monthMap[month].Expenses += amt;
              categoryMap[t.category] = (categoryMap[t.category] || 0) + amt;
            }
          });

          setSummary({
            income: totalIncome,
            expense: totalExpense,
            balance: totalIncome - totalExpense,
          });

          //Sort by amount (highest to lowest) and take top 5
          const sortedByAmount = [...data].sort((a: any, b: any) => Number(b.amount) - Number(a.amount));
          setRecentTransactions(sortedByAmount.slice(0, 5));

          // Bar Chart Data (Income vs Expenses)
          const formattedBarData = monthNames
            .filter((m) => monthMap[m])
            .map((m) => ({ month: m, ...monthMap[m] }));
          setBarChartData(formattedBarData);

          // Donut Chart Data (Spending Breakdown)
          const formattedPieData = Object.keys(categoryMap)
            .map((name) => ({
              name,
              value: categoryMap[name],
              percent: totalExpense > 0 ? Math.round((categoryMap[name] / totalExpense) * 100) : 0,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
          setPieChartData(formattedPieData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const topGoal = goals[0];
  const goalPercent =
    topGoal && topGoal.target > 0
      ? Math.min(Math.round((topGoal.saved / topGoal.target) * 100), 100)
      : 0;

  return (
    <div className="space-y-6 pb-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your financial summary.</p>
      </header>

      {/* Summary Cards (Original Design) */}
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

      {/* Middle Section: Income vs Expenses & Spending Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Income vs Expenses Bar Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-bold text-gray-900">Income vs Expenses</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#059669]"></span> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1e293b]"></span> Expenses
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {!loading && barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} barGap={6} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={8} />
                  <YAxis tickFormatter={(val) => `৳${val}`} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="Income" fill="#059669" radius={[6, 6, 0, 0]} barSize={28} />
                  <Bar dataKey="Expenses" fill="#1e293b" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                {loading ? "Loading chart..." : "No chart data available yet"}
              </div>
            )}
          </div>
        </div>

        {/* Spending Breakdown Donut Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="mb-4 flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-bold text-gray-900">Spending Breakdown</h2>
          </div>

          {!loading && pieChartData.length > 0 ? (
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => `৳${val.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold text-gray-900">
                    ৳{summary.expense.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-500">Total Expenses</span>
                </div>
              </div>

              <div className="w-full space-y-2.5 text-sm">
                {pieChartData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                      />
                      <span className="truncate text-gray-600">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-medium">
                      <span className="text-gray-900">{item.percent}%</span>
                      <span className="w-16 text-right text-gray-500">
                        ৳{item.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              {loading ? "Loading breakdown..." : "No expenses recorded yet"}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Recent Transactions (Left) + Quick Actions & Goal (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Transactions Section (table and logic) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListFilter className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            </div>
            <Link href="/transactions" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-gray-500">
                  <th className="px-4 py-3.5 font-medium whitespace-nowrap">Date</th>
                  <th className="px-4 py-3.5 font-medium">Description</th>
                  <th className="px-4 py-3.5 font-medium">Category</th>
                  <th className="px-4 py-3.5 text-right font-medium">Amount</th>
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
                      <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">{t.description}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${pill[t.category] || "bg-slate-100 text-slate-600"}`}>
                          {t.category}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-right font-medium whitespace-nowrap ${t.type === "expense" ? "text-red-500" : "text-brand-600"}`}>
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

        {/* Right Side: Quick Actions & Financial Goal Card */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/transactions"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-500 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" /> Add Transaction
              </Link>

              <Link
                href="/budgets"
                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Target className="h-4 w-4 text-brand-600" /> Set Budget
              </Link>

              <Link
                href="/goals"
                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Target className="h-4 w-4 text-brand-600" /> Create Goal
              </Link>

              <Link
                href="/reports"
                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="h-4 w-4 text-brand-600" /> View Reports
              </Link>
            </div>
          </div>

          {/* Financial Goal Progress Mini Card */}
          <Link
            href="/goals"
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-brand-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Financial Goal</h3>
                  <p className="text-xs text-gray-500">
                    {topGoal ? topGoal.title : "No active goal set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {topGoal && (
                  <span className="text-xs font-medium text-gray-500">
                    ৳{topGoal.saved.toLocaleString()} / ৳{topGoal.target.toLocaleString()}
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {topGoal && (
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all duration-500"
                    style={{ width: `${goalPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600">{goalPercent}%</span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}