"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { breakdown } from "@/data/mock";

export default function SpendingDonut() {
  const total = breakdown.reduce((s, b) => s + b.value, 0);
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Spending Breakdown</h2>
      <div className="flex items-center gap-6">
        <div className="relative h-52 w-52 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={breakdown} dataKey="value" innerRadius={62} outerRadius={95} paddingAngle={2} stroke="none">
                {breakdown.map((b) => <Cell key={b.name} fill={b.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">৳{total.toLocaleString()}</span>
            <span className="text-xs text-muted">Total Expenses</span>
          </div>
        </div>

        <ul className="w-full space-y-3 text-sm">
          {breakdown.map((b) => (
            <li key={b.name} className="flex items-center gap-3">
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: b.color }} />
              <span className="flex-1">{b.name}</span>
              <span className="w-10 text-right text-muted">{Math.round((b.value / total) * 100)}%</span>
              <span className="w-14 text-right font-medium">৳{b.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}