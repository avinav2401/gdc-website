"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
          <img src="/logo.png" alt="GDC" className="w-16 h-16 rounded-2xl mx-auto mb-4" />
          <p className="font-display text-2xl uppercase tracking-widest text-gray-400">Game Developers Community</p>
        </div>

        <div className="bg-[#111118] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden">
          {/* Mode Toggle */}
          <div className="flex border-b border-[#27272a]">
            {(["login", "register"] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setSubmitted(false); }}
                className={`flex-1 py-4 font-display text-xl uppercase tracking-wider transition ${
                  mode === m
                    ? "bg-[var(--primary)] text-black"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          <div className="p-8">
            {submitted ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">{mode === "login" ? "🎮" : "🎉"}</div>
                <h2 className="font-display text-3xl uppercase text-[var(--primary)] mb-2">
                  {mode === "login" ? "Welcome Back!" : "Request Sent!"}
                </h2>
                <p className="text-gray-400 mb-6">
                  {mode === "login"
                    ? "You're logged in. Redirecting to your dashboard..."
                    : "Your access request has been submitted. An admin will approve your account."}
                </p>
                {mode === "login" && (
                  <Link href="/dashboard"
                        className="inline-block px-8 py-3 bg-[var(--primary)] text-black font-display text-xl uppercase rounded-xl hover:opacity-90 transition">
                    Go to Dashboard →
                  </Link>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "register" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <input
                      type="text" required placeholder="Ankit Mandal"
                      value={form.name} onChange={set("name")}
                      className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input
                    type="email" required placeholder="dev@college.edu"
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

                {mode === "register" && (
                  <p className="text-xs text-gray-600 border border-[#27272a] rounded-lg p-3">
                    Access is restricted to approved GDC members. After submitting, an admin will review and activate your account.
                  </p>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[var(--primary)] text-black font-display text-xl uppercase rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                >
                  {loading ? "Loading..." : mode === "login" ? "Sign In →" : "Request Access →"}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          {mode === "login"
            ? <>Not a member? <button onClick={() => setMode("register")} className="text-[var(--primary)] hover:underline">Request access</button></>
            : <>Already have an account? <button onClick={() => setMode("login")} className="text-[var(--primary)] hover:underline">Sign in</button></>
          }
        </p>
      </div>
    </div>
  );
}
