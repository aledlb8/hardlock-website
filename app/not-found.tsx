import Link from "next/link";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-start justify-center px-6 py-24">
        <p className="font-mono text-sm font-medium text-fd-primary">LOST 404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">No track on that bearing</h1>
        <p className="mt-4 text-lg leading-relaxed text-fd-muted-foreground">
          This page isn&rsquo;t in the guide. It may have moved when a chapter was reorganised. Search with{" "}
          <kbd className="ms-keycap">Ctrl</kbd> <kbd className="ms-keycap">K</kbd>, or start from the contents.
        </p>
        <Link href="/" className="mt-8 rounded-lg bg-fd-primary px-4 py-2.5 font-semibold text-fd-primary-foreground">
          Back to the guide
        </Link>
      </main>
    </HomeLayout>
  );
}
