import { defineCollection, z } from 'astro:content';

const BlogPostSchema = ({ image }: { image: () => z.ZodTypeAny }) =>
  z.object({
    title: z
      .string()
      .min(10, 'Título muito curto (mín. 10)')
      .max(70, 'Título longo demais para SERP (máx. 70)'),

    language: z.enum(['pt', 'en']),

    category: z.string().min(2),

    excerpt: z
      .string()
      .min(80, 'Excerpt muito curto (mín. 80)')
      .max(200, 'Excerpt muito longo (máx. 200)'),

    featured_image: image(),
    featured_image_alt: z.string().min(5, 'alt text obrigatório para SEO/A11y'),

    seo_title: z.string().min(10).max(60, 'Google trunca > 60'),
    seo_description: z
      .string()
      .min(120, 'Description < 120 perde densidade')
      .max(160, 'Google trunca > 160'),

    status: z.enum(['draft', 'published']).default('draft'),

    translation_of: z.string().optional(),

    author: z
      .object({
        name: z.string(),
        url: z.string().url().optional(),
        avatar: z.string().optional(),
      })
      .default({ name: 'Editorial Team' }),

    publish_date: z.coerce.date(),
    updated_date: z.coerce.date().optional(),

    canonical_url: z.string().url().optional(),
    noindex: z.boolean().default(false),

    pillar: z.boolean().default(false),
    pillar_of: z.string().optional(),
    related: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    ad_slots_enabled: z.boolean().default(true),
    affiliate_disclosure: z.boolean().default(false),

    cta: z
      .object({
        label: z.string(),
        url: z.string().url(),
      })
      .optional(),

    faq: z
      .array(
        z.object({
          question: z.string().min(5),
          answer: z.string().min(10),
        }),
      )
      .optional(),
  });

const finance_pt = defineCollection({ type: 'content', schema: BlogPostSchema });
const finance_en = defineCollection({ type: 'content', schema: BlogPostSchema });
const fitness_pt = defineCollection({ type: 'content', schema: BlogPostSchema });
const fitness_en = defineCollection({ type: 'content', schema: BlogPostSchema });

const categories = defineCollection({
  type: 'data',
  schema: z.object({
    niche: z.string().min(1),
    slug_pt: z.string().regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens'),
    slug_en: z.string().regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens'),
    label_pt: z.string().min(2),
    label_en: z.string().min(2),
  }),
});

const niches = defineCollection({
  type: 'data',
  schema: z.object({
    niche_id: z.string().regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens'),
    label_pt: z.string().min(2),
    label_en: z.string().min(2),
  }),
});

export const collections = {
  finance_pt,
  finance_en,
  fitness_pt,
  fitness_en,
  categories,
  niches,
};

export type CollectionKey = keyof typeof collections;
