// TODO: to link directly to category, take current category from url param?
// TODO: upcoming should be sorted asc be default
// TODO: default is upcoming, but if upcoming is empty, show all posts
// FUTURE TODO: paginate
// FUTURE TODO: include media preview in list

import { createSignal, createMemo, For, Show, type Accessor } from "solid-js";
import { ToggleGroup } from "@ark-ui/solid/toggle-group";
import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<"updates">;

type SortOrder = "desc" | "asc";
type TimeFilter = "next" | "all" | "past";

const TYPES = ["event", "video", "music"] as const;

function formatDate(date: Date) {
  const formatted = date.toLocaleDateString("en-za", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <time datetime={date.toISOString()}>{formatted}</time>;
}

function isPast(start: Date, end?: Date): boolean {
  const checkDate = end ?? start;
  return checkDate < new Date();
}

function TypeToggleButton(props: { value: string; children: any }) {
  return (
    <ToggleGroup.Item
      value={props.value}
      class="px-3 py-1 border-y border-l border-r-0 first:border-l last:border-r
        cursor-pointer text-xl uppercase
        data-[state=on]:bg-text data-[state=on]:text-bg data-[state=on]:border-text
        dark:data-[state=on]:bg-darktext dark:data-[state=on]:text-darkbg dark:data-[state=on]:border-darktext"
    >
      {props.children}
    </ToggleGroup.Item>
  );
}

function TimeToggleButton(props: { value: TimeFilter; children: any }) {
  return (
    <ToggleGroup.Item
      value={props.value}
      class="px-3 py-1 border-y border-l border-r-0 first:border-l last:border-r
        cursor-pointer text-xl uppercase
        data-[state=on]:bg-text data-[state=on]:text-bg data-[state=on]:border-text
        dark:data-[state=on]:bg-darktext dark:data-[state=on]:text-darkbg dark:data-[state=on]:border-darktext"
    >
      {props.children}
    </ToggleGroup.Item>
  );
}

export default function List(props: { posts: Post[] }) {
  const [selectedTypes, setSelectedTypes] = createSignal<Set<string>>(new Set(TYPES));
  const [sortOrder, setSortOrder] = createSignal<SortOrder>("desc");
  const [timeFilter, setTimeFilter] = createSignal<TimeFilter>("next");

  const filteredAndSortedPosts: Accessor<Post[]> = createMemo((): Post[] => {
    let posts: Post[] = props.posts.filter((post: Post) => {
      if (!selectedTypes().has(post.data.type[0])) return false;

      const end = post.data.end;
      const start = post.data.start;
      if (timeFilter() === "next" && isPast(start, end)) return false;
      if (timeFilter() === "past" && !isPast(start, end)) return false;

      return true;
    });

    posts.sort((a: Post, b: Post) => {
      const aTime = a.data.start.getTime();
      const bTime = b.data.start.getTime();
      return sortOrder() === "desc" ? bTime - aTime : aTime - bTime;
    });

    return posts;
  });

  return (
    <div class="space-y-6">
      <div class="flex flex-wrap gap-6 items-center">
        <fieldset>
          <legend class="sr-only">Filter by type</legend>
          <ToggleGroup.Root
            multiple
            value={Array.from(selectedTypes())}
            onValueChange={(details) => setSelectedTypes(new Set(details.value))}
            class="flex"
          >
            <For each={TYPES}>
              { type => <TypeToggleButton value={type}>{type}</TypeToggleButton> }
            </For>
          </ToggleGroup.Root>
        </fieldset>

        <fieldset>
          <legend class="sr-only">Filter by time</legend>
          <ToggleGroup.Root
            value={[timeFilter()]}
            onValueChange={(details) => setTimeFilter(details.value[0] as TimeFilter)}
            class="flex"
          >
            <For each={["next", "all", "past"] as TimeFilter[]}>
              { filter => <TimeToggleButton value={filter}>{filter}</TimeToggleButton> }
            </For>
          </ToggleGroup.Root>
        </fieldset>

        <button
          onClick={() => setSortOrder(o => (o === "desc" ? "asc" : "desc"))}
          class="px-3 py-1 border cursor-pointer text-xl uppercase hover:opacity-70"
        >
          {sortOrder()}
        </button>
      </div>

      <Show
        when={filteredAndSortedPosts().length > 0}
        fallback={
          <p class="opacity-70">No entries match your filters.</p>
        }
      >
        <ol id="list" class="list-none ml-0">
          <For each={filteredAndSortedPosts()}>
            { (post: Post) => <ListItem post={post} /> }
          </For>
        </ol>
      </Show>
    </div>
  );
}

function ListItem(props: { post: Post }) {
  const { id, data } = props.post;
  return (
    <li class="mb-4">
      <a href={`/post/${id}`}>
      {/* TODO: don't link if no content?
          TODO: icon to indicate music/video?
      */}
        <ul class="list-none ml-0 pb-4">
          <li class="opacity-70">
            <Show when={data.start}>
              <span>{formatDate(data.start)}</span>{data.end && ` – ${formatDate(data.end)}`}
            </Show>
          </li>
          <li class="text-balance">{data.title}</li>
          <Show when={data.description}>
            <li class="text-balance opacity-70">
              {data.description}
            </li>
          </Show>
          <Show when={data.place}>
            <li class="text-balance italic opacity-70">
              {data.place}
            </li>
          </Show>
        </ul>
      </a>
    </li>
  );
}
