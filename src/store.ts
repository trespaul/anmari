import { atom } from "nanostores";
// import { type PostMeta } from "@/pages/data.json.ts";

type LoadingStatus = "idle" | "loading" | "error";

export type PostMeta = {
  id: string,
  title: string,
  description?: string,
  type: ("event" | "music" | "video")[],
  start: Date,
  end?: Date,
  place?: string,
};

export type Unparsed = {
  id: string,
  title: string,
  description?: string,
  type: ("event" | "music" | "video")[],
  start: string,
  end?: string,
  place?: string,
};

export const $posts = atom<PostMeta[]>([]);
export const $status = atom<LoadingStatus>("idle");

export const loadPosts = async () => {
  if ($posts.get().length > 0) { return; };

  $status.set("loading");

  try {
    const response = await fetch("/data.json");
    if (!response.ok) throw new Error("Failed to fetch data.");

    const posts = await response.json();

    const parsed = posts.map((post: Unparsed): PostMeta => {return {
      ...post,
      start: new Date(post.start),
      end: post.end ? new Date(post.end) : undefined,
    };})

    $posts.set(parsed);
    $status.set("idle");
  } catch (e) {
    console.error(e);
    $status.set("error");
  }
}
