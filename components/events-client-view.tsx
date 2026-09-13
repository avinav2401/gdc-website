"use client";

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, MapPin, ExternalLink } from "lucide-react";
import StatusBadge from "@/components/status-badge";
import { ClubEvent } from "@/lib/data";

interface EventsClientViewProps {
  events: ClubEvent[];
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
  // Show all events in one timeline, sorted by date (newest first or oldest first based on user preference, we'll do newest first which is standard for events)
  const timelineEvents = [...events].sort((a, b) => ((a.dateSort || "") > (b.dateSort || "") ? -1 : 1));

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
              GDC COMIC OMNIBUS
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
                  Total Events:
                </span>
                <span className="px-4 py-2 font-black text-sm uppercase border-2 border-white transition-all shadow-[3px_3px_0px_#00F2FE] bg-[#FF007F] text-white">
                  {timelineEvents.length} FILES
                </span>
              </div>
            </div>
          </div>

          {timelineEvents.length === 0 ? (
            <div className="border-4 border-dashed border-gray-700 p-12 text-center bg-[#141622]/50">
              <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                No comic frames recorded.
              </p>
            </div>
          ) : (
            <div className="bg-[#E7DEC6] p-3 md:p-5 border-4 border-black shadow-[10px_10px_0px_#00F2FE]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5">
                {timelineEvents.map((e, i) => {
                  let spanClass = "md:col-span-6"; // default half
                  if (e.shape === "full") spanClass = "md:col-span-12";
                  if (e.shape === "large") spanClass = "md:col-span-8";
                  if (e.shape === "small") spanClass = "md:col-span-4";

                  return (
                    <div key={e.slug} className={`w-full ${spanClass}`}>
                      <ComicPanel event={e} panelNumber={i + 1} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}