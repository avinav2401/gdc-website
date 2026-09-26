"use client";

import { useState } from "react";
import { ExternalLink, Play, X, Maximize2 } from "lucide-react";
import StatusBadge from "@/components/status-badge";

export default function GamesGrid({ allGames }: { allGames: any[] }) {
  const [playingGame, setPlayingGame] = useState<any | null>(null);

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
              <div className="aspect-video bg-[#141622] border-2 border-white relative overflow-hidden flex items-center justify-center mb-4 group cursor-pointer" onClick={() => g.itchUrl && setPlayingGame(g)}>
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
                  onClick={() => setPlayingGame(g)}
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

      {/* ─── WebGL Player Modal ────────────────────────────────────────────── */}
      {playingGame && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col backdrop-blur-md">
          {/* Top Bar */}
          <div className="h-14 border-b-2 border-gray-800 flex items-center justify-between px-6 bg-[#07080D]">
            <div className="flex items-center gap-4">
              <h3 className="font-display text-xl uppercase tracking-wider text-white">
                {playingGame.title}
              </h3>
              <span className="px-2 py-0.5 bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/50 text-[10px] font-bold uppercase tracking-widest">
                Playing in Browser
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-px h-4 bg-gray-700 mx-2" />
              <button
                onClick={() => setPlayingGame(null)}
                className="p-2 bg-gray-800 hover:bg-red-500 hover:text-white rounded transition text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Game Frame */}
          <div className="flex-1 w-full h-full p-4 md:p-8 flex items-center justify-center relative bg-[url('/grid.svg')]">
            <div className="w-full max-w-6xl aspect-video bg-black border-4 border-[#00F2FE] shadow-[0_0_40px_rgba(0,242,254,0.15)] relative group">
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
                className="w-full h-full"
                allow="autoplay; fullscreen; vr"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
