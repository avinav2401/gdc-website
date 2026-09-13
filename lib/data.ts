// ─────────────────────────────────────────────────────────────
// All editable club content lives here. Update this file to
// change events, team, games, and socials across the whole site.
// ─────────────────────────────────────────────────────────────

export type EventStatus = "shipped" | "live" | "planned";
export interface ClubEvent {
  slug: string;
  title: string;
  status: "shipped" | "live" | "planned" | "archived";
  version: string;
  date: string;
  dateSort: string;
  location: string;
  summary: string;
  tags: string[];
  image: string;
  registerUrl?: string;
  shape?: string;
}

export const events: ClubEvent[] = [
  // --- 2025 ARCHIVED VOLUMES ---
  {
    slug: "snap-ar-hackathon-2025",
    title: "Snap AR Hackathon",
    status: "archived",
    version: "v1.0",
    date: "October 2025",
    dateSort: "2025-10-15",
    location: "Tech Park Lab",
    summary:
      "A collaborative AR development event organized in partnership with Snapchat, where teams designed and developed interactive lenses and filters.",
    tags: ["hackathon", "ar", "snapchat", "workshop"],
    image: "/images/events/snap-ar-2025.jpg",
  },
  {
    slug: "void-start-game-expo-2025",
    title: "Game Expo: Void Start(); Public Fun()",
    status: "archived",
    version: "v2.0",
    date: "May 2025",
    dateSort: "2025-05-09",
    location: "Main Campus Atrium",
    summary:
      "Showcasing fully functional game projects developed by gaming technology students using Unity and Blender, highlighting 3D environments and gameplay mechanics.",
    tags: ["expo", "unity", "blender", "showcase"],
    image: "/images/events/void-start-2025.jpg",
  },
  {
    slug: "unreal-blender-workshop-2025",
    title: "Unreal Engine & Blender Workshop",
    status: "archived",
    version: "v1.0",
    date: "March 2025",
    dateSort: "2025-03-24",
    location: "Tech Park 2",
    summary:
      "A hands-on learning experience across two focused tracks introducing fundamentals of game environment creation, asset integration, and rendering.",
    tags: ["workshop", "unreal", "blender", "3d"],
    image: "/images/events/unreal-blender-2025.jpg",
  },

  // --- 2026 VOLUMES ---
  {
    slug: "pixel-art-masterclass-2026",
    title: "Pixel Art & Aseprite Masterclass",
    status: "shipped",
    version: "v3.2",
    date: "April 2026",
    dateSort: "2026-04-18",
    location: "Tech Park, Lab 4",
    summary:
      "A deep-dive hands-on workshop on creating game-ready tilesets, character sprite sheets, and animations using Aseprite.",
    tags: ["workshop", "pixel art", "aseprite", "art"],
    image: "/images/events/pixel-art-workshop.jpg",
  },
  {
    slug: "club-wars-2026",
    title: "Club Wars 2026",
    status: "shipped",
    version: "v3.0",
    date: "March 2026",
    dateSort: "2026-03-14",
    location: "Main Auditorium",
    summary:
      "Our inter-club showdown — a 48-hour build sprint pitting five college clubs against each other for a single mechanic-driven prototype. GDC teams took first and third.",
    tags: ["game jam", "inter-club", "48hr"],
    image: "/images/events/club-wars-2026.jpg",
  },
  {
    slug: "spring-game-jam",
    title: "Spring Game Jam",
    status: "shipped",
    version: "v2.1",
    date: "February 2026",
    dateSort: "2026-02-08",
    location: "CS Block, Lab 3",
    summary:
      "A weekend jam themed around a single mechanic. Teams of 2-4 shipped playable builds in 36 hours — Unity, Godot, and a few brave souls in raw HTML5 canvas.",
    tags: ["game jam", "36hr", "solo mechanic"],
    image: "spring-game-jam.png",
  },
  {
    slug: "member-recruitment-drive",
    title: "Recruitment Drive — Batch of 2030",
    status: "live",
    version: "v1.4",
    date: "Ongoing — through September 2026",
    dateSort: "2026-09-30",
    location: "Club Room + Discord",
    summary:
      "Open sign-ups for first-years. No experience required — bring curiosity. Weekly onboarding sessions cover engine basics, git, and how the club actually works.",
    tags: ["onboarding", "recruitment"],
    image: "/images/events/recruitment-2030.jpg",
    registerUrl: "https://discord.gg/gdc-srm",
  },
  
];
export type Role = "core" | "faculty";

export interface Member {
  name: string;
  role: string;
  team: Role;
  bio: string;
  focus?: string[]; // areas: design, programming, art, production, etc
  level: 0 | 1 | 2 | 3 | 4; // Operational hierarchy level for the skill tree
  image?: string;
  isAlumni?: boolean;
  github?: string;
  portfolio?: string;
  instagram?: string;
  linkedin?: string;
}

export const team: Member[] = [
  {
    name: "Faculty Coordinator",
    role: "Faculty in Charge",
    team: "faculty",
    bio: "Oversees club operations, approves budgets and venue bookings, and mentors project direction across every jam cycle.",
    focus: ["mentorship", "administration"],
    level: 0,
  },
  {
    name: "Club President",
    role: "President",
    team: "core",
    bio: "Sets the club's yearly roadmap, represents GDC to the student council, and runs core team meetings.",
    focus: ["leadership", "production"],
    level: 1,
  },
  {
    name: "Vice President",
    role: "Vice President",
    team: "core",
    bio: "Runs day-to-day operations and steps in on event logistics, sponsorships, and cross-club coordination.",
    focus: ["operations", "logistics"],
    level: 2,
    image: "/team/vp.jpg",
  },
  {
    name: "Technical Lead",
    role: "Technical Lead",
    team: "core",
    bio: "Owns the engine workshops and reviews team prototypes for architecture and scope before jam deadlines.",
    focus: ["programming", "engines"],
    level: 3,
  },
  {
    name: "Design Lead",
    role: "Design Lead",
    team: "core",
    bio: "Runs the game design assignments and helps teams scope a single strong mechanic before they touch an editor.",
    focus: ["game design", "prototyping"],
    level: 3,
  },
  {
    name: "Art Lead",
    role: "Art Lead",
    team: "core",
    bio: "Curates the visual identity of club showcases and mentors members on pixel art, shaders, and UI polish.",
    focus: ["art", "ui/ux"],
    level: 3,
  },
  {
    name: "Events Coordinator",
    role: "Events Coordinator",
    team: "core",
    bio: "Plans and runs Club Wars, jams, and workshops end to end — bookings, schedules, judging panels.",
    focus: ["events", "production"],
    level: 4,
  },
  {
    name: "Outreach Lead",
    role: "Outreach & Socials",
    team: "core",
    bio: "Runs recruitment drives and keeps Instagram, LinkedIn, and Unstop listings current with what the club is shipping.",
    focus: ["outreach", "community"],
    level: 4,
  },
];


export interface Game {
  slug: string;
  title: string;
  status: "shipped" | "in-development" | "prototype";
  version: string;
  authors: string[];
  engine: string;
  genre: string;
  summary: string;
  tags: string[];
  image?: string | null;
  playUrl?: string;
}
export const games: Game[] = [
  {
    slug: "flow",
    title: "Flow",
    status: "shipped",
    version: "v1.0",
    authors: ["Cass"],
    engine: "HTML5 Canvas",
    genre: "Zen / Particle Sim",
    summary:
      "A meditative particle playground — draw currents across the canvas and watch thousands of particles respond in real time. No score, no fail state, just flow.",
    tags: ["casual", "generative", "browser"],
    image: "/Flow.png",
    playUrl: "https://itch.io",
  },
  {
    slug: "signal-loss",
    title: "Signal Loss",
    status: "in-development",
    version: "v0.6",
    authors: ["Club Wars Team Alpha"],
    engine: "Godot 4",
    genre: "Puzzle / Stealth",
    summary:
      "Navigate a decommissioned research station using only sound cues — your flashlight draws enemies in. Built during Club Wars 2026, now in post-jam expansion.",
    tags: ["stealth", "puzzle", "audio-driven"],
    image: "/Signal lost.png",
    playUrl: "https://itch.io",
  },
  {
    slug: "orbit-drift",
    title: "Orbit Drift",
    status: "shipped",
    version: "v1.2",
    authors: ["Spring Jam Team"],
    engine: "Unity",
    genre: "Arcade / Physics",
    summary:
      "A one-button gravity game — slingshot your ship between orbits to collect fuel before it runs out. Built in 36 hours for Spring Game Jam.",
    tags: ["arcade", "physics", "one-button"],
    image: "/Orbit Drift.png",
    playUrl: "https://itch.io",
  },
  {
    slug: "last-light",
    title: "Last Light",
    status: "prototype",
    version: "v0.2",
    authors: ["Fall Jam Prep Squad"],
    engine: "Godot 4",
    genre: "Survival / Roguelite",
    summary:
      "An early prototype exploring a light-management roguelite — every light source you carry attracts danger. Built as a pre-jam scoping exercise.",
    tags: ["roguelite", "prototype", "survival"],
    image: "/Last-Light.png",
    playUrl: "https://itch.io",
  },
  {
    slug: "cyber-drift-88",
    title: "Cyber Drift '88",
    status: "shipped",
    version: "v1.0",
    authors: ["Pixel Wave Interactive"],
    engine: "Unity",
    genre: "Synthwave / Racing",
    summary:
      "Race through neon-drenched gridlines in this retro arcade racer. Drift around sharp corners to charge up boost meters.",
    tags: ["racing", "synthwave", "arcade"],
    image: "/cyber-drift.png",
    playUrl: "https://itch.io",
  },
  {
    slug: "echoes-of-the-abyss",
    title: "Echoes of the Abyss",
    status: "in-development",
    version: "v0.4",
    authors: ["Void Craft Studios"],
    engine: "Unreal Engine 5",
    genre: "Atmospheric / Exploration",
    summary:
      "Descend into an underwater alien ecosystem. Manage oxygen, scan bioluminescent fauna, and uncover sunken structures.",
    tags: ["exploration", "scifi", "3d"],
    image: "/abyss.png",
    playUrl: "https://itch.io",
  },
  {
    slug: "clockwork-dungeon",
    title: "Clockwork Dungeon",
    status: "prototype",
    version: "v0.1",
    authors: ["Gearhead Devs"],
    engine: "Godot 4",
    genre: "Turn-Based / Strategy",
    summary:
      "Every step you take turns the gears of the room. Rotate rooms and align doorways to outsmart mechanical guardians.",
    tags: ["turn-based", "puzzle", "steampunk"],
    image: "/clockwork.png",
    playUrl: "https://itch.io",
  },
];
export const socials = [
  {
    label: "Instagram",
    handle: "@gdc.college",
    url: "https://instagram.com/",
  },
  {
    label: "LinkedIn",
    handle: "Game Developer's Community",
    url: "https://linkedin.com/",
  },
  {
    label: "Unstop",
    handle: "GDC Club Page",
    url: "https://unstop.com/",
  },
  {
    label: "Discord",
    handle: "Join the server",
    url: "https://discord.com/",
  },
  {
    label: "GitHub",
    handle: "@gdc-college",
    url: "https://github.com/",
  },
];

export const clubMeta = {
  name: "Game Developer's Community",
  shortName: "GDC",
  tagline: "Code, Create, Game.",
  email: "gdc@college.edu",
};
