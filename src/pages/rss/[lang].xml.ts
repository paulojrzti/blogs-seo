import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPosts, nicheOf } from '../../lib/posts';
import {
  LOCALES,
  NICHES,
  SITE_NAME,
  SITE_URL,
  type Locale,
  type Niche,
} from '../../consts';

export function getStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

export async function GET({ params }: APIContext) {
  const lang = params.lang as Locale;
  const all = (await Promise.all(NICHES.map((n) => getAllPosts(n as Niche, lang))))
    .flat()
    .sort((a, b) => +b.data.publish_date - +a.data.publish_date)
    .slice(0, 50);

  return rss({
    title: `${SITE_NAME} — ${lang.toUpperCase()}`,
    description:
      lang === 'pt'
        ? 'Finanças e fitness baseados em dados.'
        : 'Data-driven finance and fitness.',
    site: SITE_URL,
    items: all.map((p) => ({
      title: p.data.title,
      description: p.data.excerpt,
      pubDate: p.data.publish_date,
      link: `/${lang}/${nicheOf(p)}/${p.data.category}/${p.slug}`,
      categories: p.data.tags,
    })),
    customData: `<language>${lang === 'pt' ? 'pt-br' : 'en-us'}</language>`,
  });
}
