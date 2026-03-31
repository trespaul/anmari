import { Show } from "solid-js";

type PostData = {
  title: string;
  description?: string;
  type: ("event" | "video" | "music")[];
  place?: string;
  start: Date;
  end?: Date;
};

type Post = {
  id: string;
  data: PostData;
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-za", {
    month: "long",
    day: "numeric",
  });
}

// FUTURE TODO: show "NOW: {ongoing event}" if post end date >= now

export default function NextUp(props: { sortedPosts: Post[] }) {
  const now = new Date();

  // next-up = first post of those that are >= now
  const next = props.sortedPosts.filter(post =>
    post.data.start >= now
  )[0];

  const toShow = next ? {
    type: "next",
    post: next,
  } : {
    type: "latest",
    post: (props.sortedPosts.filter(post =>
      post.data.start < now
    )).reverse()[0],
  }

  return <>
    <span class="smallcaps">{toShow.type}</span>
    <span style="baseline-shift: 3px">→</span>
    <a href={`/post/${toShow.post.id}`}>
      {formatDate(toShow.post.data.start)}: {toShow.post.data.title}
      <Show when={toShow.post.data.place}>
        <span class="italic">, {toShow.post.data.place}</span>
      </Show>
    </a>
  </>;
}
