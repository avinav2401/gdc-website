import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { events, team, games } from "../lib/data";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
  process.exit(1);
}

if (!supabaseSecretKey) {
  console.error("SUPABASE_SECRET_KEY is not set in .env.local");
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);

const CLOUDINARY_CLOUD_NAME = "your-cloud-name";
const USE_CLOUDINARY = process.env.USE_CLOUDINARY === "true";

function getImageUrl(localPath: string | undefined | null) {
  if (!localPath) return "";

  if (USE_CLOUDINARY) {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/gdc-website${localPath}`;
  }

  return localPath;
}

async function seed() {
  console.log("Connecting to Supabase...");

  console.log("Clearing existing data...");

  const { error: eventsDeleteError } = await supabase
    .from("events")
    .delete()
    .not("id", "is", null);

  if (eventsDeleteError) {
    console.error("Failed to clear events:", eventsDeleteError);
    throw eventsDeleteError;
  }

  const { error: teamDeleteError } = await supabase
    .from("team_members")
    .delete()
    .not("id", "is", null);

  if (teamDeleteError) {
    console.error("Failed to clear team members:", teamDeleteError);
    throw teamDeleteError;
  }

  const { error: gamesDeleteError } = await supabase
    .from("games")
    .delete()
    .not("id", "is", null);

  if (gamesDeleteError) {
    console.error("Failed to clear games:", gamesDeleteError);
    throw gamesDeleteError;
  }

  console.log("Existing data cleared.");

  const workingImages = [
    "/abyss.png",
    "/cyber-drift.png",
    "/Orbit Drift.png",
    "/Last-Light.png",
    "/spring-game-jam.png",
    "/relax.webp",
    "/college rivals.jpeg",
  ];

  let imageIndex = 0;

  console.log("Preparing events...");

  const eventDocs = events.map((e) => {
    let finalImage = e.image;

    if (finalImage && finalImage.startsWith("/images/events/")) {
      finalImage =
        workingImages[imageIndex % workingImages.length];

      imageIndex++;
    }

    return {
      slug: e.slug,
      title: e.title,
      date: e.date,
      date_sort: e.dateSort || e.date,
      location: e.location,
      status: e.status || "planned",
      description: e.summary || "",
      image_url: getImageUrl(finalImage),
      shape: (e as any).shape || "half",
      tags: e.tags || [],
      register_url: e.registerUrl || "",
      floating_assets: (e.floatingAssets || []).map(getImageUrl),
      version: e.version || "GDC-DB",
    };
  });

  if (eventDocs.length > 0) {
    const { error } = await supabase
      .from("events")
      .insert(eventDocs);

    if (error) {
      console.error("Failed to insert events:", error);
      throw error;
    }
  }

  console.log(`Inserted ${eventDocs.length} events.`);

  console.log("Preparing team members...");

  const teamDocs = team.map((t) => {
    return {
      name: t.name,
      role: t.role,
      bio: t.bio || "",
      github: t.github || "",
      portfolio: t.portfolio || "",
      is_alumni: (t as any).isAlumni || false,
      team: t.team || "core",
      level: t.level ?? 4,
      image_url: getImageUrl(t.image),
      instagram: (t as any).instagram || "",
      linkedin: (t as any).linkedin || "",
      focus: (t as any).focus || [],
    };
  });

  if (teamDocs.length > 0) {
    const { error } = await supabase
      .from("team_members")
      .insert(teamDocs);

    if (error) {
      console.error(
        "Failed to insert team members:",
        error
      );

      throw error;
    }
  }

  console.log(`Inserted ${teamDocs.length} team members.`);

  console.log("Preparing games...");

  const gameDocs = games.map((g) => ({
    title: g.title,
    developer: g.authors?.join(", ") || "",
    tagline: g.summary || "",
    description: g.summary || "",
    engine: g.engine,
    genre: g.genre,
    platform: g.version || "",
    itch_url: g.playUrl || "",
    cover_url: getImageUrl(g.image),
    video_url: "",
    tags: g.tags?.join(", ") || "",
    user_email: "",
    status: "approved",
    featured: false,
    admin_comment: "",
  }));

  if (gameDocs.length > 0) {
    const { error } = await supabase
      .from("games")
      .insert(gameDocs);

    if (error) {
      console.error("Failed to insert games:", error);
      throw error;
    }
  }

  console.log(`Inserted ${gameDocs.length} games.`);

  console.log("");
  console.log("====================================");
  console.log("        SUPABASE SEED COMPLETE      ");
  console.log("====================================");
  console.log(`Events:       ${eventDocs.length}`);
  console.log(`Team Members: ${teamDocs.length}`);
  console.log(`Games:        ${gameDocs.length}`);
  console.log("====================================");
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });