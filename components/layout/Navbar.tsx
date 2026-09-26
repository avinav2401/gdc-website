"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitGameModal } from "@/components/ui/SubmitGameModal";

export function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [role, setRole] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("gdc_role");
    localStorage.removeItem("gdc_admin_auth");
    localStorage.removeItem("gdc_name");
    localStorage.removeItem("gdc_email");
    localStorage.removeItem("gdc_github");
    localStorage.removeItem("gdc_portfolio");
    localStorage.removeItem("gdc_bio");
    setRole(null);
    setIsAuth(false);
    router.push("/auth");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    setRole(localStorage.getItem("gdc_role"));
    setIsAuth(localStorage.getItem("gdc_admin_auth") === "true");
    
    // Listen for storage changes in case of logout/login in another tab
    const handleStorage = () => {
      setRole(localStorage.getItem("gdc_role"));
      setIsAuth(localStorage.getItem("gdc_admin_auth") === "true");
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-change", handleStorage);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-change", handleStorage);
    };
  }, []);

  const navLinks = [
    { href: "/games", label: "Games" },
    { href: "/events", label: "Events" },
    { href: "/team", label: "Team" },
    
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-[#07080D]/80 backdrop-blur-xl border-[#00F2FE]/50 shadow-[0_4px_30px_rgba(0,242,254,0.15)]" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#00F2FE] to-[#FF007F] opacity-0 group-hover:opacity-40 blur-lg transition duration-500 rounded-full" />
          <img
            src="/logo.png"
            alt="GDC Logo"
            className="w-10 h-10 border-2 border-white/80 [image-rendering:pixelated] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,127,0.5)] relative z-10"
          />
          <div className="flex flex-col leading-none relative z-10">
            <span className="font-black text-xl sm:text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-[#00F2FE] group-hover:to-white transition-all uppercase drop-shadow-md">
              GDC
            </span>
            <span className="text-[7px] sm:text-[9px] text-[#00F2FE] uppercase tracking-[0.2em] font-bold group-hover:text-[#FF007F] transition-colors">
              Game Dev Community
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-2 py-1 font-bold text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors group overflow-hidden"
            >
              <span className="relative z-10">{label}</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00F2FE] to-[#FF007F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!role ? (
            <Link
              href="/auth"
              className="relative group px-5 py-2 font-bold text-xs uppercase tracking-widest text-white overflow-hidden rounded-sm border border-white/20 bg-white/5 hover:border-[#FF007F]/50 transition-all"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF007F]/20 to-[#00F2FE]/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
              <span className="relative z-10 drop-shadow-md">Login</span>
            </Link>
          ) : role === "admin" ? (
            <Link
              href="/admin"
              className="relative group px-5 py-2 font-bold text-xs uppercase tracking-widest text-black bg-[#00F2FE] overflow-hidden rounded-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,242,254,0.4)] hover:shadow-[0_0_25px_rgba(0,242,254,0.6)]"
            >
              <span className="relative z-10">Admin Portal</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="relative group px-5 py-2 font-bold text-xs uppercase tracking-widest text-white overflow-hidden rounded-sm border border-white/20 bg-white/5 hover:border-[#00F2FE]/50 transition-all"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#00F2FE]/20 to-[#FF007F]/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
              <span className="relative z-10 drop-shadow-md">Dashboard</span>
            </Link>
          )}
          
          {role && (
            <button
              onClick={() => setShowModal(true)}
              className="relative group px-5 py-2 font-bold text-xs uppercase tracking-widest text-white bg-[#FF007F] overflow-hidden rounded-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:shadow-[0_0_25px_rgba(255,0,127,0.6)]"
            >
              <span className="relative z-10">Submit Game</span>
            </button>
          )}
          
          {role && (
            <button
              onClick={handleLogout}
              className="px-3 py-2 font-bold text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Panel */}
      {open && (
        <div className="md:hidden bg-[#07080D]/95 backdrop-blur-xl border-b border-[#00F2FE]/20 px-4 py-6 space-y-4 shadow-2xl absolute top-full left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 font-bold text-sm uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors border-l-2 border-transparent hover:border-[#00F2FE]"
              >
                {label}
              </Link>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-800/50 flex flex-col gap-3">
            {!role ? (
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 font-bold text-sm uppercase tracking-widest text-white bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
            ) : role === "admin" ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 font-bold text-sm uppercase tracking-widest text-black bg-[#00F2FE] rounded-sm shadow-[0_0_15px_rgba(0,242,254,0.3)]"
              >
                Admin Portal
              </Link>
            ) : (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 font-bold text-sm uppercase tracking-widest text-white bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors"
              >
                Dashboard
              </Link>
            )}
            
            {role && (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowModal(true);
                }}
                className="block w-full text-center px-4 py-3 font-bold text-sm uppercase tracking-widest text-white bg-[#FF007F] rounded-sm shadow-[0_0_15px_rgba(255,0,127,0.3)]"
              >
                Submit Game
              </button>
            )}
            
            {role && (
              <button
                onClick={handleLogout}
                className="block w-full text-center px-4 py-3 font-bold text-sm uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 rounded-sm transition-colors mt-2 pb-8"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <SubmitGameModal 
          onClose={() => setShowModal(false)} 
          onSubmit={async (data) => {
            const userEmail = localStorage.getItem("gdc_email") || "";
            const userName = localStorage.getItem("gdc_name") || "Developer";
            const payload = { ...data, userEmail, developer: userName };
            await fetch("/api/games", { method: "POST", body: JSON.stringify(payload) });
            // Let the modal show the "Submitted!" state without automatically closing
          }} 
        />
      )}
    </nav>
  );
}