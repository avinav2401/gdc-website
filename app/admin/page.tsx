"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle, XCircle, MessageSquare, Palette, Users, Gamepad2,
  Calendar, ExternalLink, Plus, Trash2, Edit3, Save, X, Video, ArrowLeft, Star, StarOff, User as UserIcon, Image as ImageIcon
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

// ─── Shared helpers ─────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = "text", placeholder, autoComplete }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete}
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

function GameReviewCard({ game, onApprove, onReject, onDelete }: { game: any; onApprove: (id: string, note: string) => void; onReject: (id: string, note: string) => void; onDelete: (id: string) => void }) {
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
          <p className="text-gray-500 text-sm">by <span className="text-gray-300">{game.developer || "Unknown"}</span> · {game.engine} · {game.genre} · Submitted {new Date(game.created_at).toLocaleDateString()}</p>
          
          {game.cover_url && (
            <div className="mt-4 mb-2">
              <img src={game.cover_url} alt="Cover" className="w-full max-w-[300px] h-auto rounded-lg border border-[#27272a] object-cover" />
            </div>
          )}

          {game.description && <p className="text-gray-400 text-sm mt-2">{game.description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button onClick={() => setShowComment(s => !s)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-white/5 text-gray-300 border border-white/10 rounded-lg hover:bg-white/10 transition">
            <MessageSquare size={14} /> Note
          </button>
          <button onClick={() => onApprove(game.id, comment)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/25 transition font-semibold">
            <CheckCircle size={14} /> Approve
          </button>
          <button onClick={() => onReject(game.id, comment)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/25 transition font-semibold">
            <XCircle size={14} /> Reject
          </button>
          <button onClick={() => onDelete(game.id)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-900/40 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-900/60 hover:text-red-400 transition font-semibold">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
      {showComment && (
        <div className="mt-4 border-t border-[#27272a] pt-4">
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Add feedback for the developer (optional)..."
            className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[var(--primary)] resize-none" rows={3} />
        </div>
      )}
    </div>
  );
}

// ─── Events CMS ─────────────────────────────────────────────────────────────

function EventsCMS() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  
  const blank = () => ({ title: "", date: "", location: "", status: "planned", description: "", imageUrl: "", shape: "half" });
  const [draft, setDraft] = useState<any>(blank());
  const setD = (k: string) => (v: string) => setDraft((d: any) => ({ ...d, [k]: v }));

  const fetchItems = async () => {
    const res = await fetch("/api/events");
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => { fetchItems(); }, []);

  const save = async () => {
    setError("");
    if (!draft.title || !draft.date || !draft.location || !draft.description) {
      setError("Please fill out all required fields (Title, Date, Location, Description).");
      return;
    }
    
    let res;
    if (adding) {
      res = await fetch("/api/events", { method: "POST", body: JSON.stringify(draft) });
    } else if (editing) {
      res = await fetch(`/api/events/${editing.id}`, { method: "PUT", body: JSON.stringify(draft) });
    }
    
    if (res && !res.ok) {
      setError("Failed to save event. Please try again.");
      return;
    }
    
    setAdding(false);
    setEditing(null);
    setDraft(blank());
    fetchItems();
  };
  
  const del = async (id: string) => {
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    fetchItems();
  };
  
  const startEdit = (e: any) => { setDraft(e); setEditing(e); setAdding(false); setError(""); };
  const startAdd = () => { setDraft(blank()); setAdding(true); setEditing(null); setError(""); };
  const cancel = () => { setAdding(false); setEditing(null); setDraft(blank()); setError(""); };

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
          {error && <div className="text-red-400 text-sm font-bold bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" value={draft.title} onChange={setD("title")} placeholder="Fall Game Jam 2026" />
            <Field label="Date" value={draft.date} onChange={setD("date")} type="date" placeholder="YYYY-MM-DD" />
            <Field label="Location" value={draft.location} onChange={setD("location")} placeholder="Main Auditorium / Online" />
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Status</label>
              <select value={draft.status} onChange={e => setDraft((d: any) => ({ ...d, status: e.target.value }))}
                className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--primary)] transition">
                <option value="planned">Planned</option>
                <option value="live">Live</option>
                <option value="shipped">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Panel Shape</label>
              <select value={draft.shape} onChange={e => setDraft((d: any) => ({ ...d, shape: e.target.value }))}
                className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--primary)] transition">
                <option value="full">Full Width (100%)</option>
                <option value="large">Large (66%)</option>
                <option value="half">Half Width (50%)</option>
                <option value="small">Small (33%)</option>
              </select>
            </div>
          </div>
          <TextArea label="Description" value={draft.description} onChange={setD("description")} placeholder="Short summary of the event..." />
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Cover Image</label>
            <label className="cursor-pointer block">
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const ext = file.name.split('.').pop();
                const path = `events/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
                const { error } = await supabaseBrowser.storage.from("games").upload(path, file);
                if (!error) {
                  const { data } = supabaseBrowser.storage.from("games").getPublicUrl(path);
                  setDraft((prev: any) => ({ ...prev, imageUrl: data.publicUrl }));
                }
              }} />
              <div className="flex flex-col gap-2">
                {draft.imageUrl ? (
                  <div className="relative w-full h-40 border border-[#3f3f46] rounded-xl overflow-hidden group">
                    <img src={draft.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="px-4 py-2 bg-white/20 text-white rounded-lg backdrop-blur-sm font-semibold">
                        Change Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 border-2 border-dashed border-[#3f3f46] rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-[var(--primary)] transition">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-semibold">Upload Image</span>
                  </div>
                )}
                {/* Debug text to verify URL is saved in state */}
                {draft.imageUrl && <div className="text-[10px] text-gray-600 break-all">URL: {draft.imageUrl}</div>}
              </div>
            </label>
          </div>
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

function TeamCMS() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<"all" | "core" | "alumni">("all");
  
  const blank = () => ({ name: "", role: "", bio: "", github: "", portfolio: "", instagram: "", linkedin: "", isAlumni: false, team: "core", level: 4, imageUrl: "" });
  const [draft, setDraft] = useState<any>(blank());
  const setD = (k: string) => (v: any) => setDraft((d: any) => ({ ...d, [k]: v }));

  const fetchItems = async () => {
    const res = await fetch("/api/team");
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => { fetchItems(); }, []);

  const save = async () => {
    if (adding) {
      await fetch("/api/team", { method: "POST", body: JSON.stringify(draft) });
    } else if (editing) {
      await fetch(`/api/team/${editing.id}`, { method: "PUT", body: JSON.stringify(draft) });
    }
    setAdding(false);
    setEditing(null);
    setDraft(blank());
    fetchItems();
  };
  
  const del = async (id: string) => {
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    fetchItems();
  };
  
  const startEdit = (m: any) => { 
    setDraft({ ...blank(), ...m, level: m.level ?? 4, team: m.team || "core" }); 
    setEditing(m); 
    setAdding(false); 
  };
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
            <Field label="Instagram URL" value={draft.instagram} onChange={setD("instagram")} placeholder="https://instagram.com/..." type="url" />
            <Field label="LinkedIn URL" value={draft.linkedin} onChange={setD("linkedin")} placeholder="https://linkedin.com/in/..." type="url" />
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Category</label>
              <select value={draft.team} onChange={e => setD("team")(e.target.value)}
                className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--secondary)] transition">
                <option value="core">Core Team</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Skill Level</label>
              <select value={draft.level} onChange={e => setD("level")(parseInt(e.target.value))}
                className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--secondary)] transition">
                <option value={4}>Level 4 (Initiate)</option>
                <option value={3}>Level 3 (Operative)</option>
                <option value={2}>Level 2 (Guild Master)</option>
                <option value={1}>Level 1 (Director)</option>
                <option value={0}>Level 0 (Faculty)</option>
              </select>
            </div>
          </div>
          <TextArea label="Bio" value={draft.bio} onChange={setD("bio")} placeholder="Short bio..." />
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Profile Photo</label>
            <label className="flex items-center gap-4 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const ext = file.name.split('.').pop();
                const path = `team/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
                const { error } = await supabaseBrowser.storage.from("games").upload(path, file);
                if (!error) {
                  const { data } = supabaseBrowser.storage.from("games").getPublicUrl(path);
                  setD("imageUrl")(data.publicUrl);
                }
              }} />
              <div className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] rounded-lg text-sm font-semibold transition">
                {draft.imageUrl ? "Change Photo" : "Upload Photo"}
              </div>
              {draft.imageUrl && (
                <img src={draft.imageUrl} alt="Preview" className="w-12 h-12 rounded object-cover border border-[#3f3f46]" />
              )}
            </label>
          </div>
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
                  {m.isAlumni ? "Alumni" : "Active"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-500/15 text-blue-300 border-blue-500/30">
                  {m.team === "faculty" ? "Faculty" : "Core"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
                  LVL {m.level ?? 4}
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

// ─── Members CMS ─────────────────────────────────────────────────────────────

function MembersCMS() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [adding, setAdding] = useState(false);
  
  const blank = () => ({ name: "", email: "", password: "", role: "member" });
  const [draft, setDraft] = useState<any>(blank());
  const setD = (k: string) => (v: string) => setDraft((d: any) => ({ ...d, [k]: v }));

  const fetchItems = async () => {
    const res = await fetch("/api/users");
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => { fetchItems(); }, []);

  const save = async () => {
    if (adding) {
      await fetch("/api/users", { method: "POST", body: JSON.stringify(draft) });
    } else if (editing) {
      await fetch(`/api/users/${editing.id}`, { method: "PUT", body: JSON.stringify(draft) });
    }
    setAdding(false);
    setEditing(null);
    setDraft(blank());
    fetchItems();
  };
  
  const del = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchItems();
  };
  
  const startEdit = (m: any) => { setDraft(m); setEditing(m); setAdding(false); };
  const cancel = () => { setAdding(false); setEditing(null); setDraft(blank()); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-2xl uppercase text-[#00f2fe]">Registered Members</h3>
        <button onClick={() => { setDraft(blank()); setAdding(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#00f2fe] text-black font-bold rounded-lg hover:opacity-90 transition text-sm uppercase">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {(adding || editing) && (
        <div className="bg-[#0d0d12] border border-[#00f2fe]/40 rounded-xl p-6 mb-6 space-y-4">
          <h4 className="font-display text-xl uppercase text-gray-300">{adding ? "New Member" : "Edit Member"}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" value={draft.name} onChange={setD("name")} placeholder="Jane Doe" />
            <Field label="Email" value={draft.email} onChange={setD("email")} placeholder="dev@college.edu" />
            <Field label="Password" value={draft.password} onChange={setD("password")} placeholder="Password..." type="text" />
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Role</label>
              <select value={draft.role} onChange={e => setDraft((d: any) => ({ ...d, role: e.target.value }))}
                className="w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--primary)] transition">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
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
        {items.map(m => (
          <div key={m.id} className="bg-[#111118] border border-[#27272a] rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-display text-xl uppercase">{m.name || "Unnamed"}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${m.role === 'admin' ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-[#00f2fe]/15 text-[#00f2fe] border-[#00f2fe]/30"}`}>
                  {m.role}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{m.email}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => startEdit(m)} className="p-2 text-gray-400 hover:text-[#00f2fe] hover:bg-white/5 rounded-lg transition"><Edit3 size={16} /></button>
              <button onClick={() => del(m.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Games Archive CMS ───────────────────────────────────────────────────────

function GamesCMS() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [filter, setFilter] = useState("all");
  
  const blank = () => ({ title: "", engine: "", genre: "", itchUrl: "", developer: "", featured: false });
  const [draft, setDraft] = useState<any>(blank());
  const setD = (k: string) => (v: any) => setDraft((d: any) => ({ ...d, [k]: v }));

  const fetchItems = async () => {
    const res = await fetch("/api/games");
    if (res.ok) {
      setItems(await res.json());
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const save = async () => {
    if (editing) {
      await fetch(`/api/games/${editing.id}`, { method: "PUT", body: JSON.stringify(draft) });
    }
    setEditing(null);
    setDraft(blank());
    fetchItems();
  };
  
  const del = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this game? This action cannot be undone.")) return;
    await fetch(`/api/games/${id}`, { method: "DELETE" });
    fetchItems();
  };
  
  const startEdit = (g: any) => { setDraft(g); setEditing(g); };
  
  const toggleFeatured = async (id: string, featured: boolean) => {
    await fetch(`/api/games/${id}`, { method: "PUT", body: JSON.stringify({ featured: !featured }) });
    fetchItems();
  };
  
  const cancel = () => { setEditing(null); setDraft(blank()); };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-2xl uppercase text-yellow-400">Games Archive</h3>
          <p className="text-gray-500 text-sm">Manage all game submissions. Star = featured on homepage.</p>
        </div>
        <div className="flex gap-1 bg-[#0d0d12] p-1 rounded-lg border border-[#27272a] self-start md:self-auto">
          {["all", "approved", "pending", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wide rounded-md font-semibold transition ${filter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {editing && (
        <div className="bg-[#0d0d12] border border-yellow-500/40 rounded-xl p-6 mb-6 space-y-4">
          <h4 className="font-display text-xl uppercase text-gray-300">Edit Game</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" value={draft.title} onChange={setD("title")} />
            <Field label="Developer" value={draft.developer} onChange={setD("developer")} />
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
        {(filter === "all" ? items : items.filter(g => g.status === filter)).map(g => (
          <div key={g.id} className="bg-[#111118] border border-[#27272a] rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-display text-xl uppercase">{g.title}</h4>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${g.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : g.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{g.status}</span>
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
              <button onClick={() => toggleFeatured(g.id, g.featured)} title="Toggle featured"
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
  const [videoUrl, setVideoUrl] = useState("");
  const [saved, setSaved] = useState(true);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data && data.heroVideoUrl) {
        setVideoUrl(data.heroVideoUrl);
        setPreview(data.heroVideoUrl);
      }
    });
  }, []);

  const handleSave = async () => {
    await fetch("/api/settings", { method: "PUT", body: JSON.stringify({ heroVideoUrl: videoUrl }) });
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
        {preview && (
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
        )}

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
  const [activeSection, setActiveSection] = useState<"home" | "events" | "team" | "games" | "video" | "members">("home");

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
        {activeSection === "members" && <MembersCMS />}
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
        { icon: UserIcon, label: "Members", desc: "View and manage registered members.", color: "text-[#00f2fe]", section: "members" as const, btnColor: "bg-[#00f2fe]" },
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

// ─── Admin Login Component ───────────────────────────────────────────────────

function AdminLoginForm({ onLogin }: { onLogin: () => void }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok && data.success && data.role === "admin") {
        localStorage.setItem('gdc_role', data.role);
        localStorage.setItem('gdc_admin_auth', 'true');
        if (data.name) {
          localStorage.setItem('gdc_name', data.name);
        }
        onLogin();
      } else {
        setErrorMsg(data.error || "Access Denied. Admins only.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center bg-[var(--bg)] py-12 px-4">
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#f472b6 1px, transparent 1px), linear-gradient(90deg, #f472b6 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="relative z-10 w-full max-w-md bg-[#111118] border border-[#27272a] rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👑</div>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[var(--secondary)]">Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm font-semibold text-center">
              {errorMsg}
            </div>
          )}
          <Field label="Admin Email" value={form.email} onChange={v => set("email")({target: {value: v}} as any)} placeholder="admin@college.edu" autoComplete="off" />
          <Field label="Password" value={form.password} onChange={v => set("password")({target: {value: v}} as any)} type="password" placeholder="••••••••" autoComplete="new-password" />
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-[var(--secondary)] text-black font-display text-xl uppercase rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50">
            {loading ? "Authenticating..." : "Access Control Center →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('gdc_admin_auth') === 'true') {
      setAuthorized(true);
    }
  }, []);

  const [tab, setTab] = useState<"games" | "theme" | "cms">("games");
  
  const [games, setGames] = useState<any[]>([]);
  const [theme, setTheme] = useState({
    primary: "#38bdf8", secondary: "#f472b6", bg: "#0d0d12", bgDark: "#050508", yellow: "#fbbf24"
  });

  const fetchGames = async () => {
    const res = await fetch("/api/games");
    if (res.ok) {
      const data = await res.json();
      setGames(data);
    }
  };

  const fetchTheme = async () => {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      if (data && data.theme) {
        setTheme(data.theme);
        applyThemeVariables(data.theme);
      }
    }
  }

  useEffect(() => {
    if (authorized) {
      fetchGames();
      fetchTheme();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  const handleApprove = async (id: string, comment: string) => {
    await fetch(`/api/games/${id}`, { method: "PUT", body: JSON.stringify({ status: "approved", adminComment: comment }) });
    fetchGames();
  };
  
  const handleReject = async (id: string, comment: string) => {
    await fetch(`/api/games/${id}`, { method: "PUT", body: JSON.stringify({ status: "rejected", adminComment: comment }) });
    fetchGames();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this game? This action cannot be undone.")) return;
    await fetch(`/api/games/${id}`, { method: "DELETE" });
    fetchGames();
  };

  const handleLogout = () => {
    localStorage.removeItem('gdc_admin_auth');
    router.push('/auth');
  };

  function applyThemeVariables(t: typeof theme) {
    const root = document.documentElement;
    root.style.setProperty("--primary", t.primary);
    root.style.setProperty("--secondary", t.secondary);
    root.style.setProperty("--bg", t.bg);
    root.style.setProperty("--bg-dark", t.bgDark);
    root.style.setProperty("--comic-yellow", t.yellow);
  }

  const saveTheme = async () => {
    await fetch("/api/settings", { method: "PUT", body: JSON.stringify({ theme }) });
    applyThemeVariables(theme);
  };

  if (!authorized) {
    return <AdminLoginForm onLogin={() => setAuthorized(true)} />;
  }

  const pendingGames = games.filter(g => g.status === "pending");
  const approvedGames = games.filter(g => g.status === "approved");
  const rejectedGames = games.filter(g => g.status === "rejected");

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <p className="text-[var(--secondary)] text-sm font-semibold uppercase tracking-widest mb-1">Admin Portal</p>
            <h1 className="font-display text-5xl md:text-6xl uppercase">Control Center</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Review", value: pendingGames.length, color: "text-yellow-400" },
            { label: "Total Approved", value: approvedGames.length, color: "text-emerald-400" },
            { label: "Rejected", value: rejectedGames.length, color: "text-red-400" },
            { label: "Total Games", value: games.length, color: "text-[var(--primary)]" },
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
            {pendingGames.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <div className="text-5xl mb-4">✅</div>
                <p className="font-display text-2xl uppercase">All Clear!</p>
                <p className="text-sm mt-2">No pending game submissions.</p>
              </div>
            ) : pendingGames.map(game => (
              <GameReviewCard key={game.id} game={game} onApprove={handleApprove} onReject={handleReject} onDelete={handleDelete} />
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
              <button onClick={saveTheme} className="px-8 py-3 bg-[var(--primary)] text-black font-display text-lg uppercase rounded-xl hover:opacity-90 transition font-bold">
                Apply to Site
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
