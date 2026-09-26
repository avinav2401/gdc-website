"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-4 ${
        scrolled 
          ? "bg-[#0B0C15] border-[#00F2FE] shadow-[0_4px_0px_rgba(0,242,254,0.5)]" 
          : "bg-[#07080D] border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <img
            src="/logo.png"
            alt="GDC Logo"
            className="w-10 h-10 border-2 border-white [image-rendering:pixelated] group-hover:scale-110 transition-transform duration-200 shadow-[2px_2px_0_#FF007F] group-hover:shadow-[4px_4px_0_#00F2FE] relative z-10"
          />
          <div className="flex flex-col leading-none relative z-10">
            <span className="font-arcade text-xl sm:text-2xl tracking-widest text-white group-hover:text-[#00F2FE] transition-colors drop-shadow-[2px_2px_0_#FF007F]">
              GDC
            </span>
            <span className="text-[7px] sm:text-[9px] text-[#00F2FE] font-arcade tracking-[0.2em] group-hover:text-[#FF007F] transition-colors">
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
              className="font-arcade text-sm uppercase tracking-widest text-gray-300 hover:text-white hover:drop-shadow-[2px_2px_0_#00F2FE] transition-all"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!role ? (
            <Link
              href="/auth"
              className="px-4 py-2 font-arcade text-xs text-white border-2 border-white hover:bg-white hover:text-black transition-colors shadow-[2px_2px_0_#FF007F] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#FF007F]"
            >
              Login
            </Link>
          ) : role === "admin" ? (
            <Link
              href="/admin"
              className="px-4 py-2 font-arcade text-xs text-black bg-[#00F2FE] border-2 border-[#00F2FE] hover:bg-white hover:border-white transition-colors shadow-[2px_2px_0_#FF007F] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#FF007F]"
            >
              Admin Portal
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="px-4 py-2 font-arcade text-xs text-white border-2 border-white hover:bg-white hover:text-black transition-colors shadow-[2px_2px_0_#FF007F] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#FF007F]"
            >
              Dashboard
            </Link>
          )}
          
          {role && (
            <Link
              href="/dashboard"
              className="px-4 py-2 font-arcade text-xs text-white bg-[#FF007F] border-2 border-[#FF007F] hover:bg-[#00F2FE] hover:border-[#00F2FE] hover:text-black transition-colors shadow-[2px_2px_0_#00F2FE] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#00F2FE]"
            >
              Submit Game
            </Link>
          )}
          
          {role && (
            <button
              onClick={handleLogout}
              className="font-arcade text-xs text-gray-500 hover:text-white transition-colors"
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
        <div className="md:hidden bg-[#0B0C15] border-b-4 border-[#00F2FE] px-4 py-6 space-y-4 shadow-[0_10px_0px_rgba(0,242,254,0.3)] absolute top-full left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block font-arcade text-sm text-gray-300 hover:text-white hover:drop-shadow-[2px_2px_0_#00F2FE] transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 border-t-2 border-[#FF007F]/30 flex flex-col gap-4">
            {!role ? (
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 font-arcade text-sm text-white border-2 border-white hover:bg-white hover:text-black transition-colors shadow-[2px_2px_0_#FF007F]"
              >
                Login
              </Link>
            ) : role === "admin" ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 font-arcade text-sm text-black bg-[#00F2FE] border-2 border-[#00F2FE] hover:bg-white hover:border-white transition-colors shadow-[2px_2px_0_#FF007F]"
              >
                Admin Portal
              </Link>
            ) : (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 font-arcade text-sm text-white border-2 border-white hover:bg-white hover:text-black transition-colors shadow-[2px_2px_0_#FF007F]"
              >
                Dashboard
              </Link>
            )}
            
            {role && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 font-arcade text-sm text-white bg-[#FF007F] border-2 border-[#FF007F] hover:bg-[#00F2FE] hover:border-[#00F2FE] hover:text-black transition-colors shadow-[2px_2px_0_#00F2FE]"
              >
                Submit Game
              </Link>
            )}
            
            {role && (
              <button
                onClick={handleLogout}
                className="block w-full text-center px-4 py-3 font-arcade text-sm text-gray-500 hover:text-white transition-colors pb-8"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}