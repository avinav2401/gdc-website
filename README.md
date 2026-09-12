# GDC — Game Developer's Community website

Built with Next.js (App Router) + TypeScript + Tailwind CSS. Ready to deploy on Vercel.

## Pages

- `/` — home (live activity feed, games + team preview, join CTA)
- `/events` — past, ongoing, and upcoming events
- `/games` — games showcase
- `/team` — core team + faculty in charge
- `/about` — about the club, how it works, socials

## Editing content

Almost everything you'll want to change day-to-day lives in **`lib/data.ts`**:

- `events` — add/edit events. Set `status` to `"shipped"` (past), `"live"` (ongoing), or `"planned"` (future). The events page groups automatically.
- `team` — add/edit core team and faculty. Set `team` to `"core"` or `"faculty"`.
- `games` — add/edit showcased games. Set `status` to `"shipped"`, `"in-development"`, or `"prototype"`. Add a `playUrl` once a game has a public build/page.
- `socials` — Instagram, LinkedIn, Unstop, Discord, GitHub links. Edit `url` for each once you have real links.
- `clubMeta` — club name, tagline, and contact email.

No component code needs to change for routine content updates — just edit the arrays in that one file.

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Go to vercel.com/new and import the repo.
3. Vercel auto-detects Next.js — no config needed. Click **Deploy**.
4. Every future push to your main branch redeploys automatically.

Alternatively, from this folder:

```bash
npm i -g vercel
vercel
```

and follow the prompts.

## Design notes

- Dark, "build log" visual language — events/games/team are framed like changelog entries (v1.0 — shipped, live, planned), matching how game-dev teams actually talk about their work.
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (metadata/labels/status).
- Accent colors: violet (#7C5CFF) for active/interactive state, lime (#B4F42A) for "shipped", amber for "planned"/faculty.
- Fully responsive, keyboard-focusable nav, and respects prefers-reduced-motion.
