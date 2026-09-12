"use client";

import { useState } from "react";
import { X, MapPin, Calendar, Tag, Images } from "lucide-react";

const placeholderImages = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
  "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
  "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80",
];

const statusConfig: Record<string, { label: string; bg: string; border: string; shadow: string; dot: string }> = {
  shipped: { label:"Completed", bg:"#00cc44", border:"#00cc44", shadow:"#004d19", dot:"bg-green-400" },
  live:    { label:"Live Now",  bg:"#1A8FFF", border:"#1A8FFF", shadow:"#003d99", dot:"bg-blue-400" },
  planned: { label:"Upcoming",  bg:"#FFD700", border:"#FFD700", shadow:"#997a00", dot:"bg-yellow-400" },
};

export function EventTimeline({ events }: { events: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div className="relative">

      {/* Comic strip horizontal rule */}
      <div className="absolute left-0 right-0 top-1/2 hidden md:block"
        style={{ height:"4px", background:"repeating-linear-gradient(90deg,#1A8FFF 0,#1A8FFF 20px,transparent 20px,transparent 30px)" }} />

      {/* Timeline panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, i) => {
          const s = statusConfig[event.status] ?? statusConfig.planned;
          const shadowColors = ["#FFD700","#FF2020","#1A8FFF"];
          const sc = shadowColors[i % 3];

          return (
            <div key={event.slug}
              className="group relative border-4 border-white bg-[#0C0C0C] cursor-pointer transition-all duration-150 hover:translate-x-[-4px] hover:translate-y-[-4px] flex flex-col"
              style={{ boxShadow:`6px 6px 0 ${sc}` }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `10px 10px 0 ${sc}`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = `6px 6px 0 ${sc}`)}
              onClick={() => setSelected(event)}
            >
              {/* Top colour stripe = year */}
              <div className="h-2 w-full border-b-4 border-white" style={{ background: s.bg }} />

              {/* Panel number */}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-white text-black border-2 border-black flex items-center justify-center font-display text-xl z-10">
                {i + 1}
              </div>

              <div className="p-5 flex flex-col flex-1">
                {/* Status badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-display text-sm uppercase px-3 py-0.5 border-2 border-white text-black"
                    style={{ background: s.bg }}>
                    {s.label}
                  </span>
                  <span className="font-display text-sm text-gray-400 uppercase">{event.date}</span>
                </div>

                <h3 className="font-display text-3xl uppercase text-white leading-tight mb-2 group-hover:text-[#FFD700] transition-colors">
                  {event.title}
                </h3>

                <p className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">
                  <MapPin size={11} /> {event.location}
                </p>

                {/* Hover reveal — summary */}
                <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-400">
                  <p className="text-sm text-gray-300 leading-relaxed mb-3 border-t-2 border-dashed border-white/20 pt-3">{event.summary}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t-2 border-white/10">
                  {event.tags?.map((tag: string) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 border border-white/30 text-gray-400 uppercase tracking-wider font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* View detail button — appears on hover */}
                <div className="max-h-0 overflow-hidden group-hover:max-h-16 transition-all duration-400 mt-0 group-hover:mt-3">
                  <div className="font-display text-lg uppercase text-center py-2 border-2 border-white text-white hover:bg-white hover:text-black transition-all"
                    style={{ boxShadow:"3px 3px 0 #FFD700" }}>
                    View Details →
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85"
          onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border-4 border-white bg-[#0C0C0C]"
            style={{ boxShadow:"10px 10px 0 #FFD700" }}
            onClick={e => e.stopPropagation()}>

            {/* Header bar */}
            <div className="h-3 border-b-4 border-white"
              style={{ background:`${statusConfig[selected.status]?.bg ?? "#FFD700"}` }} />

            {/* Close */}
            <button onClick={() => setSelected(null)}
              className="absolute top-4 right-4 border-2 border-white bg-[#FF2020] text-white p-1.5 hover:bg-white hover:text-black transition-all z-10"
              style={{ boxShadow:"3px 3px 0 #FFD700" }}>
              <X size={18} />
            </button>

            <div className="p-8">
              {/* Status badge */}
              <span className="inline-block font-display text-lg uppercase px-4 py-1 border-2 border-white text-black mb-4 rotate-[-1deg]"
                style={{ background: statusConfig[selected.status]?.bg ?? "#FFD700",
                         boxShadow:"3px 3px 0 #000" }}>
                {statusConfig[selected.status]?.label}
              </span>

              <h2 className="font-display text-5xl md:text-6xl uppercase text-white mb-5 leading-tight"
                style={{ textShadow:"5px 5px 0 #FFD700" }}>
                {selected.title}
              </h2>

              <div className="flex flex-wrap gap-6 mb-5 border-y-2 border-dashed border-white/20 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
                  <Calendar size={14} className="text-[#1A8FFF]" /> {selected.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
                  <MapPin size={14} className="text-[#FF2020]" /> {selected.location}
                </div>
              </div>

              <p className="text-gray-200 leading-relaxed mb-6 text-base">{selected.summary}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {selected.tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 border-2 border-white/30 text-gray-400 text-xs uppercase tracking-wider font-bold">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Gallery */}
              <div className="border-t-4 border-[#FFD700] pt-6">
                <h3 className="font-display text-3xl uppercase text-white mb-4 flex items-center gap-2">
                  <Images size={22} className="text-[#FFD700]" /> Event Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {placeholderImages.map((src, idx) => (
                    <div key={idx} className="aspect-video border-2 border-white overflow-hidden group"
                      style={{ boxShadow:"3px 3px 0 #1A8FFF" }}>
                      <img src={src} alt={`Event photo ${idx+1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
