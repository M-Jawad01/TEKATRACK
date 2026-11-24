"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Budgets", href: "/budgets", icon: PieChart },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-line bg-white px-2 py-2 lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors ${
              isActive ? "text-brand-600" : "text-muted hover:text-gray-900"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-brand-600" : "text-muted"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}