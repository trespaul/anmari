import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import { metadata } from "@/metadata.ts";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("updates");
  return rss({
    title: metadata.title,
    description: metadata.description,
    site: context.site as URL,
    items: posts.map(({id, rendered, data: { title, description, start }} ) => ({
      title,
      description: description ?? "",
      content: rendered?.html,
      pubDate: start,
      link: `/post/${id}/`,
    })),
  });
}
