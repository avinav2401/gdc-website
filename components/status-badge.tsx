const STYLES: Record<string, string> = {
  shipped: "text-lime border-lime/40",
  live: "text-purple border-purple/50",
  planned: "text-fg-dim border-line-bright",
  "in-development": "text-purple border-purple/50",
  prototype: "text-fg-mute border-line",
};

const LABELS: Record<string, string> = {
  shipped: "shipped",
  live: "live",
  planned: "planned",
  "in-development": "in dev",
  prototype: "prototype",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${
        STYLES[status] ?? STYLES.prototype
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
