"use client";
import { Download, Calendar, TrendingUp, TrendingDown, PiggyBank, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { monthly, breakdown } from "@/data/mock";

export default function ReportsPage() {
  // summary calculation from dummy data 
  const totalIncome = monthly.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpense = monthly.reduce((acc, curr) => acc + curr.expenses, 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = ((netSavings / totalIncome) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="mt-1 text-muted">Deep dive into your financial trends and insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium hover:bg-canvas">
            <Calendar className="h-4 w-4" /> This Year
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-500 shadow-sm shadow-brand-500/20">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Quick Insights Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand-600 mb-3">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium text-muted">Total Income</span>
          </div>
          <p className="text-2xl font-bold">৳{totalIncome.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-red-500 mb-3">
            <TrendingDown className="h-5 w-5" />
            <span className="text-sm font-medium text-muted">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold">৳{totalExpense.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-purple-500 mb-3">
            <PiggyBank className="h-5 w-5" />
            <span className="text-sm font-medium text-muted">Net Savings</span>
          </div>
          <p className="text-2xl font-bold">৳{netSavings.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-blue-500 mb-3">
            <Activity className="h-5 w-5" />
            <span className="text-sm font-medium text-muted">Savings Rate</span>
          </div>
          <p className="text-2xl font-bold">{savingsRate}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cash Flow Line Chart */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold">Cash Flow Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3eae7" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7b75' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7b75' }} tickFormatter={(v) => `৳${v}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`৳${value.toLocaleString()}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#12a56d" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Spending Categories Bar Chart */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold">Expense by Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdown} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e3eae7" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7b75' }} tickFormatter={(v) => `৳${v}`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#111827' }} width={100} />
                <Tooltip 
                  cursor={{ fill: "#f2f6f5" }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Spent']}
                />
                <Bar dataKey="value" fill="#4f7be8" radius={[0, 4, 4, 0]} barSize={20}>
                  {/* for dynamic colour could be import recharts but for clean look solid color given.*/}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}