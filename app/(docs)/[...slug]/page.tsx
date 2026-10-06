import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/notebook/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { icons } from "lucide-react";
import { createElement } from "react";
import { getMDXComponents } from "@/components/mdx";
import { SectionIndex } from "@/components/section-index";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { source } from "@/lib/source";
import { getPageImageUrl } from "@/lib/shared";

export default async function Page(props: PageProps<"/[...slug]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  // A section's landing page lists the section's own pages as cards.
  const sectionPages = source
    .getPages()
    .filter((p) => p.url !== page.url && p.slugs.length === page.slugs.length + 1 && p.url.startsWith(page.url));
  const order = new Map(source.getPages().map((p, i) => [p.url, i]));
  sectionPages.sort((a, b) => (order.get(a.url) ?? 0) - (order.get(b.url) ?? 0));

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: "clerk" }}
      breadcrumb={{ includeRoot: false, includePage: false }}
    >
      <DocsTitle className="ms-title">{page.data.title}</DocsTitle>
      <DocsDescription className="mb-8 border-b border-fd-border pb-8 text-[1.05rem]">{page.data.description}</DocsDescription>
      <DocsBody className="ms-body">
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
            // <PageContents /> drops a collapsible table of contents into long pages.
            PageContents: () => <InlineTOC items={page.data.toc}>On this page</InlineTOC>,
            SectionIndex: () => (
              <SectionIndex
                entries={sectionPages.map((p) => ({
                  title: p.data.title,
                  description: p.data.description,
                  url: p.url,
                  icon: p.data.icon && p.data.icon in icons ? createElement(icons[p.data.icon as keyof typeof icons]) : undefined,
                }))}
              />
            ),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/[...slug]">): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: { images: getPageImageUrl(page).url },
  };
}
