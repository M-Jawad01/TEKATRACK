"use client";
import { Plus, Target, CheckCircle2, Clock } from "lucide-react";

// Dummy Goals Data
const goals = [
  { title: "Emergency Fund", target: 50000, saved: 32000, date: "Dec 2026", color: "bg-brand-500" },
  { title: "New Laptop", target: 80000, saved: 15000, date: "Jun 2027", color: "bg-blue-500" },
  { title: "Cox's Bazar Trip", target: 15000, saved: 15000, date: "Completed", color: "bg-green-500" }
];

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
          <p className="mt-1 text-muted">Set targets and track your saving progress.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-500 shadow-sm shadow-brand-500/20">
          <Plus className="h-4 w-4" /> Create Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((g, i) => {
          const percent = Math.min(Math.round((g.saved / g.target) * 100), 100);
          const isComplete = percent === 100;

          return (
            <div key={i} className="rounded-2xl border border-line bg-white p-6 shadow-sm flex flex-col">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${g.color}`}>
                    {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{g.title}</h3>
                    <p className="flex items-center gap-1 text-xs text-muted mt-0.5">
                      <Clock className="h-3 w-3" /> {g.date}
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold">{percent}%</span>
              </div>
              
              <div className="mt-auto">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted">Saved: <span className="font-medium text-ink">৳{g.saved.toLocaleString()}</span></span>
                  <span className="text-muted">Target: <span className="font-medium text-ink">৳{g.target.toLocaleString()}</span></span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2.5 w-full rounded-full bg-line overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : g.color}`} 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}