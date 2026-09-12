import mongoose, { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema({
  singleton_id: { type: String, default: "global" }, // Used to ensure we only have one settings document
  theme: {
    primary: { type: String, default: "#38bdf8" },
    secondary: { type: String, default: "#f472b6" },
    bg: { type: String, default: "#0d0d12" },
    bgDark: { type: String, default: "#050508" },
    yellow: { type: String, default: "#fbbf24" },
  },
  heroVideoUrl: { type: String, default: "https://cdn.pixabay.com/video/2020/07/20/45184-442220456_large.mp4" },
}, { timestamps: true });

const Settings = models.Settings || model("Settings", SettingsSchema);
export default Settings;
