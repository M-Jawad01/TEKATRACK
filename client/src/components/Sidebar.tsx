"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, PieChart, BarChart2, Target, Settings, LogOut, Leaf } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
    { name: "Budgets", icon: PieChart, path: "/budgets" },
    { name: "Reports", icon: BarChart2, path: "/reports" },
    { name: "Goals", icon: Target, path: "/goals" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F3D2E] flex flex-col">
      {/* logo part without border */}
      <div className="flex h-20 items-center gap-3 px-6 mt-2">
        <Leaf className="h-8 w-8 text-[#4ade80]" />
        <span className="text-2xl font-bold text-white tracking-wide">TekaTrack</span>
      </div>

      {/* menu item */}
      <nav className="flex-1 space-y-1.5 p-4 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-white/15 text-white shadow-sm" // active state (mild white background)
                  : "text-white/70 hover:bg-white/5 hover:text-white" // inactive state
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-white/70"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* logout button */}
      <div className="p-4 mb-4">
        <button 
          onClick={handleLogout} 
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}