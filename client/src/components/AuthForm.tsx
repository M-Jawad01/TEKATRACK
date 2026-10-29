"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(mode, "Data:", formData);
    alert(`${mode} button clicked! Data is in console.`);
  };

  const inputClass = "w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white transition-colors";

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-canvas">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-2xl border border-line bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="h-8 w-8 text-brand-500" />
          <span className="text-2xl font-bold">TekaTrack</span>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold">{mode === "login" ? "Welcome back" : "Create an account"}</h1>
          <p className="text-sm text-muted mt-1">
            {mode === "login" ? "Enter your details to access your account." : "Start tracking your finances today."}
          </p>
        </div>

        {mode === "register" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Full Name</label>
            <input 
              className={inputClass} placeholder="John Doe" 
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required 
            />
          </div>
        )}
        
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email Address</label>
          <input 
            className={inputClass} type="email" placeholder="you@example.com" 
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required 
          />
        </div>
        
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
          <input 
            className={inputClass} type="password" placeholder="••••••••" minLength={6}
            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required 
          />
        </div>

        <button type="submit" className="mt-2 w-full rounded-xl bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-500 shadow-sm transition-colors">
          {mode === "login" ? "Log in" : "Sign up"}
        </button>

        <p className="text-center text-sm text-muted mt-4">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <Link href={mode === "login" ? "/register" : "/login"} className="font-medium text-brand-600 hover:underline">
            {mode === "login" ? "Sign up" : "Log in"}
          </Link>
        </p>
      </form>
    </div>
  );
}