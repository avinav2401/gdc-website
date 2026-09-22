"use client";

import { useMemo, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { ClubEvent } from "@/lib/data";
import { buildComicRows } from "@/lib/floating-assets";
import ComicPanel from "@/components/comic-panel";

interface EventsClientViewProps {
  events: ClubEvent[];
}

export default function EventsClientView({ events }: EventsClientViewProps) {
  const availableYears = Array.from(
    new Set(events.map((e) => e.dateSort?.substring(0, 4) || "2026"))
  ).sort((a, b) => b.localeCompare(a));

  const [selectedYear, setSelectedYear] = useState<string>(availableYears[0] || "2026");
  const [hoveredEventSlug, setHoveredEventSlug] = useState<string | null>(null);
  const [modalData, setModalData] = useState<{ title: string; type: "closed" | "upcoming" } | null>(null);

  const yearEvents = events
    .filter((e) => {
      const eventYear = e.dateSort?.substring(0, 4) || "2026";
      return eventYear === selectedYear;
    })
    .sort((a, b) => {
      if (selectedYear === "2026") {
        return b.dateSort.localeCompare(a.dateSort);
      }
      return a.dateSort.localeCompare(b.dateSort);
    });

  const comicRows = useMemo(() => buildComicRows(yearEvents), [yearEvents]);

  const handlePanelClick = (event: ClubEvent) => {
    if (event.registerUrl) {
      window.open(event.registerUrl, "_blank", "noopener,noreferrer");
    } else if (event.status === "upcoming") {
      setModalData({ title: event.title, type: "upcoming" });
    } else {
      setModalData({ title: event.title, type: "closed" });
    }
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {events.map((e) => {
          const isCurrentActive = hoveredEventSlug === e.slug;
          return (
            <div
              key={e.slug}
              className={`absolute inset-0 bg-cover bg-center filter blur-sm scale-105 transition-opacity duration-700 ease-in-out ${
                isCurrentActive ? "opacity-60 z-10" : "opacity-0 z-0"
              }`}
              style={{ backgroundImage: `url('${e.image}')` }}
            />
          );
        })}
        <div className="absolute inset-0 bg-[#07080D]/60 z-20 transition-colors duration-300" />
      </div>

      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-[#F5EFDD] border-4 border-black p-6 md:p-8 max-w-md w-full shadow-[10px_10px_0px_#FF007F] transform rotate-1">
            <div className={`absolute -top-5 -left-4 text-white font-black text-xs uppercase px-3 py-1 border-2 border-black rotate-[-6deg] shadow-[3px_3px_0px_#000] ${modalData.type === "upcoming" ? "bg-[#00F2FE] text-black" : "bg-[#FF007F]"}`}>
              {modalData.type === "upcoming" ? "COMING SOON! ⚡" : "SYSTEM ALERT! ⚠️"}
            </div>

            <button
              onClick={() => setModalData(null)}
              className="absolute top-3 right-3 bg-black text-white p-1 border-2 border-black hover:bg-[#FF007F] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mt-3 mb-4">
              <div className={`p-2 border-2 border-black shadow-[2px_2px_0_#000] ${modalData.type === "upcoming" ? "bg-[#00F2FE]" : "bg-[#FF9F43]"}`}>
                <AlertCircle className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-black uppercase text-black tracking-tight">
                {modalData.type === "upcoming" ? "Registration Opening Soon" : "Registration Closed"}
              </h3>
            </div>

            <p className="font-sans text-sm md:text-base text-black/85 mb-6 leading-relaxed">
              {modalData.type === "upcoming" ? (
                <>Stay tuned the registration will start soon for <span className="font-black text-[#B4590A]">"{modalData.title}"</span>!</>
              ) : (
                <>Sorry, the registration for <span className="font-black text-[#B4590A]">"{modalData.title}"</span> is closed! Check out our active upcoming panels for open slots.</>
              )}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setModalData(null)}
                className="px-5 py-2 bg-black text-[#F5EFDD] font-black text-xs uppercase border-2 border-black hover:bg-[#00F2FE] hover:text-black transition-colors shadow-[3px_3px_0px_#000]"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div className="min-h-screen bg-transparent text-white pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, #161B26 0px, #161B26 2px, transparent 2px, transparent 24px)
            `,
          }}
        />

        <div className="mx-auto max-w-7xl relative z-30">
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

          {yearEvents.length === 0 ? (
            <div className="border-4 border-dashed border-gray-700 p-12 text-center bg-[#141622]/50">
              <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                No comic frames recorded for volume {selectedYear}.
              </p>
            </div>
          ) : (
            <div className="bg-[#E7DEC6] p-3 md:p-5 border-4 border-black shadow-[10px_10px_0px_#00F2FE] overflow-visible">
              <div className="flex flex-col gap-3 md:gap-5 overflow-visible">
                {comicRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid grid-cols-1 gap-3 md:gap-5 overflow-visible ${row.colClass}`}
                  >
                    {row.events.map((e, i) => (
                      <ComicPanel
                        key={e.slug}
                        event={e}
                        panelNumber={row.startIndex + i + 1}
                        isHovered={hoveredEventSlug === e.slug}
                        onHover={() => setHoveredEventSlug(e.slug)}
                        onLeave={() => setHoveredEventSlug(null)}
                        onPanelClick={handlePanelClick}
                      />
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