import { ClubEvent } from "@/lib/data";

export const SPLIT_PATTERNS: string[] = [
  "md:grid-cols-[7fr_5fr]",
  "md:grid-cols-[8fr_4fr]",
  "md:grid-cols-[5fr_7fr]",
  "md:grid-cols-[4fr_8fr]",
  "md:grid-cols-[9fr_3fr]",
  "md:grid-cols-[3fr_9fr]",
];

export type ComicRow = { events: ClubEvent[]; colClass: string; startIndex: number };

export function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildComicRows(items: ClubEvent[]): ComicRow[] {
  const seed = hashSeed(items.map((e) => e.slug).join("|")) || 1;
  const rand = mulberry32(seed);

  const rows: ComicRow[] = [];
  let i = 0;
  let cursor = 0;

  while (i < items.length) {
    const remaining = items.length - i;
    const takeTwo = remaining >= 2 && rand() < 0.6;
    const count = takeTwo ? 2 : 1;
    const rowEvents = items.slice(i, i + count);

    const colClass =
      count === 2
        ? SPLIT_PATTERNS[Math.floor(rand() * SPLIT_PATTERNS.length)]
        : "md:grid-cols-1";

    rows.push({ events: rowEvents, colClass, startIndex: cursor });
    cursor += count;
    i += count;
  }

  return rows;
}

export const TILTS = ["rotate-[0deg]", "rotate-[-0.6deg]", "rotate-[0.5deg]", "rotate-[-0.4deg]"];

/**
 * A single floating asset instance, positioned with a fixed PIXEL offset
 * from the panel's own center (not a % of the panel box — that was the
 * original bug that sent assets flying off wide panels).
 */
export type FloatingAssetInstance = {
  src: string;
  key: string;
  offsetX: number; // px offset from panel center
  offsetY: number; // px offset from panel center
  size: number; // px, square
  facingDeg: number; // rotation, pointing away from panel center
  delay: number; // ms transition delay, for a staggered "pop" on hover
};

/**
 * Builds floating-asset instances scaled to a panel's ACTUAL measured
 * width/height (in px), so panels of any size — a tall square card, a
 * short wide banner, a huge hero panel — all get proportionally sized,
 * proportionally spread assets instead of one hardcoded "large/small"
 * guess.
 *
 * - count scales with panel area (bigger panel = more repeats)
 * - size scales with the panel's diagonal (bigger panel = bigger pngs)
 * - spread radius scales with half-width/half-height, so assets emerge
 *   from just inside the panel edges and settle just outside them
 */
export function buildFloatingAssetInstances(
  assets: string[],
  seedKey: string,
  panelWidth: number,
  panelHeight: number
): FloatingAssetInstance[] {
  if (!assets || assets.length === 0 || panelWidth <= 0 || panelHeight <= 0) {
    return [];
  }

  const area = panelWidth * panelHeight;
  const diagonal = Math.sqrt(panelWidth * panelWidth + panelHeight * panelHeight);
  const halfW = panelWidth / 2;
  const halfH = panelHeight / 2;

  // More surface area -> more repeated instances. Reduced count slightly
  // to prevent too much overlapping while keeping panels visually busy.
  const rawCount = Math.round(area / 2000);
  const total = Math.max(assets.length, Math.min(30, Math.max(5, rawCount)));

  // Increased base size: changed from 0.09 to 0.12 multiplier and bumped
  // max from 120 to 150px so all assets read clearly, even on small panels.
  const baseSize = Math.min(150, Math.max(100, diagonal * 0.12));

  // Increased spread radius: changed from 0.032 to 0.045 multiplier so
  // assets spread further apart and overlap less, while keeping them
  // visible around the panel edges.
  const basePad = Math.min(50, Math.max(28, diagonal * 0.045));

  const instances: FloatingAssetInstance[] = [];

  for (let index = 0; index < total; index++) {
    const rand = mulberry32(hashSeed(`${seedKey}-${index}`) || index + 1);

    // Evenly space around the circle, then nudge the angle — jitter
    // widened for a noisier, less mechanically-even spread.
    const baseAngle = (index / total) * Math.PI * 2;
    const angle = baseAngle + (rand() - 0.5) * 0.7;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // Project this direction onto the PANEL'S ACTUAL RECTANGULAR
    // BOUNDARY (not a circle/ellipse — a fixed-percentage radius on an
    // ellipse still lands inside a rectangle near diagonal angles, which
    // is why assets were invisible before: they never cleared the card
    // and sat hidden behind its opaque background). `t` is the distance
    // along this direction to hit whichever edge (left/right or
    // top/bottom) comes first.
    const tx = cosA !== 0 ? halfW / Math.abs(cosA) : Infinity;
    const ty = sinA !== 0 ? halfH / Math.abs(sinA) : Infinity;
    const t = Math.min(tx, ty);

    // Push further outward past that boundary point by a jittered pixel
    // amount — jitter range adjusted for consistent spread distance.
    // Guaranteeing the final position clears the rectangle on every angle
    // (verified numerically) instead of relying on a radius percentage that
    // only clears at the cardinal directions.
    const pad = basePad * (0.7 + rand() * 0.8);

    const offsetX = cosA * t + cosA * pad;
    const offsetY = sinA * t + sinA * pad;

    // Increased minimum size multiplier from 0.7 to 0.85 so no asset gets
    // too tiny and hidden. Adjusted range for bigger overall sizes while
    // maintaining some variety.
    const size = baseSize * (0.85 + rand() * 0.5);

    // Point the asset's "up" direction away from the panel center.
    // angle=0 is to the right (3 o'clock), so we offset by +90deg to
    // convert "direction to point" into a rotation of an upright image,
    // then add a wider jitter for a noisier scatter of angles.
    const facingDeg = (angle * 180) / Math.PI + 90 + (rand() - 0.5) * 34;

    // Staggered delay for the "burst from one point" effect: assets
    // further from center (bigger pad/size) leave a beat later, like
    // they're erupting outward one after another from behind the panel.
    const delay = rand() * 90 + (pad / basePad) * 60;

    instances.push({
      src: assets[index % assets.length],
      key: `${seedKey}-${index}`,
      offsetX: +offsetX.toFixed(2),
      offsetY: +offsetY.toFixed(2),
      size: +size.toFixed(2),
      facingDeg: +facingDeg.toFixed(2),
      delay: +delay.toFixed(1),
    });
  }

  return instances;
}