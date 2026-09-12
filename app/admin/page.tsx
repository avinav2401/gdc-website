"use client";

import { useState } from "react";
import {
  CheckCircle, XCircle, MessageSquare, Palette, Users, Gamepad2,
  Calendar, ExternalLink, Plus, Trash2, Edit3, Save, X, Video, ArrowLeft, Star, StarOff
} from "lucide-react";

// ─── Seed data ─────────────────────────────────────────────────────────────

const pendingGames = [
  { id: "1", title: "Project Nexus", developer: "Ankit Mandal", engine: "Unity 3D", genre: "Action RPG", itchUrl: "https://itch.io/", submittedAt: "2 days ago" },
  { id: "2", title: "Void Runner", developer: "Priya Sharma", engine: "Godot 4", genre: "Endless Runner", itchUrl: "https://itch.io/", submittedAt: "5 hours ago" },
];

const seedEvents = [
  { id: "e1", title: "Fall Game Jam 2026", date: "November 2026", location: "TBD", status: "planned", description: "Our flagship annual jam. 48 hours, judged showcase." },
  { id: "e2", title: "Godot Basics Workshop", date: "September 2026", location: "CS Block, Lab 3", status: "planned", description: "Four-part hands-on Godot series." },
  { id: "e3", title: "Club Wars 2026", date: "March 2026", location: "Main Auditorium", status: "shipped", description: "Inter-club 48hr sprint — GDC took 1st and 3rd." },
];

const seedTeam = [
  { id: "t1", name: "Club President", role: "President", bio: "Sets the yearly roadmap.", github: "", portfolio: "", isAlumni: false },
  { id: "t2", name: "Technical Lead", role: "Technical Lead", bio: "Owns workshops and reviews prototypes.", github: "", portfolio: "", isAlumni: false },
  { id: "t3", name: "Art Lead", role: "Art Lead", bio: "Curates visual identity of showcases.", github: "", portfolio: "", isAlumni: false },
  { id: "t4", name: "Previous President", role: "Founder / Alumni", bio: "Founded GDC in 2023.", github: "", portfolio: "", isAlumni: true },
];

const seedGames = [
  { id: "g1", title: "Flow", engine: "HTML5 Canvas", genre: "Zen", itchUrl: "https://itch.io/", featured: true },
  { id: "g2", title: "Orbit Drift", engine: "Unity", genre: "Arcade", itchUrl: "https://itch.io/", featured: true },
  { id: "g3", title: "Signal Loss", engine: "Godot 4", genre: "Puzzle", itchUrl: "https://itch.io/", featured: false },
  { id: "g4", title: "Last Light", engine: "Godot 4", genre: "Roguelite", itchUrl: "https://itch.io/", featured: false },
];

const themeDefaults = {
  primary: "#38bdf8",
  secondary: "#f472b6",
  bg: "#0d0d12",
  bgDark: "#050508",
  yellow: "#fbbf24",
};

// ─── Shared helpers ─────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary)] transition" />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
      <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary)] transition resize-none" />
    </div>
  );
}

function TabButton({ label, active, onClick, icon: Icon }: { label: string; active: boolean; onClick: () => void; icon: any }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 font-display text-lg uppercase tracking-wider rounded-xl transition ${active ? "bg-[var(--primary)] text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
      <Icon size={18} /> {label}
    </button>
  );
}

// ─── Game Approval ──────────────────────────────────────────────────────────

function GameReviewCard({ game, onApprove, onReject }: { game: typeof pendingGames[0]; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  return (
    <div className="bg-[#111118] border border-[#27272a] rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h3 className="font-display text-2xl uppercase">{game.title}</h3>
            <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">Pending</span>
          </div>
          <p className="text-gray-500 text-sm">by <span className="text-gray-300">{game.developer}</span> · {game.engine} · {game.genre} · Submitted {game.submittedAt}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {game.itchUrl && (
            <a href={game.itchUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#FA5C5C]/10 text-[#FA5C5C] border border-[#FA5C5C]/30 rounded-lg hover:bg-[#FA5C5C]/20 transition">
              <ExternalLink size={14} /> View Game
            </a>
          )}
          <button onClick={() => setShowComment(s => !s)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-white/5 text-gray-300 border border-white/10 rounded-lg hover:bg-white/10 transition">
            <MessageSquare size={14} /> Note
          </button>
          <button onClick={() => onApprove(game.id)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/25 transition font-semibold">
            <CheckCircle size={14} /> Approve
          </button>
          <button onClick={() => onReject(game.id)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/25 transition font-semibold">
            <XCircle size={14} /> Reject
          </button>
        </div>
      </div>
      {showComment && (
        <div className="mt-4 border-t border-[#27272a] pt-4">
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Add feedback for the developer..."
            className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[var(--primary)] resize-none" rows={3} />
          <button className="mt-2 px-5 py-2 text-sm bg-[var(--primary)] text-black font-bold rounded-lg hover:opacity-90 transition uppercase tracking-wider">Send Note</button>
        </div>
      )}
    </div>
  );
}

// ─── Events CMS ─────────────────────────────────────────────────────────────

type EventItem = typeof seedEvents[0];

function EventsCMS() {
  const [items, setItems] = useState(seedEvents);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [adding, setAdding] = useState(false);
  const blank = (): EventItem => ({ id: Date.now().toString(), title: "", date: "", location: "", status: "planned", description: "" });
  const [draft, setDraft] = useState<EventItem>(blank());
  const setD = (k: keyof EventItem) => (v: string) => setDraft(d => ({ ...d, [k]: v }));

  const save = () => {
    if (adding) { setItems(i => [draft, ...i]); setAdding(false); }
    else if (editing) { setItems(i => i.map(x => x.id === editing.id ? draft : x)); setEditing(null); }
    setDraft(blank());
  };
  const del = (id: string) => setItems(i => i.filter(x => x.id !== id));
  const startEdit = (e: EventItem) => { setDraft(e); setEditing(e); setAdding(false); };
  const startAdd = () => { setDraft(blank()); setAdding(true); setEditing(null); };
  const cancel = () => { setAdding(false); setEditing(null); setDraft(blank()); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl uppercase text-[var(--primary)]">Events & Workshops</h3>
        <button onClick={startAdd} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-bold rounded-lg hover:opacity-90 transition text-sm uppercase">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {(adding || editing) && (
        <div className="bg-[#0d0d12] border border-[var(--primary)]/40 rounded-xl p-6 mb-6 space-y-4">
          <h4 className="font-display text-xl uppercase text-gray-300 mb-2">{adding ? "New Event" : "Edit Event"}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" value={draft.title} onChange={setD("title")} placeholder="Fall Game Jam 2026" />
            <Field label="Date" value={draft.date} onChange={setD("date")} placeholder="November 2026" />
            <Field label="Location" value={draft.location} onChange={setD("location")} placeholder="Main Auditorium / Online" />
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Status</label>
              <select value={draft.status} onChange={e => setDraft(d => ({ ...d, status: e.target.value }))}
                className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--primary)] transition">
                <option value="planned">Planned</option>
                <option value="live">Live</option>
                <option value="shipped">Completed</option>
              </select>
            </div>
          </div>
          <TextArea label="Description" value={draft.description} onChange={setD("description")} placeholder="Short summary of the event..." />
          <div className="flex gap-3">
            <button onClick={save} className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:opacity-90 transition text-sm uppercase">
              <Save size={16} /> Save
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-5 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(ev => (
          <div key={ev.id} className="bg-[#111118] border border-[#27272a] rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-display text-xl uppercase">{ev.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${ev.status === "shipped" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : ev.status === "live" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}>
                  {ev.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{ev.date} · {ev.location}</p>
              <p className="text-gray-600 text-sm mt-1">{ev.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => startEdit(ev)} className="p-2 text-gray-400 hover:text-[var(--primary)] hover:bg-white/5 rounded-lg transition"><Edit3 size={16} /></button>
              <button onClick={() => del(ev.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Team CMS ────────────────────────────────────────────────────────────────

type TeamMember = typeof seedTeam[0];

function TeamCMS() {
  const [items, setItems] = useState(seedTeam);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<"all" | "core" | "alumni">("all");
  const blank = (): TeamMember => ({ id: Date.now().toString(), name: "", role: "", bio: "", github: "", portfolio: "", isAlumni: false });
  const [draft, setDraft] = useState<TeamMember>(blank());
  const setD = (k: keyof TeamMember) => (v: any) => setDraft(d => ({ ...d, [k]: v }));

  const save = () => {
    if (adding) { setItems(i => [draft, ...i]); setAdding(false); }
    else if (editing) { setItems(i => i.map(x => x.id === editing.id ? draft : x)); setEditing(null); }
    setDraft(blank());
  };
  const del = (id: string) => setItems(i => i.filter(x => x.id !== id));
  const startEdit = (m: TeamMember) => { setDraft(m); setEditing(m); setAdding(false); };
  const cancel = () => { setAdding(false); setEditing(null); setDraft(blank()); };

  const filtered = items.filter(m => filter === "all" ? true : filter === "alumni" ? m.isAlumni : !m.isAlumni);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-2xl uppercase text-[var(--secondary)]">Team & Alumni</h3>
        <button onClick={() => { setDraft(blank()); setAdding(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] text-black font-bold rounded-lg hover:opacity-90 transition text-sm uppercase">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "core", "alumni"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${filter === f ? "bg-[var(--secondary)] text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {f === "all" ? "All" : f === "core" ? "Core Team" : "Alumni"}
          </button>
        ))}
      </div>

      {(adding || editing) && (
        <div className="bg-[#0d0d12] border border-[var(--secondary)]/40 rounded-xl p-6 mb-6 space-y-4">
          <h4 className="font-display text-xl uppercase text-gray-300">{adding ? "New Member" : "Edit Member"}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" value={draft.name} onChange={setD("name")} placeholder="Jane Doe" />
            <Field label="Role / Title" value={draft.role} onChange={setD("role")} placeholder="Technical Lead" />
            <Field label="GitHub URL" value={draft.github} onChange={setD("github")} placeholder="https://github.com/..." type="url" />
            <Field label="Portfolio URL" value={draft.portfolio} onChange={setD("portfolio")} placeholder="https://..." type="url" />
          </div>
          <TextArea label="Bio" value={draft.bio} onChange={setD("bio")} placeholder="Short bio..." />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={draft.isAlumni} onChange={e => setD("isAlumni")(e.target.checked)}
              className="w-4 h-4 accent-[var(--secondary)]" />
            <span className="text-sm text-gray-300">Mark as Alumni (not current core team)</span>
          </label>
          <div className="flex gap-3">
            <button onClick={save} className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:opacity-90 transition text-sm uppercase">
              <Save size={16} /> Save
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-5 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(m => (
          <div key={m.id} className="bg-[#111118] border border-[#27272a] rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-display text-xl uppercase">{m.name || "Unnamed"}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${m.isAlumni ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-[var(--secondary)]/15 text-[var(--secondary)] border-[var(--secondary)]/30"}`}>
                  {m.isAlumni ? "Alumni" : "Core"}
                </span>
              </div>
              <p className="text-[var(--secondary)] text-sm font-semibold">{m.role}</p>
              <p className="text-gray-600 text-sm mt-1">{m.bio}</p>
              <div className="flex gap-3 mt-2">
                {m.github && <a href={m.github} target="_blank" rel="noreferrer" className="text-xs text-[var(--primary)] hover:underline">GitHub ↗</a>}
                {m.portfolio && <a href={m.portfolio} target="_blank" rel="noreferrer" className="text-xs text-[var(--primary)] hover:underline">Portfolio ↗</a>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => startEdit(m)} className="p-2 text-gray-400 hover:text-[var(--secondary)] hover:bg-white/5 rounded-lg transition"><Edit3 size={16} /></button>
              <button onClick={() => del(m.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Games Archive CMS ───────────────────────────────────────────────────────

type GameItem = typeof seedGames[0];

function GamesCMS() {
  const [items, setItems] = useState(seedGames);
  const [editing, setEditing] = useState<GameItem | null>(null);
  const blank = (): GameItem => ({ id: Date.now().toString(), title: "", engine: "", genre: "", itchUrl: "", featured: false });
  const [draft, setDraft] = useState<GameItem>(blank());
  const setD = (k: keyof GameItem) => (v: any) => setDraft(d => ({ ...d, [k]: v }));

  const save = () => {
    if (editing) { setItems(i => i.map(x => x.id === editing.id ? draft : x)); setEditing(null); }
    setDraft(blank());
  };
  const del = (id: string) => setItems(i => i.filter(x => x.id !== id));
  const startEdit = (g: GameItem) => { setDraft(g); setEditing(g); };
  const toggleFeatured = (id: string) => setItems(i => i.map(x => x.id === id ? { ...x, featured: !x.featured } : x));
  const cancel = () => { setEditing(null); setDraft(blank()); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl uppercase text-yellow-400">Games Archive</h3>
        <p className="text-gray-500 text-sm">Approved games listed below. Star = featured on homepage.</p>
      </div>

      {editing && (
        <div className="bg-[#0d0d12] border border-yellow-500/40 rounded-xl p-6 mb-6 space-y-4">
          <h4 className="font-display text-xl uppercase text-gray-300">Edit Game</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" value={draft.title} onChange={setD("title")} />
            <Field label="Engine" value={draft.engine} onChange={setD("engine")} />
            <Field label="Genre" value={draft.genre} onChange={setD("genre")} />
            <Field label="Itch.io / Game URL" value={draft.itchUrl} onChange={setD("itchUrl")} type="url" placeholder="https://..." />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={draft.featured} onChange={e => setD("featured")(e.target.checked)} className="w-4 h-4 accent-yellow-400" />
            <span className="text-sm text-gray-300">Feature on homepage</span>
          </label>
          <div className="flex gap-3">
            <button onClick={save} className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:opacity-90 transition text-sm uppercase">
              <Save size={16} /> Save
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-5 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(g => (
          <div key={g.id} className="bg-[#111118] border border-[#27272a] rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-display text-xl uppercase">{g.title}</h4>
                {g.featured && <span className="text-xs px-2 py-0.5 rounded-full border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Featured</span>}
              </div>
              <p className="text-gray-500 text-sm">{g.engine} · {g.genre}</p>
              {g.itchUrl && (
                <a href={g.itchUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-1 text-xs text-[#FA5C5C] hover:underline">
                  <ExternalLink size={11} /> {g.itchUrl}
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleFeatured(g.id)} title="Toggle featured"
                className={`p-2 rounded-lg transition ${g.featured ? "text-yellow-400 hover:text-yellow-200 bg-yellow-500/10" : "text-gray-600 hover:text-yellow-400 hover:bg-yellow-500/10"}`}>
                {g.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
              </button>
              <button onClick={() => startEdit(g)} className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition"><Edit3 size={16} /></button>
              <button onClick={() => del(g.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hero Video CMS ──────────────────────────────────────────────────────────

function HeroVideoCMS() {
  const defaultUrl = "https://cdn.pixabay.com/video/2020/07/20/45184-442220456_large.mp4";
  const [videoUrl, setVideoUrl] = useState(defaultUrl);
  const [saved, setSaved] = useState(true);
  const [preview, setPreview] = useState(defaultUrl);

  const handleSave = () => {
    setPreview(videoUrl);
    setSaved(true);
  };

  return (
    <div>
      <h3 className="font-display text-2xl uppercase text-emerald-400 mb-6">Hero Video URL</h3>

      <div className="bg-[#0d0d12] border border-[#27272a] rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Video URL (MP4 or hosted link)</label>
          <div className="flex gap-3">
            <input type="url" value={videoUrl} onChange={e => { setVideoUrl(e.target.value); setSaved(false); }}
              placeholder="https://..."
              className="flex-1 bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[var(--primary)] transition" />
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-3 font-bold rounded-lg transition text-sm uppercase ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-500 text-black hover:opacity-90"}`}>
              <Save size={16} /> {saved ? "Saved" : "Apply"}
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-2">Paste a direct .mp4 URL or a CDN-hosted video link. The video will autoplay muted in a loop on the homepage hero.</p>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Live Preview</label>
          <div className="relative rounded-xl overflow-hidden border border-[#27272a] bg-black aspect-video">
            <video key={preview} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-70">
              <source src={preview} type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-end p-4">
              <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full font-mono truncate max-w-full">{preview}</span>
            </div>
          </div>
        </div>

        {/* Quick presets */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Gaming / Dark", url: "https://cdn.pixabay.com/video/2020/07/20/45184-442220456_large.mp4" },
              { label: "Code / Matrix", url: "https://cdn.pixabay.com/video/2016/12/28/6976-197634425_large.mp4" },
              { label: "Particles", url: "https://cdn.pixabay.com/video/2016/09/01/4962-181482670_large.mp4" },
            ].map(preset => (
              <button key={preset.label} onClick={() => { setVideoUrl(preset.url); setSaved(false); }}
                className="px-3 py-1.5 text-xs bg-white/5 text-gray-400 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition">
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main CMS Panel ──────────────────────────────────────────────────────────

function CMSPanel() {
  const [activeSection, setActiveSection] = useState<"home" | "events" | "team" | "games" | "video">("home");

  if (activeSection !== "home") {
    return (
      <div>
        <button onClick={() => setActiveSection("home")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-6">
          <ArrowLeft size={16} /> Back to CMS
        </button>
        {activeSection === "events" && <EventsCMS />}
        {activeSection === "team" && <TeamCMS />}
        {activeSection === "games" && <GamesCMS />}
        {activeSection === "video" && <HeroVideoCMS />}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { icon: Calendar, label: "Events & Workshops", desc: "Add, edit, or remove upcoming events and game jams.", color: "text-[var(--primary)]", section: "events" as const, btnColor: "bg-[var(--primary)]" },
        { icon: Users, label: "Team & Alumni", desc: "Manage core team members, alumni, and their profiles.", color: "text-[var(--secondary)]", section: "team" as const, btnColor: "bg-[var(--secondary)]" },
        { icon: Gamepad2, label: "Games Archive", desc: "Edit approved game listings, reorder featured games.", color: "text-yellow-400", section: "games" as const, btnColor: "bg-yellow-400" },
        { icon: Video, label: "Hero Video URL", desc: "Update the background video shown in the hero section.", color: "text-emerald-400", section: "video" as const, btnColor: "bg-emerald-400" },
      ].map(item => (
        <button key={item.label} onClick={() => setActiveSection(item.section)}
          className="bg-[#111118] border border-[#27272a] rounded-xl p-6 text-left hover:bg-white/5 hover:border-[#3f3f46] transition group">
          <item.icon size={32} className={`${item.color} mb-4`} />
          <h3 className="font-display text-2xl uppercase mb-2 group-hover:text-white transition">{item.label}</h3>
          <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
          <span className={`inline-block text-black text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest ${item.btnColor}`}>
            Manage →
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<"games" | "theme" | "cms">("games");
  const [games, setGames] = useState(pendingGames);
  const [theme, setTheme] = useState(themeDefaults);
  const [approved, setApproved] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const handleApprove = (id: string) => { setApproved(a => [...a, id]); setGames(g => g.filter(x => x.id !== id)); };
  const handleReject = (id: string) => { setRejected(r => [...r, id]); setGames(g => g.filter(x => x.id !== id)); };

  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--bg-dark", theme.bgDark);
    root.style.setProperty("--comic-yellow", theme.yellow);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[var(--secondary)] text-sm font-semibold uppercase tracking-widest mb-1">Admin Portal</p>
          <h1 className="font-display text-5xl md:text-6xl uppercase">Control Center</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Review", value: games.length, color: "text-yellow-400" },
            { label: "Approved Today", value: approved.length, color: "text-emerald-400" },
            { label: "Rejected", value: rejected.length, color: "text-red-400" },
            { label: "Total Members", value: 48, color: "text-[var(--primary)]" },
          ].map(s => (
            <div key={s.label} className="bg-[#111118] border border-[#27272a] rounded-xl p-4 text-center">
              <div className={`font-display text-4xl ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-[#111118] border border-[#27272a] rounded-2xl">
          <TabButton label="Game Approvals" icon={Gamepad2} active={tab === "games"} onClick={() => setTab("games")} />
          <TabButton label="Theme Editor" icon={Palette} active={tab === "theme"} onClick={() => setTab("theme")} />
          <TabButton label="CMS" icon={Calendar} active={tab === "cms"} onClick={() => setTab("cms")} />
        </div>

        {/* Game Approvals */}
        {tab === "games" && (
          <div className="space-y-4">
            {games.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <div className="text-5xl mb-4">✅</div>
                <p className="font-display text-2xl uppercase">All Clear!</p>
                <p className="text-sm mt-2">No pending game submissions.</p>
              </div>
            ) : games.map(game => (
              <GameReviewCard key={game.id} game={game} onApprove={handleApprove} onReject={handleReject} />
            ))}
          </div>
        )}

        {/* Theme Editor */}
        {tab === "theme" && (
          <div className="bg-[#111118] border border-[#27272a] rounded-2xl p-8">
            <h2 className="font-display text-3xl uppercase mb-2 text-[var(--primary)]">Live Theme Customizer</h2>
            <p className="text-gray-500 text-sm mb-8">Changes apply site-wide instantly via CSS variables.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: "Primary Accent", key: "primary" },
                { label: "Secondary Accent", key: "secondary" },
                { label: "Background", key: "bg" },
                { label: "Background Dark", key: "bgDark" },
                { label: "Yellow / Highlight", key: "yellow" },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300">{label}</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={(theme as any)[key]} onChange={e => setTheme(t => ({ ...t, [key]: e.target.value }))}
                      className="w-12 h-12 rounded-lg border border-[#3f3f46] cursor-pointer bg-transparent" />
                    <input type="text" value={(theme as any)[key]} onChange={e => setTheme(t => ({ ...t, [key]: e.target.value }))}
                      className="flex-1 bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[var(--primary)] transition" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={applyTheme} className="px-8 py-3 bg-[var(--primary)] text-black font-display text-lg uppercase rounded-xl hover:opacity-90 transition font-bold">
                Apply to Site
              </button>
              <button onClick={() => setTheme(themeDefaults)} className="px-6 py-3 border border-[#3f3f46] text-gray-400 rounded-xl hover:bg-white/5 transition text-sm">
                Reset Defaults
              </button>
            </div>
          </div>
        )}

        {/* CMS */}
        {tab === "cms" && <CMSPanel />}
      </div>
    </div>
  );
}
