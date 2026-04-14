import { For, Show, createEffect, createMemo, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { $posts, $status, loadPosts } from "@/store.ts";

export type PostMeta = {
  id: string,
  title: string,
  description?: string,
  type: ("event" | "music" | "video")[],
  start: Date,
  end?: Date,
  place?: string,
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-za", {
    month: "long",
    day: "numeric",
  });
}

//TODO: sort

// FUTURE TODO: show "NOW: {ongoing event}" if post end date >= now

export default function NextUp() {
  const posts = useStore($posts);
  const status = useStore($status);

  onMount(() => loadPosts());

  const now = new Date();

  // next-up = first post of those that are >= now
  const next = createMemo((): PostMeta => posts().find((post: PostMeta) =>
    post.start >= now
  )!);

  const toShow = createMemo((): {type: string, post: PostMeta} => next() ? {
    type: "next",
    post: next(),
  } : {
    type: "latest",
    post: (posts().filter((post: PostMeta) =>
      post.start < now
    )).reverse()[0],
  });

  return (
    <Show when={toShow().post}>
      <span class="smallcaps">{toShow().type}</span>
      <span style="baseline-shift: 3px">→</span>
      <a href={`/post/${toShow().post.id}`}>
        {formatDate(toShow().post.start)}: {toShow().post.title}
        <Show when={toShow().post.place}>
          <span class="italic">, {toShow().post.place}</span>
        </Show>
      </a>
    </Show>
  );
}
