"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, MapPin, ExternalLink } from "lucide-react";
import StatusBadge from "@/components/status-badge";
import { ClubEvent } from "@/lib/data";
import { TILTS, buildFloatingAssetInstances } from "@/lib/floating-assets";

interface ComicPanelProps {
  event: ClubEvent;
  panelNumber: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onPanelClick: (event: ClubEvent) => void;
}

export default function ComicPanel({
  event,
  panelNumber,
  isHovered,
  onHover,
  onLeave,
  onPanelClick,
}: ComicPanelProps) {
  const tilt = TILTS[panelNumber % TILTS.length];
  const isUpcomingWithoutLink = event.status === "upcoming" && !event.registerUrl;

  // Measure the panel's ACTUAL rendered box so floating assets can scale
  // to its real size, instead of guessing "large" vs "small". Only runs
  // client-side (ResizeObserver doesn't exist during SSR), and since the
  // overlay itself is also gated on `mounted`, there's no hydration
  // mismatch risk.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
    const node = wrapperRef.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const floatingInstances = useMemo(
    () =>
      buildFloatingAssetInstances(
        event.floatingAssets ?? [],
        event.slug,
        size.width,
        size.height
      ),
    [event.floatingAssets, event.slug, size.width, size.height]
  );

  const hasFloatingAssets = mounted && floatingInstances.length > 0;

  return (
    <div
      ref={wrapperRef}
      className={`relative my-4 group/panel transition-[z-index] ${
        isHovered ? "z-40" : "z-0"
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* 🌟 FLOATING ASSETS: kept mounted at all times (once measured) so
          CSS can actually TRANSITION between states instead of popping
          in abruptly. At rest, every asset sits dead-center on the
          panel at scale(0) — invisible, bunched at one point directly
          behind the card. On hover, they animate outward together to
          their spread-out positions, which reads as everything erupting
          from a single point behind the panel. The wrapper gets z-40
          while hovered, lifting this whole panel (article + assets)
          above every sibling panel; internally the assets sit at z-10
          and the article at z-30, so they visually emerge from behind
          the card's edges as they move past them. */}
      {hasFloatingAssets && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-visible">
          {floatingInstances.map((inst) => (
            <div
              key={inst.key}
              className="absolute"
              style={{
                left: isHovered ? `calc(50% + ${inst.offsetX}px)` : "50%",
                top: isHovered ? `calc(50% + ${inst.offsetY}px)` : "50%",
                width: `${inst.size}px`,
                height: `${inst.size}px`,
                transitionProperty: "left, top, transform, opacity",
                transitionDuration: isHovered ? "550ms" : "260ms",
                transitionTimingFunction: isHovered
                  ? "cubic-bezier(0.22, 1.4, 0.36, 1)"
                  : "cubic-bezier(0.4, 0, 1, 1)",
                transitionDelay: isHovered ? `${inst.delay}ms` : "0ms",
                transform: isHovered
                  ? `translate(-50%, -50%) rotate(${inst.facingDeg}deg) scale(1)`
                  : "translate(-50%, -50%) rotate(0deg) scale(0)",
                opacity: isHovered ? 1 : 0,
                filter:
                  "drop-shadow(0 2px 3px rgba(0,0,0,0.45)) drop-shadow(0 6px 10px rgba(0,0,0,0.55))",
              }}
            >
              <img src={inst.src} alt="" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      )}

      <article
        onClick={() => onPanelClick(event)}
        className={`group relative bg-[#F5EFDD] border-[5px] border-black flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0px_#FF007F] shadow-[6px_6px_0px_#000] ${tilt} z-30 cursor-pointer`}
      >
        {/* Comic Pow/Zap badges */}
        <div
          className={`absolute -top-6 -left-6 z-40 pointer-events-none transition-all duration-300 transform ${
            isHovered ? "scale-100 opacity-100 rotate-[-12deg]" : "scale-50 opacity-0 rotate-0"
          }`}
        >
          <div className="bg-[#FF007F] text-white border-2 border-black px-2 py-1 font-black text-[10px] uppercase shadow-[3px_3px_0px_#000]">
            POW! 💥
          </div>
        </div>

        <div
          className={`absolute -top-6 -right-6 z-40 pointer-events-none transition-all duration-300 transform ${
            isHovered ? "scale-100 opacity-100 rotate-[12deg]" : "scale-50 opacity-0 rotate-0"
          }`}
        >
          <div className="bg-[#00F2FE] text-black border-2 border-black px-2 py-1 font-black text-[10px] uppercase shadow-[3px_3px_0px_#000]">
            ZAP! ⚡
          </div>
        </div>

        <div className="absolute -top-3 -left-3 z-35 bg-black text-[#F5EFDD] font-black text-[11px] px-3 py-1 border-2 border-black rotate-[-3deg]">
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
          <div className="absolute top-3 right-3 bg-white border-2 border-black rounded-md px-2.5 py-1 shadow-[2px_2px_0_#000] flex items-center gap-1.5 z-10">
            <CalendarIcon className="w-3 h-3 text-black" />
            <span className="font-mono text-[10px] text-black font-bold uppercase tracking-wider">
              {event.date}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 z-10">
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
              <span className="px-4 py-2 bg-black text-[#F5EFDD] text-xs font-black uppercase border-2 border-black group-hover:bg-[#FF007F] group-hover:border-[#FF007F] group-hover:text-white transition-colors flex items-center gap-1.5">
                Register <ExternalLink className="w-3.5 h-3.5" />
              </span>
            ) : isUpcomingWithoutLink ? (
              <span className="font-mono text-xs text-black font-bold uppercase tracking-wider bg-[#00F2FE] px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
                Coming Soon
              </span>
            ) : (
              <span className="font-mono text-xs text-black/50 uppercase tracking-wider bg-black/5 px-3 py-1 border-2 border-black/30">
                Closed
              </span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}