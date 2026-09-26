"use client";

import { useState } from "react";
import { X, CheckCircle, UploadCloud, Image as ImageIcon } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

const engineOptions = ["Unity", "Unreal Engine", "Godot 4", "HTML5 Canvas", "Pygame", "Phaser", "MonoGame", "Other"];
const genreOptions = ["Action", "Platformer", "Puzzle", "RPG", "Arcade", "Simulation", "Horror", "Strategy", "Idle", "Zen", "Roguelite", "Other"];
const platformOptions = ["WebGL / Browser", "Windows", "Linux", "macOS", "Android", "iOS", "Itch.io", "Steam"];

function getWebGLMimeType(fileName: string) {
  let contentType = "application/octet-stream";
  let contentEncoding = undefined;
  if (fileName.endsWith(".gz")) {
    contentEncoding = "gzip";
    fileName = fileName.slice(0, -3);
  } else if (fileName.endsWith(".br")) {
    contentEncoding = "br";
    fileName = fileName.slice(0, -3);
  }
  if (fileName.endsWith(".wasm")) contentType = "application/wasm";
  else if (fileName.endsWith(".js")) contentType = "application/javascript";
  else if (fileName.endsWith(".html")) contentType = "text/html";
  else if (fileName.endsWith(".css")) contentType = "text/css";
  else if (fileName.endsWith(".data")) contentType = "application/octet-stream";
  return { contentType, contentEncoding };
}

export function InputField({ label, id, type = "text", placeholder, required, value, onChange, readOnly }: {
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

export function TextAreaField({ label, id, placeholder, required, value, onChange, rows = 4 }: {
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

export function SelectField({ label, id, options, required, value, onChange }: {
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

export function SubmitGameModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    title: "", tagline: "", description: "", engine: "", genre: "",
    platform: "", itchUrl: "", tags: "", coverUrl: "", videoUrl: "",
    developer: "Developer Name",
  });
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

        const { error } = await supabaseBrowser.storage.from("games").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType,
          // @ts-expect-error - Supabase Storage API accepts contentEncoding but types are incomplete
          contentEncoding,
        });

        if (error) {
          console.error(`Upload failed for ${file.name}:`, error);
          uploadErrors++;
        }

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
          <button className="w-full py-3 bg-[var(--primary)] text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-lg border-b border-white/10 px-8 py-5 flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--primary)] m-0">Submit a Game</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Game Title" id="title" placeholder="Signal Loss" required value={form.title} onChange={set("title")} />
            <InputField label="Tagline" id="tagline" placeholder="A one-line hook" value={form.tagline} onChange={set("tagline")} />
          </div>
          <TextAreaField label="Full Description" id="description" required placeholder="Tell us about your game — mechanics, story, controls..." value={form.description} onChange={set("description")} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SelectField label="Engine" id="engine" options={engineOptions} required value={form.engine} onChange={set("engine")} />
            <SelectField label="Genre" id="genre" options={genreOptions} required value={form.genre} onChange={set("genre")} />
            <SelectField label="Platform" id="platform" options={platformOptions} required value={form.platform} onChange={set("platform")} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Game Hosting (Native WebGL)</label>
            <div className="border border-dashed border-[#3f3f46] rounded-lg p-5 text-center bg-[#0d0d12]">
              <label className="cursor-pointer flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
                  <UploadCloud size={24} />
                </div>
                <div className="font-semibold text-white">Select WebGL Build Folder</div>
                <div className="text-xs text-gray-500 max-w-xs">Upload your exported HTML5/WebGL folder. Must contain an <code className="text-gray-300">index.html</code>.</div>
                {/* @ts-expect-error - webkitdirectory is non-standard but required for folder selection */}
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

          <InputField label="Tech Stack Tags" id="tags" placeholder="unity, c#, pixel-art, multiplayer (comma separated)" value={form.tags} onChange={set("tags")} />

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
