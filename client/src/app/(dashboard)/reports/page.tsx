"use client";
import { useState, useEffect } from "react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Activity, Calendar, Download } from 'lucide-react';

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (res.ok) {
          setTransactions(data);
        }
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // --- Data Calculation Logic ---
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryMap: Record<string, number> = {};
  const monthMap: Record<string, { Income: number; Expenses: number }> = {};
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  transactions.forEach((t) => {
    const amount = Number(t.amount);
    const date = new Date(t.date);
    const month = monthNames[date.getMonth()]; // get(month) from transactions

    // starting with zero if there are no month's data 
    if (!monthMap[month]) {
      monthMap[month] = { Income: 0, Expenses: 0 };
    }

    if (t.type === "income") {
      totalIncome += amount;
      monthMap[month].Income += amount;
    } else if (t.type === "expense") {
      totalExpense += amount;
      monthMap[month].Expenses += amount;

      // expenses calulation based on catagory 
      if (categoryMap[t.category]) {
        categoryMap[t.category] += amount;
      } else {
        categoryMap[t.category] = amount;
      }
    }
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : "0.0";

  // Catagory data fpr Bar Chart (accending order)
  const expenseByCategoryData = Object.keys(categoryMap)
    .map(key => ({ name: key, value: categoryMap[key] }))
    .sort((a, b) => b.value - a.value);

  // monthly data sequenctial formatting for line chart 
  const cashFlowTrendData = monthNames
    .filter(m => monthMap[m])
    .map(m => ({ month: m, ...monthMap[m] }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-gray-500">Deep dive into your financial trends and insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            <Calendar className="h-4 w-4" /> This Year
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-500 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "..." : `৳${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "..." : `৳${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            < Wallet className="h-5 w-5 text-purple-500" />
            <h3 className="text-sm font-medium text-gray-500">Net Savings</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "..." : `${netSavings < 0 ? "-" : ""}৳${Math.abs(netSavings).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-500">Savings Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{loading ? "..." : `${savingsRate}%`}</p>
        </div>
      </div>

      {/* Charts Section */}
      {!loading && transactions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Cash Flow Trend Line Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Cash Flow Trend</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis tickFormatter={(val) => `৳${val}`} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip 
                    cursor={{stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4'}}
                    contentStyle={{borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense by Category Horizontal Bar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Expense by Category</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseByCategoryData} layout="vertical" margin={{ top: 0, right: 10, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(val) => `৳${val}`} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12}} width={90} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      ) : (
        !loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">No transaction data available for reports yet.</p>
          </div>
        )
      )}
    </div>
  );
}