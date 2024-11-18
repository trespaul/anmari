import { createDirectus, rest } from '@directus/sdk';

type Metadata = {
  title: string;
  author: string;
  tagline: string;
  description: string;
  logo: string;
  url: string;
}

type Page = {
  slug: string;
  title: string;
  content?: string;
  photos?: number[] | File[];
  music?: {
    title: string;
    id: string;
    url: string;
  }[];
}

type Update = {
  slug: string;
  title: string;
  description?: string;
  content?: string;
  featured_image?: number | File;
  type: [];
  place?: string;
  start?: Date;
  end?: Date;
  photos?: number[] | File[];
  videos?: {
    video_id: string,
    video_title: string,
  }[];
}

type File = {
  id: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
  filename_download: string;
}

type Schema = {
  metadata: Metadata;
  updates: Update[];
  pages: Page[];
  files: File[];
}

const directus =
  createDirectus<Schema>('https://anmari.trespaul.com')
  .with(rest());

export default directus;
