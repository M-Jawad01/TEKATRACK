"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  LayoutDashboard,
  AlertTriangle,
  CheckCircle2,
  X,
  Moon,
  Sun,
  Leaf,
} from "lucide-react";

export default function Topbar() {
  const router = useRouter();

  // User & Theme state
  const [user, setUser] = useState({ name: "Mubashir Jawad", email: "" });
  const [isDark, setIsDark] = useState(false);

  // Search & Data states
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Dropdown states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 0. Apply saved theme on page load
    const applyTheme = () => {
      const savedTheme = localStorage.getItem("pref_theme") || "light";
      const root = document.documentElement;
      const shouldBeDark =
        savedTheme === "dark" ||
        (savedTheme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      if (shouldBeDark) {
        root.classList.add("dark");
        setIsDark(true);
      } else {
        root.classList.remove("dark");
        setIsDark(false);
      }
    };
    applyTheme();

    // 1. Load cached user info immediately
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // 2. Fetch live data from backend for Search, Notifications & Profile
    const fetchTopbarData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        const [txRes, budgetRes, goalRes, profileRes] = await Promise.all([
          fetch("http://localhost:5000/api/transactions", { headers }),
          fetch("http://localhost:5000/api/budgets", { headers }),
          fetch("http://localhost:5000/api/goals", { headers }),
          fetch("http://localhost:5000/api/user/profile", { headers }),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData);
        }

        if (txRes.ok) {
          setTransactions(await txRes.json());
        }

        const generatedAlerts: any[] = [];

        // Budget warnings (alerts when spent >= 80% of limit)
        if (budgetRes.ok) {
          const budgets = await budgetRes.json();
          budgets.forEach((b: any) => {
            const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
            if (pct >= 100) {
              generatedAlerts.push({
                id: `b-${b.id}`,
                type: "danger",
                title: `Budget Exceeded: ${b.category}`,
                desc: `Spent ৳${b.spent.toLocaleString()} of ৳${b.limit.toLocaleString()} limit (${pct}%).`,
                link: "/budgets",
              });
            } else if (pct >= 80) {
              generatedAlerts.push({
                id: `b-${b.id}`,
                type: "warning",
                title: `Near Limit: ${b.category}`,
                desc: `You have used ${pct}% of your ${b.category} budget.`,
                link: "/budgets",
              });
            }
          });
        }

        // Goal completions alerts (alerts when saved >= target)
        if (goalRes.ok) {
          const goals = await goalRes.json();
          goals.forEach((g: any) => {
            if (g.target > 0 && g.saved >= g.target) {
              generatedAlerts.push({
                id: `g-${g.id}`,
                type: "success",
                title: `Goal Reached: ${g.title}! 🎉`,
                desc: `Target of ৳${g.target.toLocaleString()} achieved!`,
                link: "/goals",
              });
            }
          });
        }

        setAlerts(generatedAlerts);
        setUnreadCount(generatedAlerts.length);
      } catch (err) {
        console.error("Failed to load topbar data:", err);
      }
    };

    fetchTopbarData();

    // 3. Close dropdowns when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setIsSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("pref_theme", "light");
      setIsDark(false);
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("pref_theme", "dark");
      setIsDark(true);
    }
  };

  // Get initials from user name for avatar display
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter transactions based on search query for live search dropdown
  const filteredTransactions = searchQuery.trim()
    ? transactions
        .filter(
          (t) =>
            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.type.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 lg:px-8 lg:py-4">
      {/* Mobile Leaf Logo (Hidden on desktop since Sidebar has it) */}
      <Link
        href="/"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F3D2E] lg:hidden"
      >
        <Leaf className="h-5 w-5 text-[#4ade80]" />
      </Link>

      {/* 1. Interactive Search Box */}
      <div ref={searchRef} className="relative w-full max-w-xl">
        <div className="flex w-full items-center gap-3 rounded-xl bg-canvas px-4 py-3 focus-within:ring-2 focus-within:ring-brand-600/20 transition-all">
          <Search className="h-4 w-4 text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search transactions & categories..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-muted hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Live Search Dropdown */}
        {isSearchOpen && searchQuery.trim() !== "" && (
          <div className="absolute left-0 mt-2 w-full rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50">
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase">
              Matching Transactions
            </div>
            {filteredTransactions.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {filteredTransactions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push("/transactions");
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t.description}
                      </p>
                      <p className="text-xs text-muted">
                        {t.category} •{" "}
                        {new Date(t.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        t.type === "expense" ? "text-red-500" : "text-brand-600"
                      }`}
                    >
                      {t.type === "expense" ? "-" : "+"}৳
                      {Number(t.amount).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted">
                No transactions found for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Quick Theme Toggle Button (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="rounded-full p-2 text-muted hover:bg-gray-100 transition-colors"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-muted" />
          )}
        </button>

        {/* 2. Notification Bell & Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setUnreadCount(0);
            }}
            className="relative rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-muted" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          {isNotifOpen && (
            <div className="fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl z-50">
              <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Notifications
                </h3>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                  {alerts.length} Alerts
                </span>
              </div>

              {alerts.length > 0 ? (
                <div className="max-h-72 space-y-2.5 overflow-y-auto">
                  {alerts.map((a) => (
                    <Link
                      key={a.id}
                      href={a.link}
                      onClick={() => setIsNotifOpen(false)}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-gray-50 transition-colors"
                    >
                      {a.type === "success" ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                      ) : (
                        <AlertTriangle
                          className={`mt-0.5 h-5 w-5 shrink-0 ${
                            a.type === "danger"
                              ? "text-red-500"
                              : "text-amber-500"
                          }`}
                        />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gray-900">
                          {a.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">{a.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    All caught up! 🎉
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    No budget warnings or goal alerts right now.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Interactive User Profile & Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {getInitials(user.name)}
            </div>
            <div className="hidden sm:block text-sm leading-tight">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-muted">Admin</p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50">
              <div className="mb-1 border-b border-gray-100 px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted">
                  {user.email || "Personal Account"}
                </p>
              </div>

              <Link
                href="/"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-muted" /> Dashboard
              </Link>

              <Link
                href="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-muted" /> Settings
              </Link>

              <div className="my-1 border-t border-gray-100" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}