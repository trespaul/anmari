import { type CollectionEntry, getCollection } from 'astro:content';

type Post = CollectionEntry<"updates">;

export type PostMeta = {
  id: string,
  title: string,
  description?: string,
  type: ("event" | "music" | "video")[],
  start: Date,
  end?: Date,
  place?: string,
};

export async function GET() {
  const all: Post[] = await getCollection('updates');

  const sanitised: PostMeta[] = all.map((entry: Post): PostMeta => ({
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    type: entry.data.type,
    start: entry.data.start,
    end: entry.data.end,
    place: entry.data.place,
  }));

  return new Response(JSON.stringify(sanitised), {
    headers: { 'Content-Type': 'application/json' }
  });
}
