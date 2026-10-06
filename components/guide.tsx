import type { ReactNode } from "react";
import { CalloutContainer, CalloutDescription, CalloutTitle } from "fumadocs-ui/components/callout";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Flame, FlaskConical, Info, Plane, Radar, Siren } from "lucide-react";

/** A keyboard key, drawn like the keycap chips the game itself uses. */
export function Key({ k, hold }: { k: string; hold?: boolean }) {
  return (
    <span className="whitespace-nowrap">
      <kbd className="ms-keycap">{k}</kbd>
      {hold && <span className="ms-hold">hold</span>}
    </span>
  );
}

const calloutKinds = {
  note: { color: "var(--color-fd-muted-foreground)", title: "Note", icon: Info },
  tip: { color: "var(--friendly)", title: "In the cockpit", icon: Plane },
  heat: { color: "var(--heat)", title: "Heat", icon: Flame },
  radar: { color: "var(--radar)", title: "Radar", icon: Radar },
  threat: { color: "var(--threat)", title: "Watch out", icon: Siren },
  sim: { color: "var(--countermeasure)", title: "Game simplification", icon: FlaskConical },
} as const;

/**
 * A side remark in the game's colour language: heat (amber), radar (cyan),
 * threat (red), tip (green), sim (a deliberate simplification), note (neutral).
 * Built on Fumadocs' callout.
 */
export function Callout({
  kind = "note",
  type,
  title,
  children,
}: {
  kind?: keyof typeof calloutKinds;
  type?: string;
  title?: ReactNode;
  children: ReactNode;
}) {
  const resolved = (type && type in calloutKinds ? type : kind) as keyof typeof calloutKinds;
  const k = calloutKinds[resolved] ?? calloutKinds.note;
  const Icon = k.icon;
  return (
    <CalloutContainer
      style={{ ["--callout-color" as string]: k.color }}
      icon={<Icon className="size-5 -me-0.5 shrink-0 text-(--callout-color)" strokeWidth={2.1} />}
      className="ms-callout"
    >
      <CalloutTitle className="text-(--callout-color)">{title ?? k.title}</CalloutTitle>
      <CalloutDescription className="text-fd-foreground/85">{children}</CalloutDescription>
    </CalloutContainer>
  );
}

/** A capture from the game's hud_preview tool or a render from the repo; click to zoom. */
export function Figure({
  src,
  alt,
  caption,
  width = 800,
  height = 400,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  width?: number;
  height?: number;
  wide?: boolean;
}) {
  return (
    <figure className="ms-figure not-prose">
      <ImageZoom src={src} alt={alt} width={width} height={height} className="ms-figure-img" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Marks a number as a game-tuning value rather than a published figure. */
export function SimChoice({ children }: { children?: ReactNode }) {
  return (
    <span className="ms-simchoice" title="A value tuned for gameplay rather than taken from a published figure">
      {children ?? "sim choice"}
    </span>
  );
}

/** A labelled pair list, for quick-reference values. */
export function Facts({ children }: { children: ReactNode }) {
  return <dl className="ms-facts not-prose">{children}</dl>;
}
