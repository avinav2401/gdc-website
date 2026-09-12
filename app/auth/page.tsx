"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      localStorage.setItem('gdc_admin_auth', 'true');
    }, 1200);
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
              Admin Login
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
                  You're logged in. Redirecting to the admin portal...
                </p>
                <Link href="/admin"
                      className="inline-block px-8 py-3 bg-[var(--primary)] text-black font-display text-xl uppercase rounded-xl hover:opacity-90 transition">
                  Go to Admin Portal →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input
                    type="email" required placeholder="admin@college.edu"
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
          Access is restricted to GDC Core Team.
        </p>
      </div>
    </div>
  );
}
