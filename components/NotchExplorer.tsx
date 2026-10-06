"use client";

import { useId, useState, type ReactNode } from "react";

// A toy that runs the game's own Doppler rules:
//   ground radial speed  = your velocity along the line of sight
//   speed gate           = search/TWS only, |radial| < gate -> dropped
//   notch                = main beam on the ground and the offset from the clutter
//                          inside max(beam spread, guard) + one filter
// Guards: radar-missile seeker 20 m/s; fighter radars half their speed gate.

type Sensor = { id: string; name: string; short: string; guard: number; gate: number; note: string };

const sensors: Sensor[] = [
  { id: "seeker", name: "Radar missile seeker", short: "Missile seeker", guard: 20, gate: 0, note: "No speed gate, guard ±20 m/s" },
  { id: "su27", name: "Su-27S / MiG-29 radar", short: "Su-27S / MiG-29", guard: 25.7, gate: 51.4, note: "Speed gate 51.4 m/s and guard ±25.7 m/s" },
  { id: "su35", name: "Su-35S radar", short: "Su-35S", guard: 23.15, gate: 46.3, note: "Speed gate 46.3 m/s and guard ±23.15 m/s" },
];

type Mode = "search" | "track";

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-lg bg-fd-muted p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`flex-1 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition ${
              active ? "bg-fd-background text-fd-foreground ring-1 ring-fd-border" : "text-fd-muted-foreground hover:text-fd-foreground"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex items-center gap-3 text-left text-[13px] text-fd-foreground"
    >
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-fd-primary" : "bg-fd-muted ring-1 ring-fd-border"}`}>
        <span className={`absolute top-0.5 size-4 rounded-full transition-all ${checked ? "left-[18px] bg-fd-primary-foreground" : "left-0.5 bg-fd-muted-foreground"}`} />
      </span>
      {label}
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  ticks,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  ticks?: string[];
}) {
  const fill = `${((value - min) / (max - min)) * 100}%`;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[13px]">
        <span className="text-fd-muted-foreground">{label}</span>
        <span className="font-mono text-fd-foreground tabular-nums">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="ms-range mt-2"
        style={{ ["--fill" as string]: fill }}
      />
      {ticks && (
        <span className="mt-1 flex justify-between text-[11px] text-fd-muted-foreground">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </span>
      )}
    </label>
  );
}

export function NotchExplorer() {
  const uid = useId();
  const [speed, setSpeed] = useState(250);
  const [angle, setAngle] = useState(90);
  const [sensorId, setSensorId] = useState("seeker");
  const [lookDown, setLookDown] = useState(true);
  const [mode, setMode] = useState<Mode>("track");

  const sensor = sensors.find((s) => s.id === sensorId)!;
  const isSeeker = sensor.id === "seeker";
  const effectiveMode: Mode = isSeeker ? "track" : mode;

  // angle 0 = flying straight at the radar, 90 = beaming, 180 = straight away.
  const rad = (angle * Math.PI) / 180;
  const radial = speed * Math.cos(rad);
  const absRadial = Math.abs(radial);
  const beamHalf = (Math.asin(Math.min(1, sensor.guard / speed)) * 180) / Math.PI;

  let verdict: { tone: "friendly" | "heat" | "threat"; title: string; body: string };
  if (effectiveMode === "search" && sensor.gate > 0 && absRadial < sensor.gate) {
    verdict = {
      tone: "friendly",
      title: "Dropped by the speed gate",
      body: `In search and track-while-scan this radar ignores anything slower than ${sensor.gate} m/s along its line of sight, sky or ground. A hard lock doesn't use the gate.`,
    };
  } else if (lookDown && absRadial < sensor.guard) {
    verdict = {
      tone: "friendly",
      title: "In the notch",
      body: "Your Doppler sits inside the blanked ground clutter, so this look can't see you. Hold it: the seeker needs only three missed looks in a row (75 ms) to fall back to memory.",
    };
  } else if (lookDown && absRadial < sensor.guard + 6) {
    verdict = {
      tone: "heat",
      title: "On the edge",
      body: "The blanked band is the guard plus about one Doppler filter (2.4 to 5.6 m/s), and the beam's own clutter spread can widen it. Some looks may miss you, some won't.",
    };
  } else {
    verdict = {
      tone: "threat",
      title: "Visible",
      body: lookDown
        ? "Your speed along the line of sight is outside the blanked band. The ground behind you doesn't hide you."
        : "With only sky behind you there's no notch. Only a radar in search or track-while-scan can lose you, through its speed gate.",
    };
  }
  const toneVar = { threat: "var(--threat)", friendly: "var(--friendly)", heat: "var(--heat)" }[verdict.tone];

  // Plan view.
  const W = 520;
  const H = 260;
  const radar = { x: 64, y: 130 };
  const jet = { x: 352, y: 130 };
  const hx = -Math.cos(rad);
  const hy = -Math.sin(rad);
  const arrowLen = 40 + (speed / 600) * 70;
  const tip = { x: jet.x + hx * arrowLen, y: jet.y + hy * arrowLen };
  const wedge = (deg: number, r: number) => {
    const a1 = ((90 - deg) * Math.PI) / 180;
    const a2 = ((90 + deg) * Math.PI) / 180;
    const p = (a: number, s: number) => `${jet.x - Math.cos(a) * r},${jet.y - s * Math.sin(a) * r}`;
    return [
      `M${jet.x},${jet.y} L${p(a1, 1)} A${r},${r} 0 0 1 ${p(a2, 1)} Z`,
      `M${jet.x},${jet.y} L${p(a1, -1)} A${r},${r} 0 0 0 ${p(a2, -1)} Z`,
    ];
  };
  const band = wedge(beamHalf, 100);

  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_16rem]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full"
            role="img"
            aria-label="Plan view of your jet, its velocity and the radar's line of sight"
          >
            <defs>
              <pattern id={`${uid}-grid`} width="26" height="26" patternUnits="userSpaceOnUse">
                <path d="M26 0H0V26" fill="none" stroke="var(--color-fd-border)" strokeWidth="0.6" opacity="0.6" />
              </pattern>
              <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="var(--color-fd-foreground)" />
              </marker>
            </defs>
            <rect width={W} height={H} fill={`url(#${uid}-grid)`} />
            <line x1={radar.x} y1={radar.y} x2={W - 12} y2={jet.y} stroke="var(--color-fd-muted-foreground)" strokeDasharray="4 5" opacity="0.7" />
            <text x={(radar.x + jet.x) / 2} y={radar.y - 10} fontSize="11" fill="var(--color-fd-muted-foreground)" textAnchor="middle">
              line of sight
            </text>
            {band.map((d, i) => (
              <path key={i} d={d} fill="var(--friendly)" opacity={lookDown ? 0.2 : 0.07} />
            ))}
            <text x={jet.x} y={jet.y - 106} fontSize="11" fill="var(--friendly)" textAnchor="middle">
              notch ±{beamHalf.toFixed(1)}° off the beam
            </text>
            <g>
              <rect x={radar.x - 8} y={radar.y - 8} width="16" height="16" rx="2" transform={`rotate(45 ${radar.x} ${radar.y})`} fill="var(--threat)" />
              <text x={radar.x} y={radar.y + 32} fontSize="11" fill="var(--color-fd-muted-foreground)" textAnchor="middle">
                {isSeeker ? "missile" : "radar"}
              </text>
            </g>
            <line x1={jet.x} y1={jet.y} x2={tip.x} y2={tip.y} stroke="var(--color-fd-foreground)" strokeWidth="2.5" markerEnd={`url(#${uid}-arrow)`} />
            <line x1={jet.x} y1={jet.y + 20} x2={jet.x - (radial / 600) * 110} y2={jet.y + 20} stroke={toneVar} strokeWidth="5" strokeLinecap="round" />
            <circle cx={jet.x} cy={jet.y} r="5" fill="var(--accent)" />
            <text x={jet.x + 10} y={jet.y + 42} fontSize="11" fill="var(--color-fd-muted-foreground)">
              you
            </text>
          </svg>
          <div className="flex flex-col border-t border-fd-border p-5 lg:border-l lg:border-t-0">
            <p className="text-xs font-medium text-fd-muted-foreground">Speed along the line of sight</p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums" style={{ color: toneVar }}>
              {radial >= 0 ? "+" : "−"}
              {absRadial.toFixed(0)}
              <span className="ml-1 text-base text-fd-muted-foreground">m/s</span>
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: toneVar }}>
              <span className="size-2 rounded-full" style={{ background: toneVar }} />
              {verdict.title}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-fd-muted-foreground">{verdict.body}</p>
          </div>
        </div>
        <div className="grid gap-x-8 gap-y-5 border-t border-fd-border p-5 sm:grid-cols-2">
          <Slider label="Your speed" value={speed} min={100} max={600} step={5} unit=" m/s" onChange={setSpeed} />
          <Slider
            label="Heading off the line of sight"
            value={angle}
            min={0}
            max={180}
            step={1}
            unit="°"
            onChange={setAngle}
            ticks={["straight at it", "beam", "straight away"]}
          />
          <div>
            <p className="mb-2 text-[13px] text-fd-muted-foreground">Who is looking</p>
            <Segmented
              label="Who is looking"
              value={sensorId}
              onChange={setSensorId}
              options={sensors.map((s) => ({ value: s.id, label: s.short }))}
            />
            <p className="mt-2 text-[11px] text-fd-muted-foreground">{sensor.note}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Switch checked={lookDown} onChange={setLookDown} label="Ground behind you, inside the beam" />
            {!isSeeker && (
              <Segmented
                label="Radar mode"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "search", label: "Search / TWS" },
                  { value: "track", label: "Hard lock" },
                ]}
              />
            )}
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-[12.5px] leading-relaxed text-fd-muted-foreground">
        The game&rsquo;s notch rule, simplified to one look. The band shown is the minimum, the guard alone. In the game
        the blanked band is the wider of the guard and the beam&rsquo;s own clutter spread, plus about one Doppler filter,
        and every look also rolls for detection.
      </figcaption>
    </figure>
  );
}
