import { connect } from "mongoose";
import * as dotenv from "dotenv";
import { events, team, games } from "../lib/data";

dotenv.config({ path: ".env.local" });

// Helper to convert local paths to Cloudinary URLs
// Change 'your-cloud-name' to your actual Cloudinary cloud name
const CLOUDINARY_CLOUD_NAME = "your-cloud-name";
const USE_CLOUDINARY = process.env.USE_CLOUDINARY === "true"; // Set to true to enable Cloudinary

function getImageUrl(localPath: string | undefined | null) {
  if (!localPath) return "";
  
  if (USE_CLOUDINARY) {
    // Example Cloudinary format: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567/gdc-website<localPath>
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/gdc-website${localPath}`;
  }
  
  return localPath;
}

// Define minimal schemas directly so we don't need complex nextjs setup for mongoose models
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  slug: String,
  title: String,
  date: String,
  dateSort: String,
  location: String,
  status: String,
  description: String,
  imageUrl: String,
  shape: String,
  tags: [String],
  registerUrl: String,
  floatingAssets: [String],
  version: String,
});
const EventModel = mongoose.models.Event || mongoose.model("Event", EventSchema);

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  bio: String,
  github: String,
  portfolio: String,
  isAlumni: Boolean,
  team: String,
  level: Number,
  imageUrl: String,
  instagram: String,
  linkedin: String,
});
const TeamMemberModel = mongoose.models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema);

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  developer: { type: String, required: false },
  tagline: { type: String, required: false },
  description: { type: String, required: false },
  engine: { type: String, required: true },
  genre: { type: String, required: true },
  platform: { type: String, required: false },
  itchUrl: { type: String, required: false },
  coverUrl: { type: String, required: false },
  videoUrl: { type: String, required: false },
  tags: { type: String, required: false },
  userEmail: { type: String, required: false },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  featured: { type: Boolean, default: false },
  adminComment: { type: String, default: "" },
}, { timestamps: true });
const GameModel = mongoose.models.Game || mongoose.model("Game", GameSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  await connect(uri);
  console.log("Connected to MongoDB.");

  // Clear existing to avoid duplicates (optional, but safe for a seed script)
  await EventModel.deleteMany({});
  await TeamMemberModel.deleteMany({});
  await GameModel.deleteMany({});
  console.log("Cleared existing data.");

  // List of working images from the public folder to use as fallbacks for broken image links
  const workingImages = [
    "/abyss.png",
    "/cyber-drift.png",
    "/Orbit Drift.png",
    "/Last-Light.png",
    "/spring-game-jam.png",
    "/relax.webp",
    "/college rivals.jpeg"
  ];
  let imageIndex = 0;

  // Insert events
  const eventDocs = events.map((e) => {
    // If image doesn't exist in our known good list, use a working fallback
    let finalImage = e.image;
    if (finalImage && finalImage.startsWith("/images/events/")) {
      finalImage = workingImages[imageIndex % workingImages.length];
      imageIndex++;
    }
    return {
      slug: e.slug,
      title: e.title,
      date: e.date,
      dateSort: e.dateSort,
      location: e.location,
      status: e.status,
      description: e.summary,
      imageUrl: getImageUrl(finalImage),
      shape: (e as any).shape || "half",
      tags: e.tags,
      registerUrl: e.registerUrl || "",
      floatingAssets: (e.floatingAssets || []).map(getImageUrl),
      version: e.version,
    };
  });
  await EventModel.insertMany(eventDocs);
  console.log(`Inserted ${eventDocs.length} events.`);

  // Insert team members
  const teamDocs = team.map((t) => {
    return {
      name: t.name,
      role: t.role,
      bio: t.bio,
      github: t.github || "",
      portfolio: t.portfolio || "",
      isAlumni: (t as any).isAlumni || false,
      team: t.team,
      level: t.level,
      imageUrl: getImageUrl(t.image),
      instagram: (t as any).instagram || "",
      linkedin: (t as any).linkedin || "",
    };
  });
  await TeamMemberModel.insertMany(teamDocs);
  console.log(`Inserted ${teamDocs.length} team members.`);

  // Insert games
  const gameDocs = games.map((g) => ({
    title: g.title,
    developer: g.authors?.join(", ") || "",
    tagline: g.summary,
    description: g.summary,
    engine: g.engine,
    genre: g.genre,
    platform: g.version,
    itchUrl: g.playUrl,
    coverUrl: getImageUrl(g.image),
    tags: g.tags.join(", "),
    status: "approved", // all seeded games are approved
  }));
  await GameModel.insertMany(gameDocs);
  console.log(`Inserted ${gameDocs.length} games.`);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
