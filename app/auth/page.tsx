"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrorMsg(""); // Clear error when typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        // Save auth state
        localStorage.setItem('gdc_role', data.role); // "admin" or "member"
        if (data.role === 'admin') {
          localStorage.setItem('gdc_admin_auth', 'true'); // For legacy admin checks
        } else {
          localStorage.setItem('gdc_admin_auth', 'false');
        }
        
        // Redirect based on role
        setTimeout(() => {
          if (data.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }, 1500);
      } else {
        setErrorMsg(data.error || "Login failed");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center bg-[var(--bg)] py-12 px-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="GDC" className="w-16 h-16 rounded-2xl mx-auto mb-4" />
          <p className="font-display text-2xl uppercase tracking-widest text-gray-400">Game Developers Community</p>
        </div>

        <div className="bg-[#111118] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-[#27272a]">
            <div className="flex-1 py-4 font-display text-xl uppercase tracking-wider text-center bg-[var(--primary)] text-black">
              Member & Admin Login
            </div>
          </div>

          <div className="p-8">
            {submitted ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎮</div>
                <h2 className="font-display text-3xl uppercase text-[var(--primary)] mb-2">
                  Welcome Back!
                </h2>
                <p className="text-gray-400 mb-6">
                  You're logged in. Redirecting...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm font-semibold text-center">
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input
                    type="email" required placeholder="member@college.edu"
                    value={form.email} onChange={set("email")}
                    className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">Password <span className="text-red-400">*</span></label>
                  <input
                    type="password" required placeholder="••••••••"
                    value={form.password} onChange={set("password")}
                    className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[var(--primary)] text-black font-display text-xl uppercase rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Sign In →"}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Admins will be redirected to the Control Center. Members to the Dashboard.
        </p>
      </div>
    </div>
  );
}
