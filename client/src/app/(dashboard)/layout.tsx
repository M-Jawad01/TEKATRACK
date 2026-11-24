import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import MobileNav from "@/components/MobileNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 lg:ml-64">
        <Topbar />
        {/* pb-24 prevents mobile content from hiding behind the bottom nav */}
        <main className="p-4 pb-24 lg:p-8">{children}</main>
      </div>

      {/* Mobile Bottom Bar (Hidden on desktop) */}
      <MobileNav />
    </div>
  );
}