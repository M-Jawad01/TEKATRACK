import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "TEKATRACK",
  description: "Personal finance dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="min-w-0 flex-1">
            <Topbar />
            <main className="p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}