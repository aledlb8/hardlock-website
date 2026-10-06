import { Card, Cards } from "fumadocs-ui/components/card";
import type { ReactNode } from "react";

export type SectionEntry = { title: ReactNode; description?: ReactNode; url: string; icon?: ReactNode };

/**
 * The cards on a section's landing page. The docs route passes the section's
 * pages in (see app/(docs)/[...slug]/page.tsx), so a new page appears here as
 * soon as it is listed in its folder's meta.json.
 */
export function SectionIndex({ entries = [] }: { entries?: SectionEntry[] }) {
  return (
    <Cards className="ms-section-cards">
      {entries.map((e) => (
        <Card key={e.url} href={e.url} title={e.title} icon={e.icon}>
          {e.description}
        </Card>
      ))}
    </Cards>
  );
}
