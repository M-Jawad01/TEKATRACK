import { Search, Bell, ChevronDown } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-line bg-white px-8 py-4">
      <div className="flex w-full max-w-xl items-center gap-3 rounded-xl bg-canvas px-4 py-3">
        <Search className="h-4 w-4 text-muted" />
        <input
          placeholder="Search transactions, categories, or accounts..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative">
          <Bell className="h-5 w-5 text-muted" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            SJ
          </div>
          <div className="text-sm leading-tight">
            <p className="font-medium">Sarah Johnson</p>
            <p className="text-xs text-muted">Member</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted" />
        </div>
      </div>
    </header>
  );
}