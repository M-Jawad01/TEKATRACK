"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function CreateGoal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    saved: "",
    deadline: "",
    color: "bg-brand-500",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Goal created successfully!");
        setIsOpen(false);
        window.location.reload(); 
      } else {
        alert(data.error || "Failed to create goal");
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
        <Plus className="h-4 w-4" /> Create Goal
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">New Financial Goal</h2>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500 hover:text-red-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal Title</label>
                <input type="text" required placeholder="e.g. New Laptop, Emergency Fund"
                  className={inputClass}
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Amount (৳)</label>
                  <input type="number" step="any" required placeholder="0.00" className={inputClass}
                    value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Already Saved (৳)</label>
                  <input type="number" step="any" placeholder="0.00" className={inputClass}
                    value={formData.saved} onChange={(e) => setFormData({...formData, saved: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label>
                <input type="text" required placeholder="e.g. Dec 2026 or Completed"
                  className={inputClass}
                  value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal Theme Color</label>
                <select className={inputClass} value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})}>
                  <option value="bg-brand-500">Brand Green</option>
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-green-500">Success Green</option>
                  <option value="bg-purple-500">Purple</option>
                  <option value="bg-orange-500">Orange</option>
                </select>
              </div>

              <button type="submit" disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#0F3D2E] py-3 text-sm font-medium text-white hover:bg-[#0F3D2E]/90 disabled:opacity-70 transition-colors"
              >
                {loading ? "Saving..." : "Save Goal"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}