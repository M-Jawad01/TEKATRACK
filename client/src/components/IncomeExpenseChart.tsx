"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { monthly } from "@/data/mock";

export default function IncomeExpenseChart() {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Income vs Expenses</h2>
        <div className="flex gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-brand-500" />Income</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-navy" />Expenses</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly} barGap={8}>
            <CartesianGrid vertical={false} stroke="#e3eae7" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `৳${v.toLocaleString()}`} />
            <Tooltip cursor={{ fill: "#f2f6f5" }} />
            <Bar dataKey="income" fill="#12a56d" radius={[6, 6, 0, 0]} barSize={28} />
            <Bar dataKey="expenses" fill="#2d3e57" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}