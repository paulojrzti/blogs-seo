import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale, Niche } from '../consts';

export type Post =
  | CollectionEntry<'finance_pt'>
  | CollectionEntry<'finance_en'>
  | CollectionEntry<'fitness_pt'>
  | CollectionEntry<'fitness_en'>;

const key = (n: Niche, l: Locale) => `${n}_${l}` as const;

const isPub = (p: Post) => p.data.status === 'published';
const byDate = (a: Post, b: Post) => +b.data.publish_date - +a.data.publish_date;

export async function getAllPosts(niche: Niche, lang: Locale): Promise<Post[]> {
  const entries = (await getCollection(key(niche, lang))) as Post[];
  return entries.filter(isPub).sort(byDate);
}

export async function getByCategory(
  niche: Niche,
  lang: Locale,
  category: string,
): Promise<Post[]> {
  return (await getAllPosts(niche, lang)).filter((p) => p.data.category === category);
}

export function nicheOf(post: Post): Niche {
  return post.collection.split('_')[0] as Niche;
}

export function langOf(post: Post): Locale {
  return post.collection.split('_')[1] as Locale;
}

export async function getTranslation(post: Post, targetLang: Locale): Promise<Post | null> {
  if (!post.data.translation_of) return null;
  const pool = await getAllPosts(nicheOf(post), targetLang);
  return pool.find((p) => p.slug === post.data.translation_of) ?? null;
}
