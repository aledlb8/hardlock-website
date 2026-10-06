import { notFound } from "next/navigation";
import { generateOGImage } from "fumadocs-ui/og";
import { source } from "@/lib/source";
import { appName, getPageImageUrl } from "@/lib/shared";

// One social card per page, rendered at build time.
export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/og/[...slug]">) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: appName,
    primaryColor: "rgba(250,250,250,0.18)",
    primaryTextColor: "rgb(250,250,250)",
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: getPageImageUrl(page).segments }));
}
