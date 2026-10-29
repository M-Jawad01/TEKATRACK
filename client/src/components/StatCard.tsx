import { Wallet, ArrowUp, ArrowDown, PiggyBank } from "lucide-react";

const icons = { "Total Balance": Wallet, "Monthly Income": ArrowUp, "Monthly Expenses": ArrowDown, Savings: PiggyBank } as const;
const tones = {
  green: "bg-brand-50 text-brand-600",
  red: "bg-red-50 text-red-500",
  purple: "bg-purple-50 text-purple-500",
};

type Props = { title: keyof typeof icons; value: string; change: string; up: boolean; tone: keyof typeof tones };

export default function StatCard({ title, value, change, up, tone }: Props) {
  const Icon = icons[title];
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-sm text-muted">{title}</span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
      <p className={`mt-2 text-sm font-medium ${tone === "red" ? "text-red-500" : "text-brand-600"}`}>
        {up ? "↑" : "↓"} {change} <span className="font-normal text-muted">from last month</span>
      </p>
    </div>
  );
}