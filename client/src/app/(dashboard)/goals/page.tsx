"use client";
import CreateGoal from "@/components/CreateGoal";
import { useState, useEffect } from "react";
import { Target, CheckCircle2, Clock, Plus, X } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Funds Modal States
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (res.ok) {
          setGoals(data);
        }
      } catch (error) {
        console.error("Failed to fetch goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !amountToAdd) return;
    
    setAddLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/goals/${selectedGoal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amountToAdd }),
      });

      if (res.ok) {
        alert("Funds added successfully!");
        setIsAddFundsOpen(false);
        setAmountToAdd("");
        window.location.reload(); // Page reload kore notun data anbe
      } else {
        alert("Failed to add funds");
      }
    } catch (error) {
      alert("Server connection failed!");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
          <p className="mt-1 text-muted">Set targets and track your saving progress.</p>
        </div>
        <CreateGoal />
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-muted">Loading goals...</p>
        ) : goals.length > 0 ? (
          goals.map((g) => {
            const percent = g.target > 0 ? Math.min(Math.round((g.saved / g.target) * 100), 100) : 0;
            const isComplete = percent === 100;

            return (
              <div key={g.id} className="rounded-2xl border border-line bg-white p-6 shadow-sm flex flex-col relative group">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${g.color || "bg-brand-500"}`}>
                      {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{g.title}</h3>
                      <p className="flex items-center gap-1 text-xs text-muted mt-0.5">
                        <Clock className="h-3 w-3" /> {g.deadline}
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-gray-900">{percent}%</span>
                </div>
                
                <div className="mt-auto">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted">Saved: <span className="font-medium text-ink">৳{g.saved.toLocaleString()}</span></span>
                    <span className="text-muted">Target: <span className="font-medium text-ink">৳{g.target.toLocaleString()}</span></span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2.5 w-full rounded-full bg-line overflow-hidden mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : (g.color || "bg-brand-500")}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  {/* Add Funds Button */}
                  {!isComplete && (
                    <button 
                      onClick={() => { setSelectedGoal(g); setIsAddFundsOpen(true); }}
                      className="w-full flex items-center justify-center gap-1 rounded-lg bg-gray-50 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors border border-gray-100"
                    >
                      <Plus className="h-4 w-4" /> Add Funds
                    </button>
                  )}
                  {isComplete && (
                    <div className="w-full text-center py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg">
                      Goal Reached! 🎉
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted">No goals created yet. Click "Create Goal" to set a new target.</p>
        )}
      </div>

      {/* Add Funds Modal */}
      {isAddFundsOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Funds to {selectedGoal.title}</h2>
              <button onClick={() => setIsAddFundsOpen(false)} className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500 hover:text-red-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddFunds} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount to Add (৳)</label>
                <input 
                  type="number" step="any" required placeholder="Enter amount..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-brand-500 transition-colors"
                  value={amountToAdd} 
                  onChange={(e) => setAmountToAdd(e.target.value)}
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">Current Saved:</span>
                <span className="font-semibold text-gray-900">৳{selectedGoal.saved.toLocaleString()}</span>
              </div>

              <button type="submit" disabled={addLoading}
                className="mt-4 w-full rounded-xl bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-70 transition-colors"
              >
                {addLoading ? "Adding..." : "Add to Goal"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}