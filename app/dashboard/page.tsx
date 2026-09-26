"use client";

import { useState, useEffect } from "react";
import { ComicButton } from "@/components/ui/ComicButton";
import { ExternalLink, Plus, X, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Image as ImageIcon, UploadCloud, Link as LinkIcon, Gamepad2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

const engineOptions = ["Unity", "Unreal Engine", "Godot 4", "HTML5 Canvas", "Pygame", "Phaser", "MonoGame", "Other"];
const genreOptions = ["Action", "Platformer", "Puzzle", "RPG", "Arcade", "Simulation", "Horror", "Strategy", "Idle", "Zen", "Roguelite", "Other"];
const platformOptions = ["WebGL / Browser", "Windows", "Linux", "macOS", "Android", "iOS", "Itch.io", "Steam"];

// Helper to determine the right headers for Unity WebGL files
function getWebGLMimeType(fileName: string) {
  let contentType = "application/octet-stream";
  let contentEncoding = undefined;

  // Handle compression headers
  if (fileName.endsWith(".gz")) {
    contentEncoding = "gzip";
    fileName = fileName.slice(0, -3); // Strip .gz to find actual type
  } else if (fileName.endsWith(".br")) {
    contentEncoding = "br";
    fileName = fileName.slice(0, -3); // Strip .br to find actual type
  }

  // Handle MIME types
  if (fileName.endsWith(".wasm")) contentType = "application/wasm";
  else if (fileName.endsWith(".js")) contentType = "application/javascript";
  else if (fileName.endsWith(".html")) contentType = "text/html";
  else if (fileName.endsWith(".css")) contentType = "text/css";
  else if (fileName.endsWith(".data")) contentType = "application/octet-stream";

  return { contentType, contentEncoding };
}

// ─── Sub-components ─────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "approved")
    return <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 text-sm font-bold rounded-full"><CheckCircle size={14} /> Approved</span>;
  if (status === "rejected")
    return <span className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 text-sm font-bold rounded-full"><AlertCircle size={14} /> Rejected</span>;
  return <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-3 py-1 text-sm font-bold rounded-full"><Clock size={14} /> Pending Review</span>;
}

function InputField({ label, id, type = "text", placeholder, required, value, onChange, readOnly }: {
  label: string; id: string; type?: string; placeholder?: string;
  required?: boolean; value: string; onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} required={required}
        value={value} onChange={e => onChange(e.target.value)}
        readOnly={readOnly}
        className={`w-full bg-[#0d0d12] border border-[#3f3f46] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition ${readOnly ? "opacity-60 cursor-not-allowed" : "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"}`}
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
    developer: "Developer Name", // Placeholder for now
  });
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
  const [webglFiles, setWebglFiles] = useState<FileList | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: string) => (v: string) => setForm(f => ({ ...f, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalPlayUrl = "";

    if (webglFiles && webglFiles.length > 0) {
      const gameId = form.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();

      let indexHtmlPath = "";
      const total = webglFiles.length;
      let uploadErrors = 0;

      for (let i = 0; i < total; i++) {
        const file = webglFiles[i];
        const path = `${gameId}/${file.webkitRelativePath}`;

        const { contentType, contentEncoding } = getWebGLMimeType(file.name);

        // Upload to Supabase with the correct headers for WebGL
        const { error } = await supabaseBrowser.storage.from("games").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType,
          // @ts-expect-error - Supabase types don't list contentEncoding, but the API accepts it
          contentEncoding,
        });

        if (error) {
          console.error(`Upload failed for ${file.name}:`, error);
          uploadErrors++;
        }

        // The root folder is usually the first part of webkitRelativePath
        // We want to find the main index.html
        if (file.name === "index.html" || file.webkitRelativePath.endsWith("/index.html")) {
          indexHtmlPath = path;
        }

        setUploadProgress(Math.round(((i + 1) / total) * 100));
      }

      if (uploadErrors > 0) {
        alert(`Warning: ${uploadErrors} file(s) failed to upload. The game may not work correctly.`);
      }

      if (indexHtmlPath) {
        const { data } = supabaseBrowser.storage.from("games").getPublicUrl(indexHtmlPath);
        finalPlayUrl = data.publicUrl;
      }
    } else {
       alert("Please select a WebGL build folder to upload!");
       setUploading(false);
       return;
    }

    let finalCoverUrl = form.coverUrl;
    if (coverFile) {
      const ext = coverFile.name.split('.').pop();
      const path = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { error } = await supabaseBrowser.storage.from("games").upload(path, coverFile, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        console.error("Cover upload failed:", error);
      } else {
        const { data } = supabaseBrowser.storage.from("games").getPublicUrl(path);
        finalCoverUrl = data.publicUrl;
      }
    }

    onSubmit({ ...form, itchUrl: finalPlayUrl, coverUrl: finalCoverUrl });
    setSubmitted(true);
    setUploading(false);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-md w-full text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--primary)] mb-4">Submitted!</h2>
          <p className="text-gray-400 mb-8 font-medium">Your game has been submitted for review. You'll be notified once an admin reviews it.</p>
          <button className="w-full py-3 bg-[var(--primary)] text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]" onClick={onClose}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-lg border-b border-white/10 px-8 py-5 flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--primary)]">Submit a Game</h2>
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

          {/* Hosting */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Game Hosting (Native WebGL)</label>

            <div className="border border-dashed border-[#3f3f46] rounded-lg p-5 text-center bg-[#0d0d12]">
              <label className="cursor-pointer flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
                  <UploadCloud size={24} />
                </div>
                <div className="font-semibold text-white">Select WebGL Build Folder</div>
                <div className="text-xs text-gray-500 max-w-xs">Upload your exported HTML5/WebGL folder. Must contain an <code className="text-gray-300">index.html</code>.</div>
                {/* @ts-expect-error - webkitdirectory is not in standard React typings */}
                <input type="file" webkitdirectory="" directory="" multiple className="hidden" onChange={(e) => setWebglFiles(e.target.files)} />
              </label>
              {webglFiles && webglFiles.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#27272a] text-sm text-emerald-400 font-mono">
                  <CheckCircle size={14} className="inline mr-1" /> {webglFiles.length} files selected
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Cover Image (Supabase)</label>
              <label className="w-full flex items-center justify-center gap-2 bg-[#0d0d12] border border-[#3f3f46] border-dashed rounded-lg px-4 py-3 text-gray-400 hover:text-white hover:border-[var(--primary)] transition cursor-pointer">
                <ImageIcon size={20} />
                <span className="truncate max-w-[200px]">
                  {coverFile ? coverFile.name : (form.coverUrl ? "Image Uploaded! Click to Change" : "Upload Cover Image")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCoverFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            <InputField label="Gameplay Video / GIF URL" id="videoUrl" type="url" placeholder="https://youtube.com/... or direct .gif URL" value={form.videoUrl} onChange={set("videoUrl")} />
          </div>

          {/* Tags */}
          <InputField label="Tech Stack Tags" id="tags" placeholder="unity, c#, pixel-art, multiplayer (comma separated)" value={form.tags} onChange={set("tags")} />

          {/* Disclaimer */}
          <p className="text-xs text-gray-600 border border-[#27272a] rounded-lg p-3">
            By submitting, you confirm this game was made by GDC members and agree to have it listed publicly upon admin approval.
          </p>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition-all font-bold text-sm uppercase tracking-wider">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-black font-black hover:opacity-90 transition-all text-sm uppercase tracking-widest disabled:opacity-50 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]">
              {uploading ? `Uploading... ${uploadProgress}%` : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Submission Card ─────────────────────────────────────────────────────
function SubmissionCard({ sub }: { sub: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-white/20 transition-colors duration-300">
      <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">{sub.title}</h3>
            <StatusBadge status={sub.status} />
          </div>
          <p className="text-sm text-gray-500">{sub.engine} · {sub.genre} · Submitted {new Date(sub.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {sub.adminComment && (
            <button onClick={() => setOpen(o => !o)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 text-gray-300 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition">
              Admin Note {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState("Developer");
  const [userRole, setUserRole] = useState("Member");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setIsAuth(localStorage.getItem("gdc_admin_auth") === "true");

    const role = localStorage.getItem("gdc_role") || "member";
    setUserRole(role.charAt(0).toUpperCase() + role.slice(1));

    const name = localStorage.getItem("gdc_name");
    if (name) setUserName(name);

    const gh = localStorage.getItem("gdc_github");
    if (gh) setGithubUrl(gh);
    const pf = localStorage.getItem("gdc_portfolio");
    if (pf) setPortfolioUrl(pf);
    const b = localStorage.getItem("gdc_bio");
    if (b) setBio(b);

    const handleStorage = () => {
      setIsAuth(localStorage.getItem("gdc_admin_auth") === "true");
      const r = localStorage.getItem("gdc_role") || "member";
      setUserRole(r.charAt(0).toUpperCase() + r.slice(1));
      const n = localStorage.getItem("gdc_name");
      if (n) setUserName(n);

      const gh = localStorage.getItem("gdc_github");
      if (gh) setGithubUrl(gh);
      const pf = localStorage.getItem("gdc_portfolio");
      if (pf) setPortfolioUrl(pf);
      const b = localStorage.getItem("gdc_bio");
      if (b) setBio(b);
    };

    const handleOpenSubmit = () => setShowModal(true);

    window.addEventListener("storage", handleStorage);
    window.addEventListener("open-submit-modal", handleOpenSubmit);

    // Also check query param on initial load
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("action") === "submit") {
        setShowModal(true);
        window.history.replaceState({}, '', '/dashboard');
      }
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("open-submit-modal", handleOpenSubmit);
    };
  }, []);

  const fetchSubmissions = async () => {
    const name = localStorage.getItem("gdc_name");
    if (!name) return;
    const res = await fetch(`/api/games?developer=${encodeURIComponent(name)}`);
    if (res.ok) {
      setSubmissions(await res.json());
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmit = async (data: any) => {
    const userEmail = localStorage.getItem("gdc_email") || "";
    const userName = localStorage.getItem("gdc_name") || "Developer";
    const payload = { ...data, userEmail, developer: userName };
    await fetch("/api/games", { method: "POST", body: JSON.stringify(payload) });
    fetchSubmissions();
  };

  const handleUpdateProfile = () => {
    localStorage.setItem("gdc_github", githubUrl);
    localStorage.setItem("gdc_portfolio", portfolioUrl);
    localStorage.setItem("gdc_bio", bio);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-[var(--secondary)]/10 rounded-full blur-[120px] pointer-events-none" />
      
      {showModal && <SubmitGameModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <p className="text-[var(--primary)] text-sm font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" /> Developer Portal
            </p>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Dashboard
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-black font-black text-sm uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
          >
            <Plus size={18} /> Submit New Game
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Submitted", value: submissions.length },
            { label: "Approved", value: submissions.filter(s => s.status === "approved").length },
            { label: "Pending", value: submissions.filter(s => s.status === "pending").length },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 font-black text-5xl tracking-tighter text-[var(--primary)] drop-shadow-md">{stat.value}</div>
              <div className="relative z-10 text-gray-400 text-xs mt-2 uppercase tracking-widest font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Submissions */}
        <div className="mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 text-white">Your Submissions</h2>
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-inner">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6 text-gray-400">
                  <Gamepad2 size={40} />
                </div>
                <p className="text-3xl font-black uppercase tracking-tighter text-white">No Games Yet</p>
                <p className="text-gray-400 mt-2 font-medium">Hit "Submit New Game" to get started.</p>
              </div>
            ) : (
              submissions.map(sub => <SubmissionCard key={sub.id} sub={sub} />)
            )}
          </div>
        </div>

        {/* Profile card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 text-[var(--secondary)] relative z-10">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
            <InputField label="Display Name" id="pname" placeholder="Your name" value={userName} onChange={() => { }} readOnly />
            <InputField label="GitHub URL" id="pgithub" type="url" placeholder="https://github.com/..." value={githubUrl} onChange={setGithubUrl} />
            <InputField label="Portfolio URL" id="pportfolio" type="url" placeholder="https://yoursite.dev" value={portfolioUrl} onChange={setPortfolioUrl} />
            <InputField label="Role" id="prole" placeholder="Role" value={userRole} onChange={() => { }} readOnly />
          </div>
          <div className="mt-5 relative z-10">
            <TextAreaField label="Bio" id="pbio" placeholder="Tell the community about yourself..." rows={3} value={bio} onChange={setBio} />
          </div>
          <button
            onClick={handleUpdateProfile}
            className="mt-6 px-8 py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] relative z-10"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
