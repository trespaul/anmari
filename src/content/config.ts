import { defineCollection } from 'astro:content';
import directus from '@/lib/directus';
import { readItems, readFiles, readSingleton } from '@directus/sdk';
import type { Loader, LoaderContext } from 'astro/loaders';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

type Collection = 'pages' | 'updates';

function directusLoader(options: { collection: Collection }): Loader {
  return {
    name: 'directusLoader',
    load: async (context: LoaderContext) => {
      const data = await directus.request(readItems(options.collection, {
        fields: ['*', { photos: ['*'], featured_image: ['*'], }],
      }));
      const processor = await createMarkdownProcessor(context.config.markdown);
      data.forEach(async item => {
        const id = item.slug;
        const data = await context.parseData({ id, data: item });
        const digest = context.generateDigest(data);
        const rendered = await processor.render(item.content ?? '');
        context.store.set({
          id,
          data,
          digest,
          rendered: {
            html: rendered.code,
          },
        });
      });
    },
  }
};

const pages = defineCollection({
  loader: directusLoader({ collection: 'pages' }),
})

const updates = defineCollection({
  loader: directusLoader({ collection: 'updates' }),
})

const metadata = defineCollection({
  loader: async () => {
    const data = await directus.request(readSingleton('metadata'));
    return Object.keys(data).map(key => ({
      id: key,
      value: data[key as keyof typeof data]
    }));
  },
})

const files = defineCollection({
  loader: async () => {
    const data = await directus.request(readFiles());
    return data.map((item) => ({
      url: `${directus.url.origin}/assets/${item.id}/${item.filename_download}`,
      ...item,
    }));
  }
})

export const collections = {
  metadata,
  pages,
  updates,
  files,
};
