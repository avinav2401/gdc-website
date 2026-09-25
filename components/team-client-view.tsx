"use client";

import { useState, useEffect } from "react";
import { GitBranch, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Member } from "@/lib/data";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

// Reusable Arcade Character Card Component with Uniform Sizing & Square Photo Area
function CharacterCard({ member }: { member: Member }) {
  return (
    <div className="group relative bg-[#0B0D14] border-4 border-[#FF007F] p-4 shadow-[6px_6px_0px_#FF007F] transition-all duration-300 hover:scale-[1.02] hover:border-[#00F2FE] hover:shadow-[10px_10px_0px_#FF007F] flex flex-col justify-between h-full w-full">
      
      <div>
        {/* Top Header Badge & Team Tag */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] bg-[#FF007F] text-white px-2 py-0.5 font-bold uppercase tracking-wider">
            LVL. {member.level * 25}
          </span>
          <span className="font-mono text-[10px] text-[#FF9F43] uppercase tracking-widest font-bold">
            {member.team}
          </span>
        </div>

        {/* Center Square Pixel / Grid Avatar Screen with Real Photo Support */}
        <div className="relative aspect-square w-full bg-gradient-to-br from-[#141622] to-black border-2 border-white flex items-center justify-center mb-4 overflow-hidden shadow-[inset_2px_2px_0px_rgba(0,0,0,0.9)]">
          
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.name} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter contrast-125 z-0"
            />
          ) : (
            <span className="font-display text-4xl font-black text-white drop-shadow-[3px_3px_0px_#FF007F] tracking-wider uppercase z-0 group-hover:opacity-0 transition-opacity duration-300">
              {initials(member.name)}
            </span>
          )}

          {/* HOVER OVERLAY WITH SOCIAL UPLINK CHANNELS */}
          <div className="absolute inset-0 bg-[#07080D]/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-3 z-20">
            <span className="font-mono text-[10px] text-[#00F2FE] font-black uppercase tracking-widest">
              UPLINK CHANNELS
            </span>
            <div className="flex items-center gap-2">
              {/* LinkedIn */}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#00F2FE] text-black border border-white hover:bg-[#FF007F] hover:text-white transition-colors shadow-[2px_2px_0px_#FF007F]" title="LinkedIn">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {/* Instagram */}
              {member.instagram && (
                <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#00F2FE] text-black border border-white hover:bg-[#FF007F] hover:text-white transition-colors shadow-[2px_2px_0px_#FF007F]" title="Instagram">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {/* GitHub */}
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#00F2FE] text-black border border-white hover:bg-[#FF007F] hover:text-white transition-colors shadow-[2px_2px_0px_#FF007F]" title="GitHub">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              )}
              {/* Portfolio */}
              {member.portfolio && (
                <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#00F2FE] text-black border border-white hover:bg-[#FF007F] hover:text-white transition-colors shadow-[2px_2px_0px_#FF007F]" title="Portfolio Website">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Name and Role */}
        <div>
          <h3 className="text-base font-black uppercase text-white tracking-tight truncate group-hover:text-[#00F2FE] transition-colors">
            {member.name}
          </h3>
          <p className="font-mono text-xs text-[#FF007F] font-bold truncate mt-0.5">
            {member.role}
          </p>
        </div>
      </div>

      {/* Bio text pinned neatly to the bottom for height uniformity */}
      <p className="mt-3 text-[11px] text-gray-400 font-sans line-clamp-2">
        {member.bio}
      </p>

    </div>
  );
}

export default function TeamClientView({ team }: { team: Member[] }) {
  const facultyMembers = team.filter((m) => m.team === "faculty" && !m.isAlumni);
  const level1GuildMasters = team.filter((m) => m.level === 1 && !m.isAlumni && m.team === "core");
  const level2GuildMasters = team.filter((m) => m.level === 2 && !m.isAlumni && m.team === "core");
  const level3Operatives = team.filter((m) => m.level === 3 && !m.isAlumni && m.team === "core");
  const level4Initiates = team.filter((m) => m.level === 4 && !m.isAlumni && m.team === "core");
  const alumni = team.filter((m) => m.isAlumni);

  // Gallery slider state & active group photo paths (Store your photos in public/gallery/)
  const [currentSlide, setCurrentSlide] = useState(0);
  const galleryImages = [
    "/gallery/grp_photo.png",
  ];
  const slidesCount = galleryImages.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slidesCount]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slidesCount);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);

  return (
    <div className="min-h-screen bg-[#07080D] text-white pt-24 pb-28 relative overflow-hidden">
      
      {/* Comic Single-Hatch Background Pattern in Dark Muted Gray */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, #161B26 0px, #161B26 2px, transparent 2px, transparent 24px)
          `,
        }}
      />

      {/* FULL-WIDTH BLEED HERO GALLERY CAROUSEL BANNER (2:1 Aspect Ratio) */}
      <div className="relative w-full aspect-[2/1] border-y-4 border-white bg-[#141622] mb-16 shadow-[0px_10px_0px_#FF007F] overflow-hidden group z-10">
        
        {/* Active Group / Gallery Photo Background with Solid Fallback */}
        <div className="absolute inset-0 bg-[#0B0D14] z-0" />
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 z-10"
          style={{ backgroundImage: `url(${galleryImages[currentSlide]})` }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-20" />

        {/* Banner Text positioned slightly down (towards the bottom area above controls) */}
        <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-20 z-30">
          <div className="text-center px-4">
            <span className="font-mono text-xs md:text-sm text-[#FF9F43] font-bold uppercase tracking-widest block mb-2 drop-shadow-[2px_2px_0px_black]">
              GDC SQUAD ARCHIVES // UPLINK 0{currentSlide + 1}
            </span>
            <div className="text-3xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-[6px_6px_0px_#FF007F] select-none">
              OPERATIONAL SQUADS
            </div>
            <span className="font-mono text-xs text-gray-200 mt-2 block drop-shadow-[1px_1px_0px_black]">
              COMMUNITY BUILDERS & GAME DEVELOPERS
            </span>

          </div>
        </div>

        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-[#FF007F] text-white border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_#FF007F] hover:bg-[#00F2FE] hover:text-black transition-colors cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-[#FF007F] text-white border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_#FF007F] hover:bg-[#00F2FE] hover:text-black transition-colors cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {[...Array(slidesCount)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 border border-white transition-all ${
                currentSlide === idx ? "bg-[#00F2FE] w-8" : "bg-[#FF007F]"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">

        {/* SECTION INTRO BANNER */}
        <div className="border-4 border-white bg-[#141622] p-6 md:p-8 mb-12 shadow-[10px_10px_0px_#FF007F] relative transform -rotate-1">
          <div className="absolute -top-4 -left-4 bg-[#FF007F] text-white font-black text-xs md:text-sm uppercase tracking-widest px-4 py-1 border-2 border-white shadow-[3px_3px_0px_#FF007F] rotate-[-4deg]">
            GDC ISSUE // CHARACTER ROSTER & SKILL TREE
          </div>

          <div className="mt-2">
            <span className="font-mono text-xs text-[#FF9F43] font-bold uppercase tracking-widest block mb-1">
              Faculty Command & Core Roster Tiers
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_#FF007F]">
              ROSTER <span className="text-[#00F2FE]">SELECT</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-gray-300 font-sans max-w-2xl">
              Inspect faculty administration and core student skill tree tiers below. Hover over any arcade character card to establish communication uplinks.
            </p>
          </div>
        </div>

        {/* UNIFIED GDC HIERARCHY TREE */}
        <section className="relative mt-8">
          
          {/* Main Tree Container with Continuous Vertical Line */}
          <div className="space-y-16 md:space-y-24 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-1 before:bg-gradient-to-b before:from-[#FF9F43] before:via-[#FF007F] before:to-[#00F2FE]">
            
            {/* FACULTY COMMAND SECTION */}
            {facultyMembers.length > 0 && (
              <div className="relative">
                {/* Centered Section Header */}
                <div className="flex flex-col items-center justify-center text-center gap-3 mb-10 relative z-20 max-w-xl mx-auto bg-[#07080D] py-2">
                  <div className="bg-[#FF9F43] p-2 border-2 border-white text-black shadow-[3px_3px_0px_#FF007F] inline-block mb-1">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_#FF007F]">
                      Faculty Command Section
                    </h2>
                    <p className="font-mono text-xs text-[#FF9F43] uppercase tracking-wider mt-1">
                      Institutional oversight & leadership mentors
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto items-stretch">
                  {facultyMembers.map((m) => (
                    <div key={m.name} className="w-full max-w-[320px]">
                      <CharacterCard member={m} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CORE SKILL TREE SECTION HEADER */}
            <div className="relative">
              <div className="flex flex-col items-center justify-center text-center gap-3 relative z-20 max-w-xl mx-auto bg-[#07080D] py-4">
                <div className="bg-[#00F2FE] p-2 border-2 border-white text-black shadow-[3px_3px_0px_#FF007F] inline-block mb-1">
                  <GitBranch className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_#FF007F]">
                    GDC Core Skill Tree
                  </h2>
                  <p className="font-mono text-xs text-[#00F2FE] uppercase tracking-wider mt-1">
                    Hierarchical student operational tiers
                  </p>
                </div>
              </div>
            </div>

            {/* LEVEL 1: (If applicable) */}
            {level1GuildMasters.length > 0 && (
              <div className="relative pt-6">
                <div className="flex justify-center mb-8">
                  <span className="bg-[#FF9F43] text-black font-mono text-xs font-black px-4 py-1.5 border-2 border-white shadow-[3px_3px_0px_#FF007F] uppercase tracking-widest z-20 text-center">
                    LEVEL 1 // Founders & Directors
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto items-stretch">
                  {level1GuildMasters.map((m) => (
                    <div key={m.name} className="w-full max-w-[320px]">
                      <CharacterCard member={m} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEVEL 2: GUILD MASTERS */}
            {level2GuildMasters.length > 0 && (
              <div className="relative">
                <div className="flex justify-center mb-8">
                  <span className="bg-[#00F2FE] text-black font-mono text-xs font-black px-4 py-1.5 border-2 border-white shadow-[3px_3px_0px_#FF007F] uppercase tracking-widest z-20 text-center">
                    LEVEL 2 // Guild Masters & Directors
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto items-stretch">
                  {level2GuildMasters.map((m) => (
                    <div key={m.name} className="w-full max-w-[320px]">
                      <CharacterCard member={m} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEVEL 3: SENIOR OPERATIVES */}
            {level3Operatives.length > 0 && (
              <div className="relative">
                <div className="flex justify-center mb-8">
                  <span className="bg-[#FF9F43] text-black font-mono text-xs font-black px-4 py-1.5 border-2 border-white shadow-[3px_3px_0px_#FF007F] uppercase tracking-widest z-20 text-center">
                    LEVEL 3 // Senior Engine Operatives
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto items-stretch">
                  {level3Operatives.map((m) => (
                    <div key={m.name} className="w-full max-w-[320px]">
                      <CharacterCard member={m} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEVEL 4: COMMUNITY INITIATES */}
            {level4Initiates.length > 0 && (
              <div className="relative pb-16">
                <div className="flex justify-center mb-8">
                  <span className="bg-white text-black font-mono text-xs font-black px-4 py-1.5 border-2 border-[#FF007F] shadow-[3px_3px_0px_#FF007F] uppercase tracking-widest z-20 text-center">
                    LEVEL 4 // Community Recruits & Specialists
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto items-stretch">
                  {level4Initiates.map((m) => (
                    <div key={m.name} className="w-full max-w-[320px]">
                      <CharacterCard member={m} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

      </div>
    </div>
  );
}
