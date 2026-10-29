import { CalendarDays, ChevronDown } from "lucide-react";
import StatCard from "@/components/StatCard";
import IncomeExpenseChart from "@/components/IncomeExpenseChart";
import SpendingDonut from "@/components/SpendingDonut";
import RecentTransactions from "@/components/RecentTransactions";
import QuickActions from "@/components/QuickActions";
import { stats } from "@/data/mock";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Financial Overview</h1>
          <p className="mt-2 text-muted">Here&apos;s what&apos;s happening with your money this month</p>
        </div>
        <button className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium">
          <CalendarDays className="h-4 w-4" /> Apr 1, 2025 – Apr 30, 2025 <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3"><IncomeExpenseChart /></div>
        <div className="xl:col-span-2"><SpendingDonut /></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><RecentTransactions /></div>
        <QuickActions />
      </div>
    </div>
  );
}