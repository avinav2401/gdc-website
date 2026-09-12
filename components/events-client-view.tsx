"use client";

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, MapPin, ExternalLink } from "lucide-react";
import StatusBadge from "@/components/status-badge";
import { ClubEvent } from "@/lib/data";

interface EventsClientViewProps {
  events: ClubEvent[];
}

// Asymmetric width splits for a 2-panel row. Deliberately uneven (never
// 6fr/6fr) so paired panels look hand-laid-out like inked comic pages,
// not a mechanical 50/50 grid. Order is randomized per pair at group time.
const SPLIT_PATTERNS: string[] = [
  "md:grid-cols-[7fr_5fr]",
  "md:grid-cols-[8fr_4fr]",
  "md:grid-cols-[5fr_7fr]",
  "md:grid-cols-[4fr_8fr]",
  "md:grid-cols-[9fr_3fr]",
  "md:grid-cols-[3fr_9fr]",
];

type ComicRow = { events: ClubEvent[]; colClass: string; startIndex: number };

// Deterministic string hash -> 32-bit seed.
function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Tiny seeded PRNG (mulberry32). Given the same seed, always produces the
// same sequence of numbers — unlike Math.random(), which differs between
// the server's render pass and the client's hydration pass and causes
// React hydration mismatches.
function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Groups a flat, date-sorted list of events into comic "rows" of 1 or 2
// panels each. The "randomness" is seeded from the events themselves, so
// the exact same list always produces the exact same grouping on both
// server and client — no hydration mismatch, and no reshuffling on
// re-render — while still varying naturally from year to year.
function buildComicRows(items: ClubEvent[]): ComicRow[] {
  const seed = hashSeed(items.map((e) => e.slug).join("|")) || 1;
  const rand = mulberry32(seed);

  const rows: ComicRow[] = [];
  let i = 0;
  let cursor = 0;

  while (i < items.length) {
    const remaining = items.length - i;
    // Weighted toward pairs (more comic-like) but a solo splash panel
    // still shows up whenever 2+ events remain.
    const takeTwo = remaining >= 2 && rand() < 0.6;
    const count = takeTwo ? 2 : 1;
    const rowEvents = items.slice(i, i + count);

    const colClass =
      count === 2
        ? SPLIT_PATTERNS[Math.floor(rand() * SPLIT_PATTERNS.length)]
        : "md:grid-cols-1";

    rows.push({ events: rowEvents, colClass, startIndex: cursor });
    cursor += count;
    i += count;
  }

  return rows;
}

const TILTS = ["rotate-[0deg]", "rotate-[-0.6deg]", "rotate-[0.5deg]", "rotate-[-0.4deg]"];

function ComicPanel({ event, panelNumber }: { event: ClubEvent; panelNumber: number }) {
  const tilt = TILTS[panelNumber % TILTS.length];

  return (
    <article
      className={`group relative bg-[#F5EFDD] border-[5px] border-black flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0px_#FF007F] shadow-[6px_6px_0px_#000] ${tilt}`}
    >
      <div className="absolute -top-3 -left-3 z-20 bg-black text-[#F5EFDD] font-black text-[11px] px-3 py-1 border-2 border-black rotate-[-3deg]">
        PANEL {panelNumber}
      </div>

      <div className="relative w-full h-52 md:h-64 border-b-[5px] border-black overflow-hidden shrink-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover grayscale-[15%] contrast-110 group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "5px 5px",
          }}
        />
        <div className="absolute top-3 right-3 bg-white border-2 border-black rounded-md px-2.5 py-1 shadow-[2px_2px_0_#000] flex items-center gap-1.5">
          <CalendarIcon className="w-3 h-3 text-black" />
          <span className="font-mono text-[10px] text-black font-bold uppercase tracking-wider">
            {event.date}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <StatusBadge status={event.status} />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6 bg-[#F5EFDD]">
        <span className="text-[11px] font-mono text-[#B4590A] uppercase tracking-widest font-bold block mb-1">
          {event.version || "CHAPTER-LOG"}
        </span>
        <h3 className="text-xl md:text-2xl font-black uppercase text-black tracking-tight leading-snug">
          {event.title}
        </h3>
        <p className="font-mono text-xs text-black/70 flex items-center gap-1.5 mt-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#B4590A]" /> {event.location}
        </p>

        <p className="text-sm md:text-base text-black/85 font-sans mb-4 leading-relaxed">
          {event.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {event.tags.map((t) => (
            <span
              key={t}
              className="border-2 border-black bg-[#E7DEC6] px-2 py-0.5 font-mono text-[10px] text-black uppercase tracking-wider"
            >
              #{t}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t-2 border-black/20 flex items-center justify-between mt-auto">
          <span className="text-xs font-mono text-[#B4590A] uppercase tracking-wider font-bold">
            GDC Story Log
          </span>
          {event.registerUrl ? (
            <a
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black text-[#F5EFDD] text-xs font-black uppercase border-2 border-black hover:bg-[#FF007F] hover:border-[#FF007F] hover:text-white transition-colors flex items-center gap-1.5"
            >
              Register <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="font-mono text-xs text-black/50 uppercase tracking-wider bg-black/5 px-3 py-1 border-2 border-black/30">
              Archived Panel
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function EventsClientView({ events }: EventsClientViewProps) {
  const availableYears = Array.from(
    new Set(events.map((e) => e.dateSort?.substring(0, 4) || "2026"))
  ).sort((a, b) => b.localeCompare(a));

  const [selectedYear, setSelectedYear] = useState<string>(availableYears[0] || "2026");

  const yearEvents = events.filter((e) => {
    const eventYear = e.dateSort?.substring(0, 4) || "2026";
    return eventYear === selectedYear;
  });

  const timelineEvents = [...yearEvents].sort((a, b) => (a.dateSort > b.dateSort ? 1 : -1));

  // Recomputed only when the visible event list actually changes (i.e. when
  // switching year), so the random row grouping stays stable across re-renders.
  const comicRows = useMemo(() => buildComicRows(timelineEvents), [timelineEvents]);

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

      <div className="min-h-screen bg-[#07080D] text-white pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
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
          <div className="border-4 border-white bg-[#141622] p-6 md:p-8 mb-12 shadow-[10px_10px_0px_#FF007F] relative transform -rotate-1">
            <div className="absolute -top-4 -left-4 bg-[#FF007F] text-white font-black text-xs md:text-sm uppercase tracking-widest px-4 py-1 border-2 border-white shadow-[3px_3px_0px_#00F2FE] rotate-[-4deg]">
              GDC COMIC ISSUE #{selectedYear}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
              <div>
                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_#FF007F]">
                  STORY <span className="text-[#00F2FE]">PANELS</span>
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-300 font-sans max-w-2xl">
                  Interactive graphic novel issue spread. Explore club milestones, game jams, and historical project logs.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-mono text-xs text-[#FF9F43] font-bold uppercase tracking-wider w-full md:w-auto">
                  Issue Volume:
                </span>
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-4 py-2 font-black text-sm uppercase border-2 border-white transition-all shadow-[3px_3px_0px_#00F2FE] ${
                      selectedYear === yr
                        ? "bg-[#FF007F] text-white translate-y-[-2px]"
                        : "bg-[#07080D] text-gray-300 hover:bg-white hover:text-black"
                    }`}
                  >
                    VOL. {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {timelineEvents.length === 0 ? (
            <div className="border-4 border-dashed border-gray-700 p-12 text-center bg-[#141622]/50">
              <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                No comic frames recorded for volume {selectedYear}.
              </p>
            </div>
          ) : (
            <div className="bg-[#E7DEC6] p-3 md:p-5 border-4 border-black shadow-[10px_10px_0px_#00F2FE]">
              <div className="flex flex-col gap-3 md:gap-5">
                {comicRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid grid-cols-1 gap-3 md:gap-5 ${row.colClass}`}
                  >
                    {row.events.map((e, i) => (
                      <ComicPanel key={e.slug} event={e} panelNumber={row.startIndex + i + 1} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}