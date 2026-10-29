"use client";
import { User, Shield, Globe, LogOut, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted">Manage your account preferences and security.</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-6 py-4 flex items-center gap-2">
          <User className="h-5 w-5 text-brand-600" />
          <h2 className="font-semibold text-lg">Profile Information</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
              SJ
            </div>
            <div>
              <p className="font-medium text-lg text-ink">Mubashir Jawad</p>
              <p className="text-sm text-muted">mubashirjawad23@gmail.com</p>
            </div>
            <button className="ml-auto rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-canvas transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="rounded-2xl border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-6 py-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-brand-600" />
          <h2 className="font-semibold text-lg">Preferences</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">Default Currency</p>
              <p className="text-sm text-muted">Set your preferred currency for transactions.</p>
            </div>
            <select className="w-full sm:w-auto rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 cursor-pointer">
              <option>Bangladeshi Taka (৳)</option>
              <option>US Dollar ($)</option>
              <option>Euro (€)</option>
            </select>
          </div>
          
          <hr className="border-line" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">App Theme</p>
              <p className="text-sm text-muted">Choose your preferred visual style.</p>
            </div>
            <select className="w-full sm:w-auto rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 cursor-pointer">
              <option>Light Mode</option>
              <option>Dark Mode</option>
              <option>System Default</option>
            </select>
          </div>
          
          <hr className="border-line" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">Notifications</p>
              <p className="text-sm text-muted">Manage email and push notifications.</p>
            </div>
            <button className="w-full sm:w-auto rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-canvas transition-colors">
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Security & Account Section */}
      <div className="rounded-2xl border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-6 py-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand-600" />
          <h2 className="font-semibold text-lg">Security & Account</h2>
        </div>
        <div className="p-6 space-y-4">
          <button className="flex w-full items-center justify-between rounded-lg border border-line px-4 py-3 text-left text-sm font-medium hover:bg-canvas transition-colors">
            <span className="text-ink">Change Password</span>
            <span className="text-muted">→</span>
          </button>
          <button className="flex w-full items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}