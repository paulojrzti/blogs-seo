import type { Post } from './posts';

/**
 * Selecção de posts relacionados com prioridade descendente:
 *  1. Posts explicitamente listados em `related` no frontmatter
 *  2. Posts com tags em comum
 *  3. Posts da mesma categoria
 */
export function pickRelated(current: Post, pool: Post[], limit = 4): Post[] {
  const filtered = pool.filter((p) => p.slug !== current.slug);

  const explicit = filtered.filter((p) => current.data.related.includes(p.slug));

  const byTag = filtered.filter(
    (p) =>
      !explicit.includes(p) &&
      p.data.tags.some((tag) => current.data.tags.includes(tag)),
  );

  const sameCat = filtered.filter(
    (p) =>
      !explicit.includes(p) &&
      !byTag.includes(p) &&
      p.data.category === current.data.category,
  );

  return [...explicit, ...byTag, ...sameCat].slice(0, limit);
}
