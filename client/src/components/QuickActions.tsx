import { Plus, Target, Flag, BarChart3, Zap } from "lucide-react";

export default function QuickActions() {
  const secondary = [
    { label: "Set Budget", icon: Target },
    { label: "Create Goal", icon: Flag },
    { label: "View Reports", icon: BarChart3 },
  ];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Zap className="h-5 w-5 text-brand-500" /> Quick Actions
        </h2>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-500">
          <Plus className="h-4 w-4" /> Add Transaction
        </button>
        <div className="mt-3 space-y-3">
          {secondary.map(({ label, icon: Icon }) => (
            <button key={label} className="flex w-full items-center gap-3 rounded-lg border border-line px-4 py-3 text-sm font-medium hover:bg-canvas">
              <Icon className="h-4 w-4 text-brand-600" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h3 className="mb-3 font-semibold">Financial Goal</h3>
        <div className="flex justify-between text-xs text-muted">
          <span>Emergency Fund</span><span>৳1,550 / ৳3,000</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-line">
          <div className="h-2 rounded-full bg-brand-500" style={{ width: "52%" }} />
        </div>
        <p className="mt-1 text-right text-xs text-muted">52%</p>
      </div>
    </div>
  );
}