"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [role, setRole] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("gdc_role");
    localStorage.removeItem("gdc_admin_auth");
    setRole(null);
    setIsAuth(false);
    window.location.href = "/auth";
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
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const navLinks = [
    { href: "/games", label: "Games" },
    { href: "/events", label: "Events" },
    { href: "/team", label: "Team" },
    
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b-4 border-[#00F2FE] transition-all duration-200 ${
        scrolled ? "bg-[#07080D]/95 backdrop-blur-md" : "bg-[#07080D]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="GDC Logo"
            className="w-10 h-10 border-2 border-white [image-rendering:pixelated] group-hover:scale-105 transition-transform shadow-[2px_2px_0px_#FF007F]"
          />
          <div className="flex flex-col leading-none">
            <span className="font-black text-2xl tracking-widest text-white uppercase">
              GDC
            </span>
            <span className="text-[9px] text-[#00F2FE] uppercase tracking-[0.2em] font-bold">
              Game Dev Community
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 font-bold text-sm uppercase tracking-wider text-gray-300 hover:text-[#00F2FE] hover:bg-white/5 transition-all border border-transparent hover:border-[#00F2FE]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!role ? (
            <Link
              href="/auth"
              className="px-4 py-1.5 font-bold text-sm uppercase tracking-wider text-white border-2 border-white hover:bg-white hover:text-black transition-all shadow-[3px_3px_0px_#FF007F] hover:translate-y-[-2px]"
            >
              Login
            </Link>
          ) : role === "admin" ? (
            <Link
              href="/admin"
              className="px-4 py-1.5 font-bold text-sm uppercase tracking-wider text-black bg-[#00F2FE] border-2 border-[#00F2FE] hover:bg-white transition-all shadow-[3px_3px_0px_#FF007F] hover:translate-y-[-2px]"
            >
              Admin Portal
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="px-4 py-1.5 font-bold text-sm uppercase tracking-wider text-white border-2 border-white hover:bg-white hover:text-black transition-all shadow-[3px_3px_0px_#FF007F] hover:translate-y-[-2px]"
            >
              Dashboard
            </Link>
          )}
          {role && (
            <Link
              href="/dashboard"
              className="px-4 py-1.5 font-bold text-sm uppercase tracking-wider bg-[#FF007F] text-white border-2 border-white hover:bg-[#00F2FE] hover:text-black transition-all shadow-[3px_3px_0px_#00F2FE] hover:translate-y-[-2px]"
            >
              Submit Game
            </Link>
          )}
          {role && (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 font-bold text-sm uppercase tracking-wider text-gray-400 hover:text-white transition-all ml-2"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 border-2 border-[#00F2FE] text-[#00F2FE] bg-[#0D0E17] hover:bg-[#00F2FE] hover:text-black transition-all shadow-[2px_2px_0px_#FF007F]"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Panel */}
      {open && (
        <div className="md:hidden border-t-4 border-[#FF007F] bg-[#07080D] px-4 py-4 space-y-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 font-bold text-base uppercase tracking-wider text-white border-2 border-white/20 hover:border-[#00F2FE] hover:text-[#00F2FE] hover:bg-[#0D0E17] transition-all"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {!role ? (
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2.5 font-bold text-base uppercase tracking-wider text-white border-2 border-white hover:bg-white hover:text-black transition-all shadow-[3px_3px_0px_#FF007F]"
              >
                Login
              </Link>
            ) : role === "admin" ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2.5 font-bold text-base uppercase tracking-wider text-black bg-[#00F2FE] border-2 border-[#00F2FE] hover:bg-white transition-all shadow-[3px_3px_0px_#FF007F]"
              >
                Admin Portal
              </Link>
            ) : (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2.5 font-bold text-base uppercase tracking-wider text-white border-2 border-white hover:bg-white hover:text-black transition-all shadow-[3px_3px_0px_#FF007F]"
              >
                Dashboard
              </Link>
            )}
            {role && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2.5 font-bold text-base uppercase tracking-wider bg-[#FF007F] text-white border-2 border-white hover:bg-[#00F2FE] hover:text-black transition-all shadow-[3px_3px_0px_#00F2FE]"
              >
                Submit Game
              </Link>
            )}
            {role && (
              <button
                onClick={handleLogout}
                className="block w-full text-center px-4 py-2.5 font-bold text-base uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/10 transition-all mt-2"
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