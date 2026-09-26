import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import GamesGrid from "./games-grid";

export const metadata: Metadata = {
  title: "Games — GDC",
  description:
    "Games shipped, in development, and prototyped by Game Developer's Community members.",
};

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const { data: approvedGames, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch approved games:", error);
  }

  const allGames = (approvedGames || []).map((g: any) => ({
    ...g,

    // Supabase column names with fallbacks
    id: g.id,
    title: g.title,
    developer: g.developer || g.team || "GDC Member",
    tagline: g.tagline,
    description: g.description,
    engine: g.engine,
    genre: g.genre,
    platform: g.platform,
    tags: Array.isArray(g.tags) ? g.tags.join(",") : (g.tags || ""),
    status: g.status,

    // Image & Play links (supporting both schema formats)
    coverUrl: g.cover_url || g.image_url,
    itchUrl: g.itch_url || g.play_url,
    videoUrl: g.video_url,
  }));

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
              repeating-linear-gradient(
                45deg,
                #161B26 0px,
                #161B26 2px,
                transparent 2px,
                transparent 24px
              )
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

          <GamesGrid allGames={allGames} />
        </div>
      </div>
    </>
  );
}