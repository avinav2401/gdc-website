"use client";

import React from "react";
import Link from "next/link";
import { EventTimeline } from "@/components/ui/EventTimeline";
import { clubMeta, events, games, socials } from "@/lib/data";
import {
  ExternalLink,
  Mail,
  MessageSquare,
  Sparkles,
  Gamepad2,
  Rocket,
  Heart,
  Send,
  Check,
  Flame,
  Zap,
  Compass,
  Target,
} from "lucide-react";

// ═══ CUSTOM PIXEL ART & GRAPHIC SVGs ════════════════════════════════════════
function PixelControllerSVG() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7 md:w-8 md:h-8 shrink-0 text-[#00F2FE]"
    >
      {/* Bold Single-Color Controller Body */}
      <path
        d="M3 3h10v1h2v2h1v5h-2v3h-3v-2H5v2H2v-3H0V6h1V4h2V3z"
        fill="currentColor"
      />
      {/* D-Pad Cutout */}
      <rect x="3" y="6" width="3" height="1" fill="#0D0E17" />
      <rect x="4" y="5" width="1" height="3" fill="#0D0E17" />

      {/* Buttons Cutout */}
      <rect x="12" y="5" width="1" height="1" fill="#0D0E17" />
      <rect x="10" y="7" width="1" height="1" fill="#0D0E17" />

      {/* Center Select/Start */}
      <rect x="7" y="7" width="2" height="1" fill="#0D0E17" />
    </svg>
  );
}

function ComicHalftoneBG() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="halftone-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="#00F2FE" />
          <circle cx="12" cy="12" r="2.5" fill="#FF007F" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#halftone-dots)" />
    </svg>
  );
}

function PixelMembersSVG() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 md:w-9 md:h-9 shrink-0 text-[#FF007F]"
    >
      {/* Center Member (Main) */}
      <rect x="6" y="1" width="4" height="4" fill="currentColor" />
      <rect x="5" y="6" width="6" height="2" fill="currentColor" />
      <rect x="6" y="8" width="4" height="7" fill="currentColor" />

      {/* Left Member */}
      <rect x="1" y="4" width="3" height="3" fill="currentColor" opacity="0.85" />
      <rect x="0" y="8" width="4" height="6" fill="currentColor" opacity="0.85" />

      {/* Right Member */}
      <rect x="12" y="4" width="3" height="3" fill="currentColor" opacity="0.85" />
      <rect x="12" y="8" width="4" height="6" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
function PixelPuzzleSVG() {
  return (
    <svg
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 text-[#00F2FE]"
    >
      {/* 100% Transparent Single-Path Pixel Puzzle Piece */}
      <path
        d="M3 4h3V1h4v3h3v3h3v4h-3v3h-3v-3H6v3H3v-3h3V7H3V4z"
        fill="currentColor"
      />
    </svg>
  );
}
function PixelHeartSVG() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 text-[#FF007F]"
    >
      {/* Main Heart Body */}
      <path
        d="M2 3h4v2h2V3h4v2h2v4h-2v2h-2v2H8v2H7v-2H5v-2H3v-2H1V5h1V3z"
        fill="currentColor"
      />
      {/* Top-Left Retro White Specular Highlight */}
      <rect x="3" y="4" width="2" height="2" fill="#FFFFFF" />
    </svg>
  );
}

// ═══ SUB-COMPONENT: ABOUT & COMMUNITY SECTION ══════════════════════════════

function AboutAndCommunitySection() {
  return (
    <div className="relative bg-[#07080D] text-white selection:bg-[#FF007F] selection:text-white font-mono overflow-hidden">
      {/* COMMUNITY STATS */}
      <section className="relative py-16 md:py-20 px-4 md:px-6 bg-[#0A0B12]">
        <ComicHalftoneBG />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-4 mb-3">
            <span className="h-[2px] w-12 bg-gray-700" />
            <span className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-gray-400">
              OUR COMMUNITY
            </span>
            <span className="h-[2px] w-12 bg-gray-700" />
          </div>

          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-10 md:mb-12 leading-[0.95]">
            BUILT BY STUDENTS, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] via-[#FF9F43] to-[#FF007F] drop-shadow-[4px_4px_0px_#000]">
              FOR STUDENTS
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-[#0D0E17] border-4 border-[#FF007F] p-6 md:p-8 flex flex-col items-center justify-center relative shadow-[6px_6px_0px_#FF007F] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[10px_10px_0px_#FF007F] transition-all group">
              <div className="mb-4 p-3 bg-[#07080D] border-2 border-[#FF007F] group-hover:scale-110 transition-transform">
                <PixelMembersSVG />
              </div>
              <span className="text-5xl md:text-6xl font-black text-[#FF007F] mb-2 tracking-tighter drop-shadow-[2px_2px_0px_#000]">
                60+
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                ACTIVE MEMBERS
              </span>
            </div>

            <div className="bg-[#0D0E17] border-4 border-[#00F2FE] p-6 md:p-8 flex flex-col items-center justify-center relative shadow-[6px_6px_0px_#00F2FE] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[10px_10px_0px_#00F2FE] transition-all group">
              <div className="mb-4 p-3 bg-[#07080D] border-2 border-[#00F2FE] group-hover:scale-110 transition-transform">
                <PixelPuzzleSVG />
              </div>
              <span className="text-5xl md:text-6xl font-black text-[#00F2FE] mb-2 tracking-tighter drop-shadow-[2px_2px_0px_#000]">
                10+
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                EVENTS & JAMS
              </span>
            </div>

            <div className="bg-[#0D0E17] border-4 border-[#FF9F43] p-6 md:p-8 flex flex-col items-center justify-center relative shadow-[6px_6px_0px_#FF9F43] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[10px_10px_0px_#FF9F43] transition-all group">
              <div className="mb-4 p-3 bg-[#07080D] border-2 border-[#FF9F43] group-hover:scale-110 transition-transform">
                <PixelHeartSVG />
              </div>
              <span className="text-5xl md:text-6xl font-black text-[#FF007F] mb-2 tracking-tighter drop-shadow-[2px_2px_0px_#000]">
                100%
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                FUN AND SATISFACTION
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION SECTION */}
      <section className="relative py-16 md:py-24 px-4 md:px-6 bg-[#07080D]">
        <ComicHalftoneBG />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-block bg-[#FF9F43] text-black font-black uppercase text-xs md:text-sm px-4 py-1.5 border-4 border-black mb-4 rotate-[-1.5deg] shadow-[4px_4px_0px_#FF007F]">
              ⚡ PHILOSOPHY & MANIFESTO
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-none">
              WHY WE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#FF007F] to-[#FF9F43] drop-shadow-[4px_4px_0px_#000]">EXIST</span>
            </h2>
            
            <div className="bg-[#0D0E17] border-4 border-[#00F2FE] p-5 shadow-[6px_6px_0px_#FF007F] relative">
              <p className="text-gray-200 font-sans text-base md:text-lg leading-relaxed">
                We reject the idea that standard academic tracks are the only way forward. Interactive media is the ultimate fusion of <span className="text-[#00F2FE] font-bold">code</span>, <span className="text-[#FF007F] font-bold">music</span>, <span className="text-[#FF9F43] font-bold">narrative</span>, and <span className="text-white font-bold underline decoration-[#00F2FE]">design</span>.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* VISION PANEL */}
            <div className="bg-[#0D0E17] border-4 border-[#00F2FE] p-6 md:p-10 relative shadow-[10px_10px_0px_#00F2FE] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_#00F2FE] transition-all flex flex-col justify-between">
              <div className="bg-[#00F2FE] text-black font-black uppercase text-sm px-4 py-1 border-4 border-black inline-flex items-center gap-2 absolute -top-5 left-6 rotate-[-2deg] shadow-[3px_3px_0px_#000]">
                <Compass className="w-4 h-4 stroke-[3]" /> Our Vision
              </div>

              <div>
                <h3 className="text-2xl md:text-4xl font-black uppercase text-white mt-4 mb-4 leading-tight flex items-center justify-between">
                  <span>A Legitimate Career Path</span>
                  <Zap className="w-8 h-8 text-[#00F2FE]" />
                </h3>
                
                <p className="text-gray-300 font-sans leading-relaxed text-base md:text-lg mb-6 border-b-2 border-gray-800 pb-6">
                  Transforming game development from an isolated bedroom hobby into an industry-grade discipline with studio dynamics and publishable outputs.
                </p>

                <ul className="space-y-3 font-sans text-sm text-gray-200 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="p-1 bg-[#00F2FE] text-black font-bold mt-0.5"><Check className="w-3.5 h-3.5 stroke-[4]" /></span>
                    <span><strong>Studio Dynamics:</strong> Cross-functional team setups mirroring real game studios.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="p-1 bg-[#00F2FE] text-black font-bold mt-0.5"><Check className="w-3.5 h-3.5 stroke-[4]" /></span>
                    <span><strong>Publishing Pipeline:</strong> Guiding titles to itch.io, Steam, and mobile stores.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="p-1 bg-[#00F2FE] text-black font-bold mt-0.5"><Check className="w-3.5 h-3.5 stroke-[4]" /></span>
                    <span><strong>Portfolio First:</strong> Graduate with shipped titles, not just certificates.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t-2 border-gray-800 flex items-center justify-between text-xs font-bold text-[#00F2FE] uppercase tracking-wider">
                <span>// DESTINATION: AAA & INDIE DOMINANCE</span>
                <span>01</span>
              </div>
            </div>

            {/* MISSION PANEL */}
            <div className="bg-[#0D0E17] border-4 border-[#FF007F] p-6 md:p-10 relative shadow-[10px_10px_0px_#FF007F] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_#FF007F] transition-all flex flex-col justify-between">
              <div className="bg-[#FF007F] text-white font-black uppercase text-sm px-4 py-1 border-4 border-white inline-flex items-center gap-2 absolute -top-5 left-6 rotate-[2deg] shadow-[3px_3px_0px_#000]">
                <Target className="w-4 h-4 stroke-[3]" /> Our Mission
              </div>

              <div>
                <h3 className="text-2xl md:text-4xl font-black uppercase text-white mt-4 mb-4 leading-tight flex items-center justify-between">
                  <span>Keep The Creative Kid Alive</span>
                  <Flame className="w-8 h-8 text-[#FF007F]" />
                </h3>
                
                <p className="text-gray-300 font-sans leading-relaxed text-base md:text-lg mb-6 border-b-2 border-gray-800 pb-6">
                  Never compromise on raw imagination. We create a safe haven for wild mechanics, experimental game loops, and artistic risks.
                </p>

                <ul className="space-y-3 font-sans text-sm text-gray-200 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="p-1 bg-[#FF007F] text-white font-bold mt-0.5"><Check className="w-3.5 h-3.5 stroke-[4]" /></span>
                    <span><strong>Zero Gatekeeping:</strong> Beginner-friendly hackathons & game jams.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="p-1 bg-[#FF007F] text-white font-bold mt-0.5"><Check className="w-3.5 h-3.5 stroke-[4]" /></span>
                    <span><strong>Experimental Freedom:</strong> Support for bizarre ideas and niche art styles.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="p-1 bg-[#FF007F] text-white font-bold mt-0.5"><Check className="w-3.5 h-3.5 stroke-[4]" /></span>
                    <span><strong>Burnout Prevention:</strong> Collaborative pacing and supportive guild leadership.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t-2 border-gray-800 flex items-center justify-between text-xs font-bold text-[#FF007F] uppercase tracking-wider">
                <span>// CORE CORE: PURE UNFILTERED PASSION</span>
                <span>02</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══ MAIN PAGE COMPONENT ═════════════════════════════════════════════════════

export default function HomePage() {
  const upcoming = [...events].sort((a, b) => a.dateSort.localeCompare(b.dateSort));
  const featuredGames = games.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#07080D] text-white selection:bg-[#FF007F] selection:text-white font-mono">

      {/* ═══ 1. HERO AREA ═══════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[750px] flex flex-col items-center justify-center overflow-hidden px-4">
  <ComicHalftoneBG />

  {/* Animated Background Image */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    <img
      src="/hero-bg.webp"
      alt="Hero Background"
      className="w-full h-full object-cover opacity-80 pointer-events-none"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#07080D]/10 via-[#07080D]/40 to-[#07080D]" />
  </div>

  {/* Hero Content */}
  <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center gap-5 w-full my-auto">
    
    <div className="inline-flex items-center gap-3 bg-[#0D0E17] border-4 border-[#00F2FE] px-5 py-2 rotate-[-2deg] shadow-[5px_5px_0px_#FF007F]">
      <PixelControllerSVG />
      <span className="font-bold text-sm md:text-base uppercase tracking-widest text-[#00F2FE]">
        Game Developers Community
      </span>
    </div>

    <h1 className="font-black text-5xl md:text-8xl tracking-tight uppercase leading-[0.95]">
      Ideas Become <br />
      <span 
        className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#FF007F] to-[#FF9F43]"
        style={{ filter: "drop-shadow(4px 4px 0px #000)" }}
      >
        Art
      </span>
    </h1>

    <p className="max-w-2xl text-base md:text-xl text-gray-300 font-sans leading-relaxed border-l-4 border-[#FF007F] pl-4 text-left my-2 bg-[#0D0E17]/80 p-3 shadow-[4px_4px_0px_#00F2FE]">
      Don't let anyone tell you it's <span className="text-[#FF007F] font-bold">"just a hobby."</span> We protect the creative kid inside you and turn game creation into a viable, high-impact career path.
    </p>

    <div className="flex flex-wrap justify-center gap-4 mt-2">
      <Link 
        href="#creations"
        className="px-8 py-4 bg-[#00F2FE] text-black font-extrabold text-lg uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_#FF007F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#FF007F] transition-all flex items-center gap-2"
      >
        <Gamepad2 className="w-6 h-6" /> Explore Games
      </Link>
      <Link 
        href="#contact"
        className="px-8 py-4 bg-[#FF007F] text-white font-extrabold text-lg uppercase tracking-wider border-4 border-white shadow-[6px_6px_0px_#FF007F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#FF007F] transition-all flex items-center gap-2"
      >
        <Sparkles className="w-6 h-6" /> Join The Guild
      </Link>
    </div>

  </div>
</section>

      {/* ═══ 2. ABOUT & COMMUNITY ═════════════════════════════════════════ */}
      <AboutAndCommunitySection />

{/* ═══ POST-WHY WE EXIST WEBP BANNER (FULL WIDTH) ═══════════════════ */}
<section className="relative w-full overflow-hidden bg-[#0D0E17] py-6 md:py-10">
  <div className="w-full border-y-4 border-[#00F2FE] bg-[#07080D] shadow-[0px_6px_0px_#FF007F] relative">
    <img
      src="/relax.webp"
      alt="Game Developers Community Showcase"
      className="w-full h-48 sm:h-64 md:h-80 lg:h-[350px] object-cover block [image-rendering:pixelated]"
      loading="lazy"
    />
  </div>
</section>

      {/* ═══ 3. FEATURED CREATIONS ════════════════════════════════════════ */}
<section id="creations" className="relative py-16 md:py-24 px-4 md:px-6 bg-[#0D0E17]">
  <div className="max-w-7xl mx-auto">
    
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-4">
      <div>
        <span className="bg-[#FF007F] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-white inline-block mb-2 shadow-[3px_3px_0px_#00F2FE]">
          Handpicked Projects
        </span>
        <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight">
          Featured <span className="text-[#00F2FE]">Creations</span>
        </h2>
      </div>
      <Link 
        href="/games" 
        className="text-[#FF9F43] hover:text-white font-bold uppercase tracking-wider border-b-2 border-[#FF9F43] flex items-center gap-1 transition-colors"
      >
        View All Games →
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      
      {/* 1. FLOW */}
      <div className="bg-[#07080D] border-4 border-[#00F2FE] flex flex-col justify-between p-5 relative shadow-[8px_8px_0px_#FF007F] transition-all hover:translate-y-[-4px]">
        <div>
          <div className="aspect-video bg-[#141622] border-2 border-white relative overflow-hidden flex items-center justify-center mb-4">
            <img
              src="/Flow.png" // <-- Replace with your image path
              alt="Flow"
              className="w-full h-full object-cover block [image-rendering:pixelated]"
              loading="lazy"
            />
            <span className="absolute top-2 right-2 bg-[#07080D]/90 text-[#00F2FE] border border-[#00F2FE] text-xs px-2 py-0.5 font-bold uppercase z-10 backdrop-blur-sm">
              Unity
            </span>
          </div>

          <h3 className="text-2xl font-black uppercase text-white mb-2">Flow</h3>
          <p className="text-sm text-gray-300 font-sans line-clamp-3 mb-4 leading-relaxed">
            A meditative particle playground — draw currents across the canvas and watch thousands of particles respond in real time. No score, no fail state, just flow.
          </p>
        </div>

        <div className="pt-4 border-t-2 border-gray-800 flex items-center justify-between">
          <span className="text-xs text-[#FF9F43] uppercase tracking-wider font-bold">
            By GDC Devs
          </span>
          <Link 
            href="/games/flow"
            className="p-2 bg-[#FF007F] text-white border border-white hover:bg-[#00F2FE] hover:text-black transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* 2. SIGNAL LOSS */}
      <div className="bg-[#07080D] border-4 border-[#00F2FE] flex flex-col justify-between p-5 relative shadow-[8px_8px_0px_#FF007F] transition-all hover:translate-y-[-4px]">
        <div>
          <div className="aspect-video bg-[#141622] border-2 border-white relative overflow-hidden flex items-center justify-center mb-4">
            <img
              src="/Signal lost.png" // <-- Replace with your image path
              alt="Signal Loss"
              className="w-full h-full object-cover block [image-rendering:pixelated]"
              loading="lazy"
            />
            <span className="absolute top-2 right-2 bg-[#07080D]/90 text-[#00F2FE] border border-[#00F2FE] text-xs px-2 py-0.5 font-bold uppercase z-10 backdrop-blur-sm">
              Godot 4
            </span>
          </div>

          <h3 className="text-2xl font-black uppercase text-white mb-2">Signal Loss</h3>
          <p className="text-sm text-gray-300 font-sans line-clamp-3 mb-4 leading-relaxed">
            Navigate a decommissioned research station using only sound cues — your flashlight draws enemies in. Built during Club Wars 2026, now in post-jam expansion.
          </p>
        </div>

        <div className="pt-4 border-t-2 border-gray-800 flex items-center justify-between">
          <span className="text-xs text-[#FF9F43] uppercase tracking-wider font-bold">
            By Club Wars Team Alpha
          </span>
          <Link 
            href="/games/signal-loss"
            className="p-2 bg-[#FF007F] text-white border border-white hover:bg-[#00F2FE] hover:text-black transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* 3. ORBIT DRIFT */}
      <div className="bg-[#07080D] border-4 border-[#00F2FE] flex flex-col justify-between p-5 relative shadow-[8px_8px_0px_#FF007F] transition-all hover:translate-y-[-4px]">
        <div>
          <div className="aspect-video bg-[#141622] border-2 border-white relative overflow-hidden flex items-center justify-center mb-4">
            <img
              src="/Orbit Drift.png" // <-- Replace with your image path
              alt="Orbit Drift"
              className="w-full h-full object-cover block [image-rendering:pixelated]"
              loading="lazy"
            />
            <span className="absolute top-2 right-2 bg-[#07080D]/90 text-[#00F2FE] border border-[#00F2FE] text-xs px-2 py-0.5 font-bold uppercase z-10 backdrop-blur-sm">
              Unity
            </span>
          </div>

          <h3 className="text-2xl font-black uppercase text-white mb-2">Orbit Drift</h3>
          <p className="text-sm text-gray-300 font-sans line-clamp-3 mb-4 leading-relaxed">
            A one-button gravity game — slingshot your ship between orbits to collect fuel before it runs out. Built in 36 hours for Spring Game Jam.
          </p>
        </div>

        <div className="pt-4 border-t-2 border-gray-800 flex items-center justify-between">
          <span className="text-xs text-[#FF9F43] uppercase tracking-wider font-bold">
            By Spring Jam Team
          </span>
          <Link 
            href="/games/orbit-drift"
            className="p-2 bg-[#FF007F] text-white border border-white hover:bg-[#00F2FE] hover:text-black transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>

    </div>

  </div>
</section>

      {/* ═══ 4. UPCOMING EVENTS ═══════════════════════════════════════════ */}
<section className="relative py-16 md:py-24 px-4 md:px-6 bg-[#0D0E17]">
  <div className="max-w-7xl mx-auto">
    <div className="mb-10 md:mb-12">
      <span className="bg-[#00F2FE] text-black text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-black inline-block mb-2 shadow-[3px_3px_0px_#FF007F]">
        Calendar & Jams
      </span>
      <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight">
        Upcoming <span className="text-[#FF007F]">Events</span>
      </h2>
    </div>

    <div className="bg-[#07080D] border-4 border-white p-4 md:p-6 shadow-[8px_8px_0px_#FF9F43] relative overflow-hidden [&_[class*='border-dashed']]:hidden [&_hr]:border-solid [&_hr]:border-gray-800">
      {(() => {
        const today = new Date().toISOString().split("T")[0];
        const upcomingEvents = (events || [])
          .filter((event) => event.dateSort >= today)
          .sort((a, b) => a.dateSort.localeCompare(b.dateSort));

        if (upcomingEvents.length === 0) {
          return (
            <div className="py-12 text-center font-mono">
              <span className="text-4xl mb-3 block">👾</span>
              <p className="text-[#00F2FE] font-black uppercase tracking-wider text-lg">
                No Upcoming Events Scheduled
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Check back soon or join Discord for upcoming announcements!
              </p>
            </div>
          );
        }

        return <EventTimeline events={upcomingEvents} />;
      })()}
    </div>
  </div>
</section>

      {/* ═══ 5. CONTACT US & JOIN ═════════════════════════════════════════ */}
      <section id="contact" className="relative py-16 md:py-24 px-4 md:px-6 bg-[#07080D]">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <div className="inline-block bg-[#FF9F43] text-black font-black uppercase text-xs md:text-sm px-4 py-1 border-2 border-black mb-6 rotate-[-1deg] shadow-[4px_4px_0px_#FF007F]">
            🚀 No Prior XP Required — Just Raw Passion
          </div>

          <h2 className="text-4xl md:text-7xl font-black uppercase text-white tracking-tight mb-6">
            READY TO <span className="text-[#00F2FE]">BUILD THE FUTURE?</span>
          </h2>

          <p className="max-w-xl mx-auto text-gray-300 font-sans text-base md:text-lg mb-10 leading-relaxed">
            Whether you are a coder, 2D/3D artist, sound designer, writer, or level designer — there is a seat for you here.
          </p>

          <div className="mb-12 md:mb-16">
            <Link 
              href="/auth"
              className="inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-[#FF007F] text-white font-black text-xl md:text-2xl uppercase tracking-wider border-4 border-white shadow-[6px_6px_0px_#00F2FE] md:shadow-[8px_8px_0px_#00F2FE] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[12px_12px_0px_#00F2FE] transition-all"
            >
              <Rocket className="w-7 h-7 md:w-8 md:h-8" /> JOIN THE CLUB NOW
            </Link>
          </div>

          <div className="bg-[#0D0E17] border-4 border-[#00F2FE] p-6 md:p-8 max-w-2xl mx-auto shadow-[8px_8px_0px_#FF007F]">
            <h3 className="text-2xl font-black uppercase text-white mb-6 flex items-center justify-center gap-2">
              <Mail className="text-[#FF007F]" /> Get In Touch
            </h3>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 md:px-5 py-2.5 bg-[#07080D] text-white border-2 border-white text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-[#00F2FE] hover:text-black hover:border-[#00F2FE] transition-all"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}