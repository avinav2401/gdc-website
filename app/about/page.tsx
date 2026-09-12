import type { Metadata } from "next";
import Link from "next/link";
import { clubMeta, socials } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — GDC",
  description:
    "About Game Developer's Community — what we do, how we work, and how to join.",
};

const PILLARS = [
  {
    n: "01",
    title: "Jams",
    desc: "Timeboxed builds — 36 to 48 hours, a theme or a single mechanic, and a working prototype at the end. This is where most members ship their first game.",
  },
  {
    n: "02",
    title: "Workshops",
    desc: "Hands-on sessions on engines, tools, and craft — from a first Godot scene to shader basics. Built for people with zero prior game-dev experience.",
  },
  {
    n: "03",
    title: "Showcases",
    desc: "Every jam and project ends with a public playtest. Feedback loops are part of the process, not an afterthought.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple">
        Readme
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        About {clubMeta.shortName}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-dim">
        {clubMeta.name} is a student-run club for anyone who wants to make
        games — not just play or talk about them. We run jams, workshops,
        and showcases year-round, open to every branch and every skill
        level. If you can move a mouse and finish what you start, you
        belong here.
      </p>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight">
          What we actually do
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {PILLARS.map((p) => (
            <div key={p.title} className="flex gap-5 py-6">
              <span className="shrink-0 font-mono text-sm text-purple">
                {p.n}
              </span>
              <div>
                <h3 className="font-display text-base font-bold">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-fg-dim">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight">
          How we work
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fg-dim">
          Teams form organically around jams — no fixed groups, no
          pressure to have a &quot;role&quot; figured out. Programmers,
          artists, designers, and people who are just curious all end up
          contributing something. The only rule is to actually finish a
          playable build, even a rough one. Polish comes later; shipping
          comes first.
        </p>
      </section>

      <section id="join" className="mt-14 border border-purple/40 p-8">
        <h2 className="font-display text-xl font-bold tracking-tight">
          Joining is one message away
        </h2>
        <p className="mt-2 max-w-md text-sm text-fg-dim">
          Reach out on any of these, or check the{" "}
          <Link href="/events" className="text-purple hover:underline">
            events page
          </Link>{" "}
          for the next recruitment session.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line-bright px-4 py-2 font-mono text-sm text-fg hover:border-purple hover:text-purple"
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="mt-5 font-mono text-xs text-fg-mute">
          {clubMeta.email}
        </p>
      </section>
    </div>
  );
}
