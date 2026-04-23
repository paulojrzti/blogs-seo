import { CATEGORY_I18N, CATEGORY_LABELS, type Locale, type Niche } from '../consts';

/**
 * Traduz um slug de categoria de um idioma para outro.
 * Ex.: translateCategory('finance', 'pt', 'investimentos', 'en') === 'investing'
 */
export function translateCategory(
  niche: Niche,
  from: Locale,
  category: string,
  to: Locale,
): string | undefined {
  const pair = CATEGORY_I18N[niche].find((p) => p[from] === category);
  return pair?.[to];
}

/**
 * Retorna o label humanizado da categoria no idioma alvo.
 */
export function categoryLabel(niche: Niche, lang: Locale, slug: string): string {
  return CATEGORY_LABELS[niche][lang][slug] ?? slug.replace(/-/g, ' ');
}

/**
 * Valida se o slug de categoria pertence ao nicho no idioma dado.
 */
export function isValidCategory(niche: Niche, lang: Locale, slug: string): boolean {
  return CATEGORY_I18N[niche].some((p) => p[lang] === slug);
}
