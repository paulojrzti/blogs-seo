import {
  SITE_URL,
  localeTag,
  otherLocale,
  type Locale,
  type Niche,
} from '../consts';
import { translateCategory } from './categories';
import type { Post } from './posts';

export const postUrl = (n: Niche, l: Locale, c: string, s: string) =>
  `${SITE_URL}/${l}/${n}/${c}/${s}`;

export const nicheUrl = (n: Niche, l: Locale) => `${SITE_URL}/${l}/${n}`;

export const categoryUrl = (n: Niche, l: Locale, c: string) =>
  `${SITE_URL}/${l}/${n}/${c}`;

export interface HrefLink {
  lang: string;
  url: string;
}

export function buildPostHreflang(
  post: Post,
  translation: Post | null,
  niche: Niche,
): HrefLink[] {
  const cur = post.data.language as Locale;
  const other = otherLocale(cur);
  const links: HrefLink[] = [
    { lang: localeTag(cur), url: postUrl(niche, cur, post.data.category, post.slug) },
  ];

  if (translation) {
    links.push({
      lang: localeTag(other),
      url: postUrl(niche, other, translation.data.category, translation.slug),
    });
  }

  links.push({
    lang: 'x-default',
    url: postUrl(niche, 'pt', post.data.category, post.slug),
  });

  return links;
}

/**
 * Hreflang para páginas de categoria, usando o mapeamento PT↔EN de slugs.
 */
export function buildCategoryHreflang(
  niche: Niche,
  lang: Locale,
  category: string,
): HrefLink[] {
  const other = otherLocale(lang);
  const otherSlug = translateCategory(niche, lang, category, other);
  const links: HrefLink[] = [
    { lang: localeTag(lang), url: categoryUrl(niche, lang, category) },
  ];
  if (otherSlug) {
    links.push({ lang: localeTag(other), url: categoryUrl(niche, other, otherSlug) });
  }
  const defaultSlug = lang === 'pt' ? category : translateCategory(niche, lang, category, 'pt');
  if (defaultSlug) {
    links.push({ lang: 'x-default', url: categoryUrl(niche, 'pt', defaultSlug) });
  }
  return links;
}

export function buildNicheHreflang(niche: Niche): HrefLink[] {
  return [
    { lang: 'pt-BR', url: nicheUrl(niche, 'pt') },
    { lang: 'en-US', url: nicheUrl(niche, 'en') },
    { lang: 'x-default', url: nicheUrl(niche, 'pt') },
  ];
}

export function buildRootHreflang(): HrefLink[] {
  return [
    { lang: 'pt-BR', url: `${SITE_URL}/pt` },
    { lang: 'en-US', url: `${SITE_URL}/en` },
    { lang: 'x-default', url: `${SITE_URL}/pt` },
  ];
}
