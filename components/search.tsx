"use client";
import { useState } from "react";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useDocsSearch } from "fumadocs-core/search/client";
import { staticClient } from "fumadocs-core/search/client/orama-static";

const tags = [
  { value: "fly", name: "Learn to fly" },
  { value: "fight", name: "Combat systems" },
  { value: "reference", name: "Reference" },
];

// Static search: the index is written at build time (app/api/search/route.ts)
// and searched in the browser, so it works on any static host.
export default function GuideSearchDialog(props: SharedProps) {
  const [tag, setTag] = useState<string | undefined>();
  const { search, setSearch, query } = useDocsSearch({ client: staticClient({ tag }) });

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput placeholder="Notch, flares, pitbull, track number…" />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
        <SearchDialogFooter className="flex flex-row flex-wrap items-center gap-2">
          <TagsList tag={tag} onTagChange={setTag} allowClear>
            {tags.map((t) => (
              <TagsListItem key={t.value} value={t.value}>
                {t.name}
              </TagsListItem>
            ))}
          </TagsList>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
