"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function AddTransaction() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token"); // logged user's token 

    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // token exchange for security purpose 
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Transaction added successfully!");
        setIsOpen(false);
        setFormData({ amount: "", type: "expense", category: "", description: "" });
        // visualizing new data after submitting the form
        window.location.reload(); 
      } else {
        alert(data.error || "Failed to add transaction");
      }
    } catch (error) {
      alert("Server connection failed!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#0F3D2E] transition-colors";

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-500 shadow-sm shadow-brand-500/20 transition-colors"
      >
        <Plus className="h-4 w-4" /> Add Transaction
      </button>

      {/* pop-up form (Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">New Transaction</h2>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500 hover:text-red-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                <select 
                  className={inputClass}
                  value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="expense">Expense (খরচ)</option>
                  <option value="income">Income (আয়)</option>
                </select>
              </div>
              
              {/* removing arrow and step==any */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (৳)</label>
                <input 
                  type="number" 
                  step="any"
                  required 
                  placeholder="0.00"
                  className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <input type="text" required placeholder="e.g. Salary, Food, Shopping"
                  className={inputClass}
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <input type="text" required placeholder="e.g. Daraz Order, Office Salary"
                  className={inputClass}
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button type="submit" disabled={loading}
                className="mt-2 w-full rounded-xl bg-[#0F3D2E] py-3 text-sm font-medium text-white hover:bg-[#0F3D2E]/90 disabled:opacity-70 transition-colors"
              >
                {loading ? "Saving..." : "Save Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}