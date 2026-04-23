import { CATEGORIES, type Locale, type Niche } from '../consts';
import { getAllPosts, type Post } from './posts';

export interface Silo {
  category: string;
  pillar?: Post;
  posts: Post[];
}

export async function buildSilo(niche: Niche, lang: Locale): Promise<Silo[]> {
  const posts = await getAllPosts(niche, lang);
  return CATEGORIES[niche][lang].map((category) => {
    const inCat = posts.filter((p) => p.data.category === category);
    return {
      category,
      pillar: inCat.find((p) => p.data.pillar),
      posts: inCat,
    };
  });
}
