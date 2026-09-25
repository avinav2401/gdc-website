"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
  const router = useRouter();
  const [isMember, setIsMember] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrorMsg(""); // Clear error when typing
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        // Save auth state
        localStorage.setItem('gdc_role', data.role);
        if (data.name) {
          localStorage.setItem('gdc_name', data.name);
        }
        if (data.email) {
          localStorage.setItem('gdc_email', data.email);
        }
        if (data.role === 'admin') {
          localStorage.setItem('gdc_admin_auth', 'true');
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSubmitted(true);
        localStorage.setItem('gdc_role', data.role);
        if (data.name) {
          localStorage.setItem('gdc_name', data.name);
        }
        if (data.email) {
          localStorage.setItem('gdc_email', data.email);
        }
        localStorage.setItem('gdc_admin_auth', 'false'); // Members are never admin
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setErrorMsg(data.error || "Google Login failed");
      }
    } catch (err) {
      setErrorMsg("Network error with Google Login. Please try again.");
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
          <img src="/logo.png" alt="GDC" className="w-16 h-16 rounded-2xl mx-auto mb-4" />
          <p className="font-display text-2xl uppercase tracking-widest text-gray-400">Game Developers Community</p>
        </div>

        <div className="bg-[#111118] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-[#27272a]">
            <button 
              onClick={() => { setIsMember(true); setErrorMsg(""); }}
              className={`flex-1 py-4 font-display text-xl uppercase tracking-wider text-center transition ${isMember ? 'bg-[var(--primary)] text-black' : 'text-gray-400 hover:bg-white/5'}`}
            >
              Member
            </button>
            <button 
              onClick={() => { setIsMember(false); setErrorMsg(""); }}
              className={`flex-1 py-4 font-display text-xl uppercase tracking-wider text-center transition ${!isMember ? 'bg-[var(--secondary)] text-black' : 'text-gray-400 hover:bg-white/5'}`}
            >
              Admin
            </button>
          </div>

          <div className="p-8">
            {submitted ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎮</div>
                <h2 className="font-display text-3xl uppercase text-[var(--primary)] mb-2">
                  Welcome to GDC!
                </h2>
                <p className="text-gray-400 mb-6">
                  You're logged in. Redirecting...
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm font-semibold text-center">
                    {errorMsg}
                  </div>
                )}
                
                {isMember ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <p className="text-gray-400 mb-6 text-center">Join or sign in with your Google account.</p>
                    {loading ? (
                      <div className="text-[var(--primary)] font-display text-xl uppercase animate-pulse">Loading...</div>
                    ) : (
                      <GoogleLogin 
                        onSuccess={handleGoogleSuccess} 
                        onError={() => setErrorMsg("Google Login failed")}
                        theme="filled_black"
                        size="large"
                        shape="circle"
                      />
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleAdminSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Admin Email</label>
                      <input
                        type="email" required placeholder="admin@domain.com"
                        value={form.email} onChange={set("email")}
                        autoComplete="off"
                        className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1.5">Password</label>
                      <input
                        type="password" required placeholder="••••••••"
                        value={form.password} onChange={set("password")}
                        autoComplete="new-password"
                        className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30 transition"
                      />
                    </div>

                    <button
                      type="submit" disabled={loading}
                      className="w-full py-3.5 bg-[var(--secondary)] text-black font-display text-xl uppercase rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Admin Login →"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Admins manage games. Members submit games.
        </p>
      </div>
    </div>
  );
}
