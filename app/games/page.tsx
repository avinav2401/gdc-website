import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import StatusBadge from "@/components/status-badge";
import { games } from "@/lib/data";

export const metadata: Metadata = {
  title: "Games — GDC",
  description:
    "Games shipped, in development, and prototyped by Game Developer's Community members.",
};

export default function GamesPage() {
  return (
    <>
      {/* ═══ POST-WHY WE EXIST WEBP BANNER (FULL WIDTH) ═══════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#0D0E17] py-6 md:py-10">
        <div className="w-full border-y-4 border-[#00F2FE] bg-[#07080D] shadow-[0px_6px_0px_#FF007F] relative">
          <img
            src="/relax.webp"
            alt="Game Developers Community Showcase"
            className="w-full h-48 sm:h-64 md:h-80 lg:h-[350px] object-cover block"
            loading="lazy"
          />
        </div>
      </section>

      <div className="min-h-screen bg-[#07080D] text-white pt-24 pb-16 px-4 md:px-6 relative overflow-hidden">
        {/* Comic Single-Hatch Background Pattern in Dark Muted Gray */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, #161B26 0px, #161B26 2px, transparent 2px, transparent 24px)
            `,
          }}
        />

        <div className="mx-auto max-w-7xl relative z-10">
          
          {/* Header Section */}
          <div className="mb-12">
            <span className="bg-[#FF007F] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-white inline-block mb-3 shadow-[3px_3px_0px_#00F2FE]">
              Repo / Games
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight">
              Games <span className="text-[#00F2FE]">Showcase</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm md:text-base text-gray-300 font-sans leading-relaxed">
              Everything our members have built — jam entries, ongoing projects,
              and early prototypes.
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {games.map((g) => (
              <article
                key={g.slug}
                className="bg-[#07080D] border-4 border-[#00F2FE] flex flex-col justify-between p-5 relative shadow-[8px_8px_0px_#FF007F] transition-all hover:translate-y-[-4px]"
              >
                <div>
                  {/* Media Container */}
                  <div className="aspect-video bg-[#141622] border-2 border-white relative overflow-hidden flex items-center justify-center mb-4">
                    {g.image ? (
                      <img
                        src={g.image}
                        alt={g.title}
                        className="w-full h-full object-cover block [image-rendering:pixelated]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-gray-500 font-mono text-xs uppercase">
                        No Image Preview
                      </div>
                    )}
                    <span className="absolute top-2 right-2 bg-[#07080D]/90 text-[#00F2FE] border border-[#00F2FE] text-xs px-2 py-0.5 font-bold uppercase z-10 backdrop-blur-sm">
                      {g.engine}
                    </span>
                  </div>

                  {/* Top Meta Info */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-gray-400">
                      {g.version || "v1.0"}
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
                  <p className="text-sm text-gray-300 font-sans line-clamp-3 mb-4 leading-relaxed">
                    {g.summary}
                  </p>

                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {g.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-white/30 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t-2 border-gray-800 flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-bold truncate max-w-[180px]">
                    By {g.authors.join(", ")}
                  </span>
                  {g.playUrl ? (
                    <a
                      href={g.playUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#FF007F] text-white border border-white hover:bg-[#00F2FE] hover:text-black transition-colors flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="font-mono text-[11px] text-gray-500 uppercase">
                      Coming Soon
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}