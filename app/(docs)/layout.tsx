import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { LayoutTab } from "fumadocs-ui/layouts/shared";
import type * as PageTree from "fumadocs-core/page-tree";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

// The three sidebar tabs are the root folders (fly), (fight) and (reference).
// They hold only section folders, so each tab opens on its first section.
function firstUrl(folder: PageTree.Folder): string | undefined {
  if (folder.index) return folder.index.url;
  for (const child of folder.children) {
    if (child.type === "page") return child.url;
    if (child.type === "folder") {
      const url = firstUrl(child);
      if (url) return url;
    }
  }
}

function layoutTabs(tree: PageTree.Root): LayoutTab[] {
  return tree.children.flatMap((node) => {
    if (node.type !== "folder" || !node.root) return [];
    const url = firstUrl(node);
    return url ? [{ title: node.name, description: node.description, icon: node.icon, url, $folder: node }] : [];
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const tree = source.getPageTree();
  const { nav, ...base } = baseOptions();
  return (
    <DocsLayout
      tree={tree}
      tabs={layoutTabs(tree)}
      tabMode="navbar"
      {...base}
      nav={{ ...nav, mode: "top" }}
      sidebar={{
        defaultOpenLevel: 1,
        footer: (
          <p key="disclaimer" className="px-2 pt-2 text-xs leading-snug text-fd-muted-foreground">
            A hobby game. Its radar, seekers and countermeasures are gameplay models, not a description of any real
            system.
          </p>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
