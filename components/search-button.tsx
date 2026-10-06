"use client";
import { Search } from "lucide-react";
import { useSearchContext } from "fumadocs-ui/contexts/search";

export function SearchButton({ className = "" }: { className?: string }) {
  const { setOpenSearch } = useSearchContext();
  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className={`inline-flex h-11 items-center gap-3 rounded-lg border border-fd-border bg-fd-card px-4 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground ${className}`}
    >
      <Search className="size-4" />
      <span>Search the guide</span>
      <span className="ml-3 flex gap-1">
        <kbd className="ms-keycap">Ctrl</kbd>
        <kbd className="ms-keycap">K</kbd>
      </span>
    </button>
  );
}
