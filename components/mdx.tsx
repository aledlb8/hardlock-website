import defaultMdxComponents from "fumadocs-ui/mdx";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import type { MDXComponents } from "mdx/types";
import { Callout, Facts, Figure, Key, SimChoice } from "@/components/guide";
import { Diagram } from "@/components/diagrams";
import { NotchExplorer } from "@/components/NotchExplorer";
import { SectionIndex } from "@/components/section-index";
import { Mermaid } from "@/components/mermaid";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    img: (props) => <ImageZoom {...(props as React.ComponentProps<typeof ImageZoom>)} />,
    Accordion,
    Accordions,
    Step,
    Steps,
    Callout,
    Facts,
    Figure,
    Key,
    SimChoice,
    Diagram,
    NotchExplorer,
    SectionIndex,
    Mermaid,
    InlineTOC,
    PageContents: () => null,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
