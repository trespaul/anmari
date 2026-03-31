import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pageSchema = ({ image }: SchemaContext) => z.object({
  title: z.string(),
  description: z.string().optional(),
  images: z.object({
    file: image(),
    alt: z.string(),
  }).array().optional(),
});

const updateSchema = ({ image }: SchemaContext) => z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["event", "video", "music"]).array(),
  place: z.string().optional(),
  start: z.coerce.date(),
  end: z.coerce.date().optional(),
  images: z.object({
    file: image(),
    alt: z.string(),
  }).array().optional(),
});

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages/", pattern: "**/*.{md,mdx}" }),
  schema: pageSchema,
});

const updates = defineCollection({
  loader: glob({ base: "./src/content/updates/", pattern: "**/*.{md,mdx}" }),
  schema: updateSchema,
});

export const collections = {
  pages,
  updates,
};
