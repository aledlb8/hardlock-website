import Link from "next/link";
import type * as PageTree from "fumadocs-core/page-tree";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { source } from "@/lib/source";
import { SearchButton } from "@/components/search-button";

type Section = { name: React.ReactNode; icon?: React.ReactNode; url: string; blurb: string; pages: number; part: string };

// Walk the page tree so the home page follows the sidebar's order.
function sections(): Section[] {
  const tree = source.getPageTree();
  const pages = source.getPages();
  const describe = (url: string) => pages.find((p) => p.url === url)?.data.description ?? "";
  return tree.children
    .filter((n): n is PageTree.Folder => n.type === "folder")
    .flatMap((part) =>
      part.children
        .filter((n): n is PageTree.Folder => n.type === "folder" && Boolean(n.index))
        .map((s) => ({
          name: s.name,
          icon: s.icon,
          url: s.index!.url,
          blurb: describe(s.index!.url),
          pages: s.children.filter((c) => c.type === "page").length,
          part: String(part.name),
        })),
    );
}

const hangar = [
  { id: "f-22a", name: "F-22A" },
  { id: "su-57", name: "Su-57" },
  { id: "rafale-c", name: "Rafale C" },
  { id: "f-15c", name: "F-15C" },
  { id: "typhoon", name: "Typhoon" },
  { id: "su-35s", name: "Su-35S" },
];

const questions = [
  { q: "How do I notch a radar missile?", href: "/survival/the-notch/" },
  { q: "When do flares actually work?", href: "/survival/flares/" },
  { q: "Soft lock or hard lock?", href: "/radar/locking/" },
  { q: "Why did my missile fall short?", href: "/weapons/missile-flight/" },
  { q: "What does the HUD show?", href: "/interface/hud/" },
];

export default function Home() {
  const all = sections();
  const pageCount = source.getPages().length;

  return (
    <main id="content" className="flex-1 overflow-hidden">
      {/* ---------- Hero ---------- */}
      <section className="border-b border-fd-border">

        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.05fr_1fr] lg:pb-28">
          <div>
            <p className="text-sm font-medium text-fd-muted-foreground">The MissileSim player&rsquo;s guide</p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-fd-foreground sm:text-6xl xl:text-7xl">
              Master the sky.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-fd-muted-foreground">
              Everything you need to fly, fight and survive in MissileSim: the jet, the radar, every missile, and how
              to beat the shot that&rsquo;s coming for you.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/start/first-sortie/"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-fd-primary px-5 text-sm font-semibold text-fd-primary-foreground hover:opacity-90"
              >
                Start flying
                <ArrowRight className="size-4" />
              </Link>
              <SearchButton />
            </div>
            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-fd-border pt-6">
              {[
                ["13", "flyable jets"],
                ["65", "named missiles"],
                [String(pageCount), "guide pages"],
              ].map(([n, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-mono text-2xl font-semibold tabular-nums text-fd-foreground">{n}</dd>
                  <dd className="text-xs text-fd-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-[600px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/aircraft-cut/f-16c-block-50.webp"
              width={574}
              height={411}
              alt="The game's F-16C Block 50"
              className="relative mx-auto aspect-[4/3] w-full object-contain"
            />
            <div className="absolute bottom-[6%] left-[4%] rounded-md border border-fd-border bg-fd-card px-3 py-2 font-mono text-[11px] leading-tight text-fd-muted-foreground">
              <span className="text-fd-foreground">F-16C</span> BLOCK 50
              <br />
              +9 / −3 G &nbsp; 308°/S ROLL
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Sections ---------- */}
      <section className="mx-auto max-w-[1240px] px-6 pb-20 pt-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-fd-foreground sm:text-3xl">Explore the guide</h2>
            <p className="mt-2 text-fd-muted-foreground">Start at the top and work down, or jump straight to what you need.</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {questions.map((q) => (
              <li key={q.href}>
                <Link
                  href={q.href}
                  className="inline-flex items-center rounded-md border border-fd-border px-3 py-1.5 text-xs text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground"
                >
                  {q.q}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((s, i) => (
            <Link
              key={s.url}
              href={s.url}
              className="group flex flex-col rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-muted-foreground/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-fd-muted-foreground group-hover:text-fd-foreground [&_svg]:size-5">
                  {s.icon}
                </span>
                <span className="font-mono text-xs text-fd-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-fd-foreground">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-fd-muted-foreground">{s.blurb}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-fd-muted-foreground">
                <span>
                  {s.part}, {s.pages} {s.pages === 1 ? "page" : "pages"}
                </span>
                <ArrowUpRight className="size-4 group-hover:text-fd-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Hangar strip ---------- */}
      <section className="border-y border-fd-border">
        <div className="mx-auto max-w-[1240px] px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-fd-foreground sm:text-3xl">Thirteen jets. All of them yours.</h2>
              <p className="mt-2 max-w-xl text-fd-muted-foreground">
                Every aircraft in the hangar is flyable, each with its own radar, signature and handling.
              </p>
            </div>
            <Link href="/aircraft/roster/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-fd-foreground hover:underline">
              See the roster
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {hangar.map((j) => (
              <Link
                key={j.id}
                href="/aircraft/roster/"
                className="group rounded-lg border border-fd-border p-4 text-center transition-colors hover:bg-fd-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/img/aircraft-cut/${j.id}.webp`}
                  alt={`The game's ${j.name}`}
                  loading="lazy"
                  className="mx-auto h-20 w-full object-contain"
                />
                <span className="mt-3 block text-sm font-medium text-fd-muted-foreground group-hover:text-fd-foreground">{j.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing call ---------- */}
      <section className="mx-auto max-w-[1240px] px-6 py-20">
        <div className="rounded-xl border border-fd-border bg-fd-card px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.035em] text-fd-foreground sm:text-4xl">Ready for your first sortie?</h2>
          <p className="mx-auto mt-3 max-w-lg text-fd-muted-foreground">
            Take off, find them on the radar, lock one up, take the shot, and survive the reply. Six steps.
          </p>
          <Link
            href="/start/first-sortie/"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-fd-primary px-5 text-sm font-semibold text-fd-primary-foreground hover:opacity-90"
          >
            Start flying <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-fd-border">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-fd-muted-foreground">
          <span>MissileSim Guide</span>
          <span className="max-w-xl">
            The radar, seekers and countermeasures in MissileSim are gameplay models, not a description of any real
            system.
          </span>
        </div>
      </footer>
    </main>
  );
}
