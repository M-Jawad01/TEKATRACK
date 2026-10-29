"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Wallet,
  BarChart3, Target, Settings, Leaf,
} from "lucide-react";

const items = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Budgets", href: "/budgets", icon: PieChart },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar p-4 text-white lg:flex">
      <div className="mb-8 flex items-center gap-2 px-3 py-4">
        <Leaf className="h-7 w-7 text-brand-500" />
        <span className="text-2xl font-bold">TekaTrack</span>
      </div>

      <nav className="space-y-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active ? "bg-white/10" : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/15 p-5">
        <Leaf className="mb-3 h-5 w-5 text-brand-500" />
        <p className="font-semibold">Build a better financial future</p>
        <p className="mt-2 text-xs text-white/65">
          Track your spending, save more, and reach your goals.
        </p>
        <button className="mt-4 w-full rounded-lg bg-brand-600 py-2 text-sm font-medium hover:bg-brand-500">
          Learn More
        </button>
      </div>
    </aside>
  );
}