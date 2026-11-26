"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Globe, Shield, LogOut, ArrowRight, X } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "Loading...",
    email: "...",
  });
  const [loading, setLoading] = useState(true);

  // Preferences States
  const [currency, setCurrency] = useState("BDT");
  const [theme, setTheme] = useState("light");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  // Modals States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Form States
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Helper function to apply theme to HTML root
 const applyThemeToDOM = (selectedTheme: string) => {
    const root = document.documentElement;
    const shouldBeDark =
      selectedTheme === "dark" ||
      (selectedTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (shouldBeDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedCurrency = localStorage.getItem("pref_currency") || "BDT";
    const savedTheme = localStorage.getItem("pref_theme") || "light";
    setCurrency(savedCurrency);
    setTheme(savedTheme);
    applyThemeToDOM(savedTheme);

    // Fetch user profile from Backend
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setProfileForm({ name: data.name, email: data.email });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Sync dropdown if user clicks the Moon/Sun icon in Topbar
    const observer = new MutationObserver(() => {
      const currentSaved = localStorage.getItem("pref_theme") || "light";
      setTheme(currentSaved);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // get name initials (ex: Mubashir Jawad -> MJ)
  const getInitials = (name: string) => {
    if (!name || name === "Loading...") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Update Profile Handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Profile updated successfully!");
        setIsEditProfileOpen(false);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (error) {
      alert("Server connection failed!");
    } finally {
      setSubmitting(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return alert("New passwords do not match!");
    }
    if (passwordForm.newPassword.length < 6) {
      return alert("Password must be at least 6 characters long.");
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully!");
        setIsPasswordModalOpen(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(data.error || "Failed to change password");
      }
    } catch (error) {
      alert("Server connection failed!");
    } finally {
      setSubmitting(false);
    }
  };

  // Sign Out Handler
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-brand-600 transition-colors";

  return (
    <div className="max-w-4xl space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">Manage your account preferences and security.</p>
      </div>

      {/* 1. Profile Information Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-6 py-4">
          <User className="h-5 w-5 text-brand-600" />
          <h2 className="font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
              {getInitials(user.name)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* 2. Preferences Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-6 py-4">
          <Globe className="h-5 w-5 text-brand-600" />
          <h2 className="font-semibold text-gray-900">Preferences</h2>
        </div>
        <div className="divide-y divide-gray-100 px-6">
          {/* Default Currency */}
          <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Default Currency</h3>
              <p className="text-sm text-gray-500">Set your preferred currency for transactions.</p>
            </div>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                localStorage.setItem("pref_currency", e.target.value);
              }}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-brand-600"
            >
              <option value="BDT">Bangladeshi Taka (৳)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          {/* App Theme (Interactive Dark/Light/System Mode) */}
          <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium text-gray-900">App Theme</h3>
              <p className="text-sm text-gray-500">Choose your preferred visual style.</p>
            </div>
            <select
              value={theme}
              onChange={(e) => {
                const selectedTheme = e.target.value;
                setTheme(selectedTheme);
                localStorage.setItem("pref_theme", selectedTheme);
                applyThemeToDOM(selectedTheme);
              }}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-brand-600"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="system">System Default</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Manage email and push notifications.</p>
            </div>
            <button
              onClick={() => setIsNotifModalOpen(true)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* 3. Security & Account Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-6 py-4">
          <Shield className="h-5 w-5 text-brand-600" />
          <h2 className="font-semibold text-gray-900">Security & Account</h2>
        </div>
        <div className="space-y-3 p-6">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <span>Change Password</span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </button>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600 hover:bg-red-100/80 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  className={inputClass}
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  className={inputClass}
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-xl bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-70"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CHANGE PASSWORD MODAL --- */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  className={inputClass}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  className={inputClass}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  className={inputClass}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-xl bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-70"
              >
                {submitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- NOTIFICATIONS MODAL --- */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Notification Settings</h2>
              <button
                onClick={() => setIsNotifModalOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-xs text-gray-500">Receive monthly reports and budget warnings</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="h-5 w-5 accent-brand-600"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Goal Reminders</p>
                  <p className="text-xs text-gray-500">Get notified before goal deadlines</p>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotif}
                  onChange={(e) => setPushNotif(e.target.checked)}
                  className="h-5 w-5 accent-brand-600"
                />
              </label>
              <button
                onClick={() => {
                  alert("Notification preferences saved!");
                  setIsNotifModalOpen(false);
                }}
                className="mt-2 w-full rounded-xl bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}