"use client";
import { Plus, Target, AlertTriangle, TrendingUp, Wallet } from "lucide-react";

// Dummy budget data (for UI visiualizatiion only)
const budgets = [
  { category: "Food & Dining", limit: 12000, spent: 9500, color: "bg-orange-500" },
  { category: "Housing", limit: 25000, spent: 25000, color: "bg-blue-500" },
  { category: "Transportation", limit: 5000, spent: 1200, color: "bg-cyan-500" },
  { category: "Shopping", limit: 8000, spent: 7800, color: "bg-purple-500" },
  { category: "Utilities", limit: 4000, spent: 4200, color: "bg-yellow-500" },
];

export default function BudgetsPage() {
  // for total calculation 
  const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="mt-1 text-muted">Manage your spending limits by category.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-500 shadow-sm shadow-brand-500/20">
          <Plus className="h-4 w-4" /> Create Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Target className="h-6 w-6" />
            </div>
            <span className="text-sm text-muted">Total Budget</span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight">৳{totalBudget.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-sm text-muted">Total Spent</span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight">৳{totalSpent.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-sm text-muted">Remaining</span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight">৳{totalRemaining.toLocaleString()}</p>
        </div>
      </div>

      {/* Budget List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {budgets.map((b, i) => {
          // Progress bar and warning logic 
          const percent = Math.min((b.spent / b.limit) * 100, 100);
          const remaining = b.limit - b.spent;
          const isOver = b.spent > b.limit;
          const isWarning = b.spent <= b.limit && (b.spent / b.limit) >= 0.8; // A warning occurs if the expense exceeds 80%.
          return (
            <div key={i} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${b.color}`}></span>
                  <h3 className="font-semibold">{b.category}</h3>
                </div>
                {isOver && (
                  <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 border border-red-100">
                    <AlertTriangle className="h-3.5 w-3.5" /> Over Budget
                  </span>
                )}
                {isWarning && (
                  <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-600 border border-yellow-100">
                    <AlertTriangle className="h-3.5 w-3.5" /> Near Limit
                  </span>
                )}
              </div>
              
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted">Spent: <span className="font-medium text-ink">৳{b.spent.toLocaleString()}</span></span>
                <span className="text-muted">Limit: <span className="font-medium text-ink">৳{b.limit.toLocaleString()}</span></span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2.5 w-full rounded-full bg-line overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : b.color}`} 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              
              <p className="mt-3 text-sm text-muted">
                <span className={`font-medium ${isOver ? 'text-red-500' : 'text-brand-600'}`}>
                  {isOver ? `৳${Math.abs(remaining).toLocaleString()} over limit` : `৳${remaining.toLocaleString()} left`}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}