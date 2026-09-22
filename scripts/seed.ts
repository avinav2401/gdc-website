import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { events, team, games } from "../lib/data";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getImageUrl(localPath: string | undefined | null) {
  if (!localPath) return "";
  return localPath;
}

async function seed() {
  console.log("Connected to Supabase.");

  // Clear existing (optional, but safe for a seed script)
  console.log("Clearing existing data...");
  await supabase.from("events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("games").delete().neq("id", "00000000-0000-0000-0000-000000000000");
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
    let finalImage = e.image;
    if (finalImage && finalImage.startsWith("/images/events/")) {
      finalImage = workingImages[imageIndex % workingImages.length];
      imageIndex++;
    }
    return {
      slug: e.slug,
      title: e.title,
      date: e.date,
      date_sort: e.dateSort,
      location: e.location,
      status: e.status,
      description: e.summary,
      image_url: getImageUrl(finalImage),
      shape: (e as any).shape || "half",
      tags: e.tags,
      register_url: e.registerUrl || "",
      floating_assets: (e.floatingAssets || []).map(getImageUrl),
      version: e.version,
    };
  });
  
  if (eventDocs.length > 0) {
    const { error: eventError } = await supabase.from("events").insert(eventDocs);
    if (eventError) console.error("Error inserting events:", eventError.message);
    else console.log(`Inserted ${eventDocs.length} events.`);
  }

  // Insert team members
  const teamDocs = team.map((t) => {
    return {
      name: t.name,
      role: t.role,
      bio: t.bio,
      github: t.github || "",
      portfolio: t.portfolio || "",
      is_alumni: (t as any).isAlumni || false,
      team: t.team,
      level: t.level,
      image_url: getImageUrl(t.image),
      instagram: (t as any).instagram || "",
      linkedin: (t as any).linkedin || "",
    };
  });

  if (teamDocs.length > 0) {
    const { error: teamError } = await supabase.from("team_members").insert(teamDocs);
    if (teamError) console.error("Error inserting team members:", teamError.message);
    else console.log(`Inserted ${teamDocs.length} team members.`);
  }

  // Insert games
  const gameDocs = games.map((g) => ({
    title: g.title,
    developer: g.authors?.join(", ") || "",
    tagline: g.summary,
    description: g.summary,
    engine: g.engine,
    genre: g.genre,
    platform: g.version,
    itch_url: g.playUrl,
    cover_url: getImageUrl(g.image),
    tags: g.tags.join(", "),
    status: "approved",
  }));

  if (gameDocs.length > 0) {
    const { error: gameError } = await supabase.from("games").insert(gameDocs);
    if (gameError) console.error("Error inserting games:", gameError.message);
    else console.log(`Inserted ${gameDocs.length} games.`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
