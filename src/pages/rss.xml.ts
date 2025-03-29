import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getEntry, getCollection, type CollectionEntry } from 'astro:content';

const title =
  ( await getEntry('metadata', 'title') as CollectionEntry<'metadata'>
  ).data.value;

const description =
  ( await getEntry('metadata', 'description') as CollectionEntry<'metadata'>
  ).data.value;

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('updates');
  return rss({
    title: title,
    description: description,
    site: context.site as URL,
    items: posts.map(({ data: { title, description, slug, content, start }} ) => ({
      title,
      description: description ?? '',
      content: content ?? '',
      pubDate: new Date(start),
      link: `/post/${slug}/`,
    })),
  });
}
