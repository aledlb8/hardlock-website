import type { ReactNode } from "react";

// Hand-drawn SVG diagrams for the guide. Each one is drawn from the numbers in
// the game's code (cited on the page that uses it) and uses the theme tokens, so
// it works in day and night sky. Add a diagram here, then use <Diagram name="..." />.

function Frame({ children, caption, label }: { children: ReactNode; caption: ReactNode; label: string }) {
  return (
    <figure className="my-9">
      <div role="img" aria-label={label} className="rounded-[3px] border border-rule bg-paper-raised p-3 sm:p-5">
        {children}
      </div>
      <figcaption className="type-ui mt-2.5 text-[13.5px] leading-snug text-ink-muted">{caption}</figcaption>
    </figure>
  );
}

const ui = { fontFamily: "var(--font-geist-sans), system-ui, sans-serif" } as const;

function Theater() {
  // 1 unit = 1 km. Map spans -64..64 in both axes; SVG y grows down, so north (+z) is up.
  const s = (km: number) => km * 3; // scale
  const cx = 200;
  const cy = 200;
  const X = (km: number) => cx + s(km);
  const Y = (km: number) => cy - s(km);
  const coast: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r = 56 + 2.2 * Math.sin(a * 5) + 1.4 * Math.sin(a * 11 + 1);
    coast.push(`${X(r * Math.cos(a)).toFixed(1)},${Y(r * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 400 400" className="mx-auto block h-auto w-full max-w-[460px]" style={ui}>
      <rect x={X(-64)} y={Y(64)} width={s(128)} height={s(128)} fill="color-mix(in oklab, var(--radar) 10%, transparent)" stroke="var(--rule)" />
      <polygon points={coast.join(" ")} fill="var(--paper-sunk)" stroke="var(--ink-faint)" strokeWidth="0.8" />
      {/* Mountain band centred 24 km north, ~9.5 km wide, with two passes. */}
      {[
        [-56, -16.5],
        [-11.5, 7.75],
        [10.25, 56],
      ].map(([a, b]) => (
        <rect key={a} x={X(a)} y={Y(24 + 7)} width={s(b - a)} height={s(14)} rx="6" fill="color-mix(in oklab, var(--ink-faint) 38%, transparent)" />
      ))}
      <text x={X(30)} y={Y(24) + 4} fontSize="10" fill="var(--ink-muted)" textAnchor="middle">mountain range</text>
      <text x={X(-14)} y={Y(33)} fontSize="9" fill="var(--ink-muted)" textAnchor="middle">pass</text>
      <text x={X(9)} y={Y(33)} fontSize="9" fill="var(--ink-muted)" textAnchor="middle">pass</text>
      {/* Range rings every 10 km, as on the briefing map. */}
      {[10, 20, 30, 40, 50].map((r) => (
        <circle key={r} cx={X(0)} cy={Y(0)} r={s(r)} fill="none" stroke="var(--rule)" strokeWidth="0.8" />
      ))}
      {[10, 20, 30, 40].map((r) => (
        <text key={r} x={X(0) + 3} y={Y(-r) - 3} fontSize="8.5" fill="var(--ink-faint)">{r} km</text>
      ))}
      {/* Arena square the enemy keeps to: 60 km half-width. */}
      <rect x={X(-60)} y={Y(60)} width={s(120)} height={s(120)} fill="none" stroke="var(--threat)" strokeWidth="1" strokeDasharray="5 4" opacity="0.8" />
      <text x={X(-58)} y={Y(-57)} fontSize="9" fill="var(--threat)">arena edge, 60 km</text>
      {/* Lake beside the launch site. */}
      <ellipse cx={X(2.3)} cy={Y(-2.1)} rx={s(1.5)} ry={s(0.85)} fill="var(--radar)" opacity="0.5" />
      {/* Bases and patrol station. */}
      <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(48)} stroke="var(--ink-faint)" strokeDasharray="3 3" />
      <circle cx={X(0)} cy={Y(0)} r="4.5" fill="var(--friendly)" />
      <text x={X(0) + 8} y={Y(0) + 4} fontSize="10.5" fontWeight="600" fill="var(--ink)">your base</text>
      <rect x={X(0) - 4.5} y={Y(48) - 4.5} width="9" height="9" transform={`rotate(45 ${X(0)} ${Y(48)})`} fill="var(--threat)" />
      <text x={X(0) + 9} y={Y(48) + 4} fontSize="10.5" fontWeight="600" fill="var(--ink)">their base, ~48 km</text>
      <circle cx={X(0)} cy={Y(36)} r={s(9)} fill="none" stroke="var(--threat)" strokeWidth="0.9" opacity="0.7" />
      <text x={X(0) + s(9) + 4} y={Y(36) + 3} fontSize="9" fill="var(--threat)">patrol orbit</text>
      <text x={X(60)} y={Y(61.5)} fontSize="11" fontWeight="700" fill="var(--ink-muted)" textAnchor="end">N ↑</text>
      <text x={X(-62)} y={Y(61.5)} fontSize="9" fill="var(--ink-faint)">sea</text>
    </svg>
  );
}

function ColdLaunch() {
  // Side view, schematic. Times from the game.
  const path = "M40 230 C 46 175, 52 120, 70 92 C 92 62, 150 50, 360 44";
  return (
    <svg viewBox="0 0 400 260" className="block h-auto w-full" style={ui}>
      <line x1="20" y1="232" x2="390" y2="232" stroke="var(--ink-faint)" />
      <rect x="32" y="222" width="16" height="10" fill="var(--ink-faint)" />
      <path d={path} fill="none" stroke="var(--ink)" strokeWidth="2" />
      <path d="M40 230 L 46 180" stroke="var(--countermeasure)" strokeWidth="5" opacity="0.5" />
      {[
        { x: 44, y: 196, t: "0 s", d: "eject, 26 m/s at 82°", c: "var(--countermeasure)" },
        { x: 51, y: 140, t: "0.85 s", d: "ignition, booster 4× sustainer", c: "var(--heat)" },
        { x: 80, y: 82, t: "pitch-over", d: "up to 110°/s toward the target", c: "var(--ink)" },
        { x: 150, y: 54, t: "≤ 1.3 s", d: "guidance hand-off inside 55°", c: "var(--radar)" },
        { x: 290, y: 45, t: "2.35 s", d: "booster out, sustainer only", c: "var(--ink-muted)" },
      ].map((p) => (
        <g key={p.t}>
          <circle cx={p.x} cy={p.y} r="4" fill={p.c} stroke="var(--paper-raised)" strokeWidth="1.5" />
          <text x={p.x + 9} y={p.y + (p.x > 200 ? 18 : 4)} fontSize="10.5" fontWeight="650" fill="var(--ink)">{p.t}</text>
          <text x={p.x + 9} y={p.y + (p.x > 200 ? 31 : 17)} fontSize="9.5" fill="var(--ink-muted)">{p.d}</text>
        </g>
      ))}
      <text x="24" y="250" fontSize="9" fill="var(--ink-faint)">launch cell</text>
    </svg>
  );
}

function RwrRings() {
  // Ring fractions from src/ui/RwrScope.cpp: search 0.82, soft 0.66, hard/launch 0.50, missiles 0.32.
  const c = 150;
  const R = 120;
  const at = (frac: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: c + Math.sin(a) * R * frac, y: c - Math.cos(a) * R * frac };
  };
  const ink = "var(--ink)";
  const glyph = (p: { x: number; y: number }, t: string) => (
    <text x={p.x} y={p.y + 4.5} fontSize="13" fontWeight="700" fill={ink} textAnchor="middle">{t}</text>
  );
  const s = at(0.82, -40);
  const so = at(0.66, 35);
  const h = at(0.5, 115);
  const l = at(0.5, -125);
  const m = at(0.32, 200);
  const ap = at(0.32, 70);
  const lineTo = (deg: number, frac: number) => {
    const a = (deg * Math.PI) / 180;
    return (
      <line x1={c + Math.sin(a) * 13} y1={c - Math.cos(a) * 13} x2={c + Math.sin(a) * (R * frac - 12)} y2={c - Math.cos(a) * (R * frac - 12)} stroke={ink} strokeWidth="1.1" opacity="0.5" />
    );
  };
  const legend = [
    ["F", "Search: a radar's beam swept over you", "outer ring"],
    ["F in a dashed ring", "Soft lock: three beam visits in 3.5 s", ""],
    ["F in a solid ring", "Hard lock: the beam is staying on you", ""],
    ["F in a double ring", "Launch: that radar is guiding a round at you", "blinks"],
    ["M in a diamond", "A radar missile's own seeker is transmitting", "blinks"],
    ["Arrowhead pointing in", "Missile approach warning", "blinks"],
  ];
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[300px_1fr]" style={ui}>
      <svg viewBox="0 0 300 300" className="mx-auto block h-auto w-full max-w-[300px]">
        <circle cx={c} cy={c} r={R + 8} fill="var(--sky-deep)" opacity="0.18" />
        <circle cx={c} cy={c} r={R} fill="none" stroke={ink} strokeOpacity="0.5" />
        {[0.82, 0.66, 0.5, 0.32].map((f) => (
          <circle key={f} cx={c} cy={c} r={R * f} fill="none" stroke={ink} strokeOpacity="0.14" strokeDasharray="2 4" />
        ))}
        {/* ownship, nose up */}
        <path d={`M${c} ${c - 9} V${c + 8} M${c - 10} ${c + 3} L${c} ${c - 1.5} L${c + 10} ${c + 3} M${c - 4} ${c + 8} H${c + 4}`} stroke={ink} strokeWidth="1.6" fill="none" />
        {glyph(s, "F")}
        <circle cx={so.x} cy={so.y} r="11" fill="none" stroke={ink} strokeWidth="1.5" strokeDasharray="3.5 2.3" />
        {glyph(so, "F")}
        <circle cx={h.x} cy={h.y} r="11" fill="none" stroke={ink} strokeWidth="1.9" />
        {glyph(h, "F")}
        {lineTo(-125, 0.5)}
        <circle cx={l.x} cy={l.y} r="11" fill="none" stroke={ink} strokeWidth="1.9" />
        <circle cx={l.x} cy={l.y} r="15" fill="none" stroke={ink} strokeWidth="1.4" />
        {glyph(l, "F")}
        {lineTo(200, 0.32)}
        <path d={`M${m.x} ${m.y - 10} L${m.x + 10} ${m.y} L${m.x} ${m.y + 10} L${m.x - 10} ${m.y} Z`} fill="none" stroke={ink} strokeWidth="1.5" />
        {glyph(m, "M")}
        {lineTo(70, 0.32)}
        {(() => {
          const dx = c - ap.x;
          const dy = c - ap.y;
          const n = Math.hypot(dx, dy);
          const ix = dx / n;
          const iy = dy / n;
          const sx = -iy;
          const sy = ix;
          const pts = [
            [ap.x + ix * 8, ap.y + iy * 8],
            [ap.x - ix * 6 + sx * 6.5, ap.y - iy * 6 + sy * 6.5],
            [ap.x - ix * 6 - sx * 6.5, ap.y - iy * 6 - sy * 6.5],
          ];
          return <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={ink} />;
        })()}
        <text x={c} y={c - R - 12} fontSize="9" fill="var(--ink-faint)" textAnchor="middle">nose</text>
      </svg>
      <dl className="grid gap-2.5 text-[13.5px] leading-snug">
        {legend.map(([sym, what, note]) => (
          <div key={sym}>
            <dt className="font-semibold text-ink">{sym}</dt>
            <dd className="text-ink-muted">
              {what}
              {note ? <span className="text-ink-faint">, {note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const registry: Record<string, { label: string; caption: ReactNode; render: () => ReactNode }> = {
  "rwr-rings": {
    label: "The RWR scope's rings and symbols",
    caption:
      "Where each warning sits on the RWR scope: the more urgent, the closer to your jet. Bearing is relative to your nose. Faint dotted rings are added here for reading; urgent symbols also get a line from the centre.",
    render: RwrRings,
  },
  theater: {
    label: "Schematic map of the theater",
    caption:
      "The default mountain theater, north up, distances to scale. Range rings every 10 km as on the briefing map. Which pass sits on which side is illustrative.",
    render: Theater,
  },
  "cold-launch": {
    label: "Side view of the SAM cold-launch sequence",
    caption: "The cold-launch program, schematic. Times are from launch.",
    render: ColdLaunch,
  },
};

export function Diagram({ name }: { name: string }) {
  const d = registry[name];
  if (!d) {
    if (process.env.NODE_ENV !== "production") return <p className="text-threat">Unknown diagram: {name}</p>;
    return null;
  }
  return (
    <Frame label={d.label} caption={d.caption}>
      {d.render()}
    </Frame>
  );
}
