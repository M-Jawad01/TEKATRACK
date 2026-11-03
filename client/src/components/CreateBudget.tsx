"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function CreateBudget() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    color: "bg-brand-500", // default colour
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Budget created successfully!");
        setIsOpen(false);
        window.location.reload(); 
      } else {
        alert(data.error || "Failed to create budget");
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
        className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-500 shadow-sm transition-colors"
      >
        <Plus className="h-4 w-4" /> Create Budget
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">New Budget</h2>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500 hover:text-red-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
                <input type="text" required placeholder="e.g. Food & Dining, Housing"
                  className={inputClass}
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Limit (৳)</label>
                <input 
                  type="number" step="any" required placeholder="0.00"
                  className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  value={formData.limit} onChange={(e) => setFormData({...formData, limit: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Theme Color</label>
                <select 
                  className={inputClass}
                  value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})}
                >
                  <option value="bg-orange-500">Orange</option>
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-cyan-500">Cyan</option>
                  <option value="bg-purple-500">Purple</option>
                  <option value="bg-yellow-500">Yellow</option>
                  <option value="bg-emerald-500">Emerald</option>
                  <option value="bg-red-500">Red</option>
                </select>
              </div>

              <button type="submit" disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#0F3D2E] py-3 text-sm font-medium text-white hover:bg-[#0F3D2E]/90 disabled:opacity-70 transition-colors"
              >
                {loading ? "Saving..." : "Save Budget"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}