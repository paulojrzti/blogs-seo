export const SITE_URL = 'https://blogs-seo.paulojrzti.workers.dev';
export const SITE_NAME = 'YourBrand';
export const GITHUB_REPO = 'paulojrzti/blogs-seo';

export const DEFAULT_LOCALE = 'pt' as const;
export const LOCALES = ['pt', 'en'] as const;
export const NICHES = ['finance', 'fitness'] as const;

export type Locale = (typeof LOCALES)[number];
export type Niche = (typeof NICHES)[number];

export const localeTag = (l: Locale): string => (l === 'pt' ? 'pt-BR' : 'en-US');
export const otherLocale = (l: Locale): Locale => (l === 'pt' ? 'en' : 'pt');

export const NICHE_LABELS: Record<Niche, Record<Locale, string>> = {
  finance: { pt: 'Finanças', en: 'Finance' },
  fitness: { pt: 'Fitness', en: 'Fitness' },
};

/**
 * Pares de tradução entre slugs de categoria (PT↔EN).
 * Fonte única da verdade para URLs internacionalizadas.
 */
export const CATEGORY_I18N: Record<Niche, Array<Record<Locale, string>>> = {
  finance: [
    { pt: 'investimentos', en: 'investing' },
    { pt: 'renda-fixa', en: 'fixed-income' },
    { pt: 'renda-variavel', en: 'stocks' },
    { pt: 'cripto', en: 'crypto' },
    { pt: 'planejamento-financeiro', en: 'financial-planning' },
  ],
  fitness: [
    { pt: 'treino', en: 'training' },
    { pt: 'nutricao', en: 'nutrition' },
    { pt: 'hipertrofia', en: 'hypertrophy' },
    { pt: 'emagrecimento', en: 'weight-loss' },
    { pt: 'suplementacao', en: 'supplements' },
  ],
};

export const CATEGORIES: Record<Niche, Record<Locale, string[]>> = {
  finance: {
    pt: CATEGORY_I18N.finance.map((p) => p.pt),
    en: CATEGORY_I18N.finance.map((p) => p.en),
  },
  fitness: {
    pt: CATEGORY_I18N.fitness.map((p) => p.pt),
    en: CATEGORY_I18N.fitness.map((p) => p.en),
  },
};

export const CATEGORY_LABELS: Record<Niche, Record<Locale, Record<string, string>>> = {
  finance: {
    pt: {
      investimentos: 'Investimentos',
      'renda-fixa': 'Renda Fixa',
      'renda-variavel': 'Renda Variável',
      cripto: 'Criptomoedas',
      'planejamento-financeiro': 'Planejamento Financeiro',
    },
    en: {
      investing: 'Investing',
      'fixed-income': 'Fixed Income',
      stocks: 'Stocks',
      crypto: 'Crypto',
      'financial-planning': 'Financial Planning',
    },
  },
  fitness: {
    pt: {
      treino: 'Treino',
      nutricao: 'Nutrição',
      hipertrofia: 'Hipertrofia',
      emagrecimento: 'Emagrecimento',
      suplementacao: 'Suplementação',
    },
    en: {
      training: 'Training',
      nutrition: 'Nutrition',
      hypertrophy: 'Hypertrophy',
      'weight-loss': 'Weight Loss',
      supplements: 'Supplements',
    },
  },
};
