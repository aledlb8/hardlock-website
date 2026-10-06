import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { applyMdxPreset } from "fumadocs-mdx/config";
import { remarkMdxMermaid, remarkSteps } from "fumadocs-core/mdx-plugins";
import { docsRoute } from "./shared";

// The guide's pages live in content/docs. Folders in parentheses are the three
// sidebar tabs (they don't appear in URLs); each section folder has a meta.json
// that sets its title, icon and page order.
const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    // Numbered headings ("## 1. ...") become Fumadocs steps; ```mermaid blocks become diagrams.
    mdxOptions: applyMdxPreset({
      remarkPlugins: (v) => [...v, remarkSteps, remarkMdxMermaid],
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

