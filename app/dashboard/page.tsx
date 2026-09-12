"use client";

import { useState } from "react";
import { ComicButton } from "@/components/ui/ComicButton";
import { ComicCard } from "@/components/ui/ComicCard";
import { ExternalLink, Plus, X, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

// ─── Static demo game submissions data ─────────────────────────────────
const demoSubmissions = [
  {
    id: "1",
    title: "Project Nexus",
    engine: "Unity 3D",
    genre: "Action RPG",
    itchUrl: "https://itch.io/",
    status: "pending" as const,
    submittedAt: "2 days ago",
    adminComment: "",
  },
  {
    id: "2",
    title: "Flow",
    engine: "HTML5 Canvas",
    genre: "Zen / Particle Sim",
    itchUrl: "https://itch.io/",
    status: "approved" as const,
    submittedAt: "3 months ago",
    adminComment: "Great work! Published to the games archive.",
  },
  {
    id: "3",
    title: "Orbit Drift",
    engine: "Unity",
    genre: "Arcade / Physics",
    itchUrl: "https://itch.io/",
    status: "rejected" as const,
    submittedAt: "1 month ago",
    adminComment: "Please add a proper cover image and game description before resubmitting.",
  },
];

const engineOptions = ["Unity", "Unreal Engine", "Godot 4", "HTML5 Canvas", "Pygame", "Phaser", "MonoGame", "Other"];
const genreOptions = ["Action", "Platformer", "Puzzle", "RPG", "Arcade", "Simulation", "Horror", "Strategy", "Idle", "Zen", "Roguelite", "Other"];
const platformOptions = ["WebGL / Browser", "Windows", "Linux", "macOS", "Android", "iOS", "Itch.io", "Steam"];

// ─── Sub-components ─────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "approved")
    return <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 text-sm font-bold rounded-full"><CheckCircle size={14}/> Approved</span>;
  if (status === "rejected")
    return <span className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 text-sm font-bold rounded-full"><AlertCircle size={14}/> Rejected</span>;
  return <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-3 py-1 text-sm font-bold rounded-full"><Clock size={14}/> Pending Review</span>;
}

function InputField({ label, id, type = "text", placeholder, required, value, onChange }: {
  label: string; id: string; type?: string; placeholder?: string;
  required?: boolean; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} required={required}
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition"
      />
    </div>
  );
}

function TextAreaField({ label, id, placeholder, required, value, onChange, rows = 4 }: {
  label: string; id: string; placeholder?: string;
  required?: boolean; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <textarea
        id={id} placeholder={placeholder} required={required} rows={rows}
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition resize-none"
      />
    </div>
  );
}

function SelectField({ label, id, options, required, value, onChange }: {
  label: string; id: string; options: string[]; required?: boolean;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        id={id} required={required} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition appearance-none"
      >
        <option value="" disabled>Select {label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Submit Form Modal ───────────────────────────────────────────────────
function SubmitGameModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    title: "", tagline: "", description: "", engine: "", genre: "",
    platform: "", itchUrl: "", tags: "", coverUrl: "", videoUrl: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key: string) => (v: string) => setForm(f => ({ ...f, [key]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-[#111118] border border-[#27272a] rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="font-display text-4xl uppercase text-[var(--primary)] mb-4">Submitted!</h2>
          <p className="text-gray-400 mb-8">Your game has been submitted for review. You'll be notified once an admin reviews it.</p>
          <ComicButton variant="primary" className="w-full" onClick={onClose}>Back to Dashboard</ComicButton>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111118] border border-[#27272a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#111118] border-b border-[#27272a] px-8 py-5 flex items-center justify-between">
          <h2 className="font-display text-3xl uppercase tracking-wider text-[var(--primary)]">Submit a Game</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Game Title" id="title" placeholder="Signal Loss" required value={form.title} onChange={set("title")} />
            <InputField label="Tagline" id="tagline" placeholder="A one-line hook" value={form.tagline} onChange={set("tagline")} />
          </div>
          <TextAreaField label="Full Description" id="description" required placeholder="Tell us about your game — mechanics, story, controls..." value={form.description} onChange={set("description")} />

          {/* Tech */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SelectField label="Engine" id="engine" options={engineOptions} required value={form.engine} onChange={set("engine")} />
            <SelectField label="Genre" id="genre" options={genreOptions} required value={form.genre} onChange={set("genre")} />
            <SelectField label="Platform" id="platform" options={platformOptions} required value={form.platform} onChange={set("platform")} />
          </div>

          {/* Links */}
          <InputField label="Itch.io / Steam / WebGL URL" id="itchUrl" type="url" required placeholder="https://yourname.itch.io/game" value={form.itchUrl} onChange={set("itchUrl")} />
          <InputField label="Cover Image URL" id="coverUrl" type="url" placeholder="https://... (1280×720 recommended)" value={form.coverUrl} onChange={set("coverUrl")} />
          <InputField label="Gameplay Video / GIF URL" id="videoUrl" type="url" placeholder="https://youtube.com/... or direct .gif URL" value={form.videoUrl} onChange={set("videoUrl")} />

          {/* Tags */}
          <InputField label="Tech Stack Tags" id="tags" placeholder="unity, c#, pixel-art, multiplayer (comma separated)" value={form.tags} onChange={set("tags")} />

          {/* Disclaimer */}
          <p className="text-xs text-gray-600 border border-[#27272a] rounded-lg p-3">
            By submitting, you confirm this game was made by GDC members and agree to have it listed publicly upon admin approval.
          </p>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-lg border border-[#3f3f46] text-gray-400 hover:bg-white/5 transition font-semibold">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-lg bg-[var(--primary)] text-black font-bold hover:opacity-90 transition font-display text-lg uppercase tracking-wider">
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Submission Card ─────────────────────────────────────────────────────
function SubmissionCard({ sub }: { sub: typeof demoSubmissions[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#111118] border border-[#27272a] rounded-xl overflow-hidden">
      <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="font-display text-2xl uppercase">{sub.title}</h3>
            <StatusBadge status={sub.status} />
          </div>
          <p className="text-sm text-gray-500">{sub.engine} · {sub.genre} · Submitted {sub.submittedAt}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {sub.itchUrl && (
            <a href={sub.itchUrl} target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 bg-[#FA5C5C]/10 text-[#FA5C5C] border border-[#FA5C5C]/30 rounded-lg text-sm font-semibold hover:bg-[#FA5C5C]/20 transition">
              <ExternalLink size={14}/> Itch.io
            </a>
          )}
          {sub.adminComment && (
            <button onClick={() => setOpen(o => !o)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/5 text-gray-300 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition">
              Admin Note {open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
          )}
        </div>
      </div>
      {open && sub.adminComment && (
        <div className="border-t border-[#27272a] bg-[#0d0d12] px-5 py-4">
          <p className="text-sm text-gray-400"><span className="font-semibold text-gray-300">Admin:</span> {sub.adminComment}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [submissions, setSubmissions] = useState(demoSubmissions);

  const handleSubmit = (data: any) => {
    setSubmissions(prev => [{
      id: String(Date.now()),
      title: data.title || "Untitled Game",
      engine: data.engine || "Unknown",
      genre: data.genre || "Unknown",
      itchUrl: data.itchUrl || "",
      status: "pending",
      submittedAt: "Just now",
      adminComment: "",
    }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white py-12">
      {showModal && <SubmitGameModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <p className="text-[var(--primary)] font-semibold text-sm uppercase tracking-widest mb-1">Developer Portal</p>
            <h1 className="font-display text-5xl md:text-6xl uppercase">Dashboard</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-black font-display text-xl uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition"
          >
            <Plus size={22}/> Submit New Game
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Submitted", value: submissions.length },
            { label: "Approved", value: submissions.filter(s => s.status === "approved").length },
            { label: "Pending", value: submissions.filter(s => s.status === "pending").length },
          ].map(stat => (
            <div key={stat.label} className="bg-[#111118] border border-[#27272a] rounded-xl p-5 text-center">
              <div className="font-display text-4xl text-[var(--primary)]">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Submissions */}
        <div className="mb-8">
          <h2 className="font-display text-3xl uppercase mb-5">Your Submissions</h2>
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <div className="text-5xl mb-4">🎮</div>
                <p className="font-display text-2xl uppercase">No Games Yet</p>
                <p className="text-sm mt-2">Hit "Submit New Game" to get started.</p>
              </div>
            ) : (
              submissions.map(sub => <SubmissionCard key={sub.id} sub={sub} />)
            )}
          </div>
        </div>

        {/* Profile card */}
        <div className="bg-[#111118] border border-[#27272a] rounded-xl p-6">
          <h2 className="font-display text-3xl uppercase mb-5 text-[var(--secondary)]">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Display Name" id="pname" placeholder="Your name" value="Cass" onChange={() => {}} />
            <InputField label="GitHub URL" id="pgithub" type="url" placeholder="https://github.com/..." value="" onChange={() => {}} />
            <InputField label="Portfolio URL" id="pportfolio" type="url" placeholder="https://yoursite.dev" value="" onChange={() => {}} />
            <InputField label="Role" id="prole" placeholder="Developer" value="Developer" onChange={() => {}} />
          </div>
          <div className="mt-5">
            <TextAreaField label="Bio" id="pbio" placeholder="Tell the community about yourself..." rows={3} value="" onChange={() => {}} />
          </div>
          <button className="mt-5 px-6 py-2.5 bg-[var(--secondary)] text-black font-bold rounded-lg hover:opacity-90 transition font-display uppercase tracking-wider">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
