"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Play, X, Maximize2, MonitorPlay } from "lucide-react";
import StatusBadge from "@/components/status-badge";
import ThreeDBackground from "./3d-arcade";

export default function GamesGrid({ allGames }: { allGames: any[] }) {
  const [playingGame, setPlayingGame] = useState<any | null>(null);

  const handlePlayGame = (g: any) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPlayingGame(g);
  };

  // Lock body scroll when playing a game
  useEffect(() => {
    if (playingGame) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [playingGame]);

  if (allGames.length === 0) {
    return (
      <div className="border-4 border-dashed border-[#FF007F] p-12 text-center bg-[#141622]/50">
        <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">
          No games have been shipped yet. Check back after the next Game Jam!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {allGames.map((g: any) => (
          <article
            key={g.id}
            className="bg-[#07080D] border-4 border-[#00F2FE] flex flex-col justify-between p-5 relative shadow-[8px_8px_0px_#FF007F] transition-all hover:translate-y-[-4px]"
          >
            <div>
              {/* Media Container */}
              <div className="aspect-video bg-[#141622] border-2 border-white relative overflow-hidden flex items-center justify-center mb-4 group cursor-pointer" onClick={() => g.itchUrl && handlePlayGame(g)}>
                {g.coverUrl ? (
                  <img
                    src={g.coverUrl}
                    alt={g.title}
                    className="w-full h-full object-cover block [image-rendering:pixelated] group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-gray-500 font-mono text-xs uppercase group-hover:scale-105 transition duration-500">
                    No Image Preview
                  </div>
                )}

                {/* Play Button Overlay */}
                {g.itchUrl && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-[2px] z-10">
                    <div className="w-12 h-12 rounded-full bg-[#FF007F] flex items-center justify-center border-2 border-white shadow-[0_0_15px_#FF007F] group-hover:scale-110 transition">
                      <Play className="w-5 h-5 text-white ml-1 fill-white" />
                    </div>
                  </div>
                )}

                <span className="absolute top-2 right-2 bg-[#07080D]/90 text-[#00F2FE] border border-[#00F2FE] text-xs px-2 py-0.5 font-bold uppercase z-20 backdrop-blur-sm">
                  {g.engine}
                </span>
              </div>

              {/* Top Meta Info */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-gray-400">
                  {g.platform || "N/A"}
                </span>

                <StatusBadge status={g.status} />
              </div>

              {/* Title & Genre */}
              <h2 className="text-2xl font-black uppercase text-white mb-1">
                {g.title}
              </h2>

              <p className="font-mono text-xs text-[#FF9F43] mb-3">
                {g.genre}
              </p>

              {/* Summary */}
              <p className="text-sm text-gray-300 font-sans line-clamp-3 mb-4 leading-relaxed whitespace-pre-wrap">
                {g.description || g.tagline}
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {g.tags &&
                  (Array.isArray(g.tags) ? g.tags : typeof g.tags === "string" ? g.tags.split(",") : [])
                    .filter((t: any) => typeof t === "string" && t.trim().length > 0)
                    .map((t: string) => (
                      <span
                        key={t.trim()}
                        className="border border-white/30 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-gray-300"
                      >
                        {t.trim()}
                      </span>
                    ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-4 border-t-2 border-gray-800 flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold truncate max-w-[180px]">
                By {g.developer || "Unknown Developer"}
              </span>

              {g.itchUrl ? (
                <button
                  onClick={() => handlePlayGame(g)}
                  className="px-4 py-2 bg-[#FF007F] text-white font-bold uppercase tracking-widest text-[10px] border border-white hover:bg-[#00F2FE] hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={12} className="fill-current" /> Play
                </button>
              ) : (
                <span className="font-mono text-[11px] text-gray-500 uppercase">
                  No Link
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* ─── WebGL Player Modal (Arcade Mode) ────────────────────────────── */}
      {playingGame && (
        <div className="fixed inset-0 z-[100] bg-[#07080D] flex flex-col font-sans">
          {/* Animated Scanline Overlay for background */}
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, #000 3px)" }} />
          
          {/* Top Header Bar (Arcade Style) */}
          <div className="h-16 relative z-20 border-b-4 border-[#FF007F] flex items-center justify-between px-4 sm:px-6 bg-[#0B0C15] shadow-[0_4px_20px_rgba(255,0,127,0.3)]">
            <div className="flex items-center gap-3 sm:gap-4 truncate">
              <div className="flex items-center justify-center w-10 h-10 bg-[#FF007F] text-white border-2 border-white shadow-[2px_2px_0_#00F2FE] shrink-0">
                <MonitorPlay size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col truncate">
                <h3 className="font-arcade text-sm sm:text-xl text-white uppercase tracking-wider leading-tight truncate drop-shadow-[2px_2px_0_#00F2FE]">
                  {playingGame.title}
                </h3>
                <span className="font-mono text-[8px] sm:text-xs text-[#00F2FE] uppercase tracking-widest font-bold hidden sm:block animate-pulse">
                  ● ARCADE MODE
                </span>
              </div>
            </div>

            <button
              onClick={() => setPlayingGame(null)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#07080D] border-2 border-[#00F2FE] text-[#00F2FE] hover:bg-[#00F2FE] hover:text-black hover:shadow-[4px_4px_0_#FF007F] transition-all uppercase font-arcade text-[10px] sm:text-xs shrink-0 ml-2"
            >
              <span className="hidden sm:inline">Close Game</span> <X size={16} strokeWidth={3} />
            </button>
          </div>

          {/* 3D Game Frame Area */}
          <div className="flex-1 w-full h-full p-4 md:p-8 flex flex-col items-center justify-center relative bg-black overflow-hidden">
            
            {/* The 3D Animated Background */}
            <ThreeDBackground />

            {/* Simple Clean Box (Layered on top of 3D bg) */}
            <div className="w-full max-w-6xl aspect-video bg-black shadow-[0_0_80px_rgba(0,242,254,0.3)] border-2 border-white/10 relative z-10 rounded-sm">
              <iframe
                src={(() => {
                  try {
                    const url = playingGame.itchUrl || "";
                    const parts = url.split("/games/");
                    if (parts.length > 1) {
                      return `/api/play/${parts[1]}`;
                    }
                  } catch (e) {}
                  return playingGame.itchUrl;
                })()}
                className="w-full h-full border-none"
                allow="autoplay; fullscreen; vr"
                allowFullScreen
              />
            </div>

            <p className="mt-4 sm:mt-6 text-gray-400 font-mono text-[10px] sm:text-xs tracking-widest uppercase z-10 bg-black/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md border border-white/10 text-center mx-4">
              Press <span className="text-white font-bold">ESC</span> or click Close Game to exit
            </p>
          </div>
        </div>
      )}
    </>
  );
}
