import { createGetUrl } from "fumadocs-core/source";

export const appName = "MissileSim Guide";
export const docsRoute = "/";
export const docsImageRoute = "/og";




const getImageUrl = createGetUrl(docsImageRoute);
export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "image.png"];
  return { segments, url: getImageUrl(segments, page.locale) };
}
