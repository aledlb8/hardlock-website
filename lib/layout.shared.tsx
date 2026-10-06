import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

// The flight path marker: the HUD's "where the jet is actually going" symbol.
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 20" className={`h-[14px] w-[22px] text-fd-foreground ${className}`} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <circle cx="16" cy="11" r="5" />
      <path d="M2 11h9M21 11h9M16 6V1" />
    </svg>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 text-[15px]">
          <Mark />
          <span className="font-semibold tracking-tight">Hardlock</span>
          <span className="font-normal text-fd-muted-foreground">Guide</span>
        </span>
      ),
      url: "/",
    },
    links: [
      { text: "First sortie", url: "/start/first-sortie/", active: "none" },
      { text: "Staying alive", url: "/survival/warnings/", active: "none" },
      { text: "Aircraft", url: "/aircraft/roster/", active: "none" },
    ],
  };
}
