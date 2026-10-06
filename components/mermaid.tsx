"use client";

import { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";

// Renders a ```mermaid block (turned into <Mermaid chart="..."/> by remarkMdxMermaid),
// re-drawn in the guide's palette whenever the theme changes.
export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let alive = true;
    const dark = resolvedTheme === "dark";
    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        // SVG text cannot read CSS variables, so pass the resolved page font.
        fontFamily: getComputedStyle(document.body).fontFamily,
        theme: "base",
        themeVariables: dark
          ? {
              background: "#0b121b",
              primaryColor: "#142131",
              primaryBorderColor: "#66c7f4",
              primaryTextColor: "#e7eaef",
              lineColor: "#6f7a8a",
              secondaryColor: "#18283b",
              tertiaryColor: "#111b28",
              edgeLabelBackground: "#0b121b",
              fontSize: "14px",
            }
          : {
              background: "#eef3f7",
              primaryColor: "#f8fafc",
              primaryBorderColor: "#0f6994",
              primaryTextColor: "#12203a",
              lineColor: "#74839a",
              secondaryColor: "#e4ecf2",
              tertiaryColor: "#f8fafc",
              edgeLabelBackground: "#eef3f7",
              fontSize: "14px",
            },
      });
      try {
        const { svg } = await mermaid.render(`m${id}${dark ? "d" : "l"}`, chart.replaceAll("\n", "\n"));
        if (alive) setSvg(svg);
      } catch {
        if (alive) setSvg("");
      }
    });
    return () => {
      alive = false;
    };
  }, [chart, id, resolvedTheme]);

  return (
    <div className="ms-mermaid not-prose my-8 overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-4">
      {svg ? (
        <div className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="h-40 rounded-lg bg-fd-muted" aria-label="Loading diagram" />
      )}
    </div>
  );
}
