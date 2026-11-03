"use client";
import CreateBudget from "@/components/CreateBudget"; // Create Budget Modal ইম্পোর্ট করা হলো
import { useState, useEffect } from "react";
import { Target, AlertTriangle, TrendingUp, Wallet } from "lucide-react";

export default function BudgetsPage() {
  // ডাটা রাখার জন্য নতুন স্টেট
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ব্যাকএন্ড থেকে বাজেট এবং খরচের ডাটা আনার কাজ (API Call)
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/budgets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (res.ok) {
          setBudgets(data);
        }
      } catch (error) {
        console.error("ডাটা আনতে সমস্যা হয়েছে:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

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
        
        {/* এখানে CreateBudget বাটন/মডাল বসানো হয়েছে */}
        <CreateBudget />
        
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
          <p className="mt-4 text-3xl font-bold tracking-tight">
            {loading ? "..." : `৳${totalBudget.toLocaleString()}`}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-sm text-muted">Total Spent</span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight">
            {loading ? "..." : `৳${totalSpent.toLocaleString()}`}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-sm text-muted">Remaining</span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight">
            {loading ? "..." : `৳${totalRemaining.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Budget List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {loading ? (
          <p className="text-muted">Loading budgets...</p>
        ) : budgets.length > 0 ? (
          budgets.map((b) => {
            // Progress bar and warning logic 
            const percent = Math.min((b.spent / b.limit) * 100, 100);
            const remaining = b.limit - b.spent;
            const isOver = b.spent > b.limit;
            const isWarning = b.spent <= b.limit && (b.spent / b.limit) >= 0.8; // A warning occurs if the expense exceeds 80%.
            
            return (
              <div key={b.id} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
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
          })
        ) : (
          <p className="text-muted">No budgets created yet. Click "Create Budget" to start tracking.</p>
        )}
      </div>
    </div>
  );
}