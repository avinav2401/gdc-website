"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Plus, X, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Image as ImageIcon, UploadCloud, Link as LinkIcon, Gamepad2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { SubmitGameModal, InputField, TextAreaField } from "@/components/ui/SubmitGameModal";

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "approved")
    return <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 text-sm font-bold rounded-full"><CheckCircle size={14} /> Approved</span>;
  if (status === "rejected")
    return <span className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 text-sm font-bold rounded-full"><AlertCircle size={14} /> Rejected</span>;
  return <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-3 py-1 text-sm font-bold rounded-full"><Clock size={14} /> Pending Review</span>;
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
