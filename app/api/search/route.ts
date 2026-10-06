import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Built once at export time and searched in the browser. Each page is tagged
// with its part of the guide (fly / fight / reference) so search can filter.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  language: "english",
  async buildIndex(page) {
    const group = page.path.match(/^\((\w+)\)/)?.[1];
    return {
      id: page.url,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      structuredData: page.data.structuredData,
      tag: group,
    };
  },
});
