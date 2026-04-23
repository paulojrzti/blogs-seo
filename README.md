# blogs-seo

Plataforma multi-nicho (finance + fitness), bilíngue (PT/EN), 100% estática, com Decap CMS e deploy no Cloudflare Pages.

## Stack

- **Astro 5** (SSG) + Content Collections (Zod)
- **MDX** com componentes injetáveis (`AdSlot`, `AffiliateBox`, `CTAInline`, `FAQ`)
- **TailwindCSS** + `@tailwindcss/typography`
- **Decap CMS 3** (editorial workflow) + OAuth via Cloudflare Worker
- **Pagefind** para busca client-side ultrarrápida (indexada em build)
- **Cloudflare Pages** (site) + **Cloudflare Worker** (OAuth broker)

## Estrutura de URLs

- `/pt` · `/en` — home por idioma
- `/[lang]/[niche]` — hub do silo (finance | fitness)
- `/[lang]/[niche]/[category]` — pilar da categoria (slugs internacionalizados)
- `/[lang]/[niche]/[category]/[slug]` — post
- `/[lang]/search` — busca client-side via Pagefind
- `/rss/[lang].xml` — feed RSS por idioma
- `/sitemap-index.xml` — sitemap multi-locale
- `/admin` — painel Decap CMS

### Slugs de categoria internacionalizados

Definidos em `src/consts.ts` (`CATEGORY_I18N`):

| Nicho   | PT                          | EN                    |
| ------- | --------------------------- | --------------------- |
| finance | `investimentos`             | `investing`           |
| finance | `renda-fixa`                | `fixed-income`        |
| finance | `renda-variavel`            | `stocks`              |
| finance | `cripto`                    | `crypto`              |
| finance | `planejamento-financeiro`   | `financial-planning`  |
| fitness | `treino`                    | `training`            |
| fitness | `nutricao`                  | `nutrition`           |
| fitness | `hipertrofia`               | `hypertrophy`         |
| fitness | `emagrecimento`             | `weight-loss`         |
| fitness | `suplementacao`             | `supplements`         |

O helper `translateCategory()` em `src/lib/categories.ts` cuida dos `hreflang` corretos entre páginas de categoria.

## Setup local

```bash
nvm use
npm install
npm run dev
```

Para editar localmente sem OAuth do GitHub, rode `npx decap-server` em outro terminal e troque o `backend` do `public/admin/config.yml` para `git-gateway` ou `proxy` (apenas em dev).

## Deploy — checklist inicial

1. **Cloudflare Pages**
   - Crie projeto `blogs-seo` apontando para `github.com/paulojrzti/blogs-seo`.
   - Build command: `npm run build` · Output directory: `dist`
   - Node version: `20`

2. **GitHub OAuth App** (Settings → Developer settings → OAuth Apps → New)
   - Homepage URL: `https://blogs-seo.pages.dev`
   - Authorization callback URL: `https://decap-oauth.<seu-subdominio>.workers.dev/callback`

3. **Deploy do Worker OAuth**
   ```bash
   cd workers/decap-oauth
   npm install
   npx wrangler login
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   npx wrangler deploy
   ```

4. **Ajuste** `public/admin/config.yml` → `base_url` = URL real do Worker (substitua `CHANGE-ME`).

5. **Secrets do GitHub Actions** (Settings → Secrets → Actions):
   - `CLOUDFLARE_API_TOKEN` (escopo: Pages + Workers)
   - `CLOUDFLARE_ACCOUNT_ID`
   - *(opcional)* `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_ADSENSE_TOP`, `PUBLIC_ADSENSE_MIDDLE`, `PUBLIC_ADSENSE_BOTTOM`

6. **Custom domain** (opcional): no Cloudflare Pages aponte seu domínio e atualize:
   - `SITE_URL` em `src/consts.ts`
   - `ALLOWED_ORIGIN` em `workers/decap-oauth/wrangler.toml`
   - URLs no `public/admin/config.yml` e `public/robots.txt`

## Fluxo editorial

1. Editor abre `/admin`, faz login via GitHub (broker OAuth).
2. Cria/edita posts em uma das 4 coleções: `finance_pt`, `finance_en`, `fitness_pt`, `fitness_en`.
3. Editorial workflow: `draft → in review → ready → published`.
4. Merge em `main` dispara GitHub Actions → build Astro → Pagefind → deploy Pages.

## Componentes MDX injetáveis

Dentro de qualquer `.mdx` do Content Collections:

```mdx
import AdSlot from '../../components/monetization/AdSlot.astro';
import AffiliateBox from '../../components/monetization/AffiliateBox.astro';
import CTAInline from '../../components/monetization/CTAInline.astro';
import FAQ from '../../components/content/FAQ.astro';

<AdSlot position="middle" />

<AffiliateBox
  title="Curso ETFs 2026"
  rating={5}
  price="R$ 497"
  url="https://example.com/ref"
  badge="MAIS VENDIDO"
  lang="pt"
/>

<CTAInline label="Abrir conta" url="https://example.com" external />

<FAQ items={frontmatter.faq} lang="pt" />
```

## Decisões arquiteturais

- **Silos (topic clusters)**: cada categoria tem um post pilar (`pillar: true`). `pickRelated()` prioriza (1) posts em `related[]` do frontmatter → (2) tags em comum → (3) mesma categoria.
- **i18n**: `astro:i18n` nativo com `prefixDefaultLocale: true` e `x-default` apontando para PT.
- **SEO**: canonical, hreflang (incluindo para páginas de categoria com slugs traduzidos), Open Graph, Twitter Card, Schema.org `Article` + `BreadcrumbList` + `FAQPage`, sitemap multi-locale, RSS por idioma.
- **Performance**: zero hidratação (`client:*` não é usado), imagens via `astro:assets`, CSS inline automático, prefetch on viewport. Pagefind só carrega em `/search`.
- **Monetização**: AdSense via `is:inline` (sem bloqueio), links afiliados com `rel="sponsored nofollow noopener"`, disclosure i18n via flag `affiliate_disclosure`.
- **Pagefind**: `data-pagefind-body` no `<main>` de posts para indexação focada; `data-pagefind-ignore` em ads, afiliados e CTAs para não poluir os resultados.

## Variáveis de ambiente

Veja `.env.example`. Todas são opcionais (sem AdSense os slots renderizam placeholders).

## Validação Zod

Schema em `src/content/config.ts` valida rigorosamente no `npm run build`:
- `title` 10-70 chars (SERP-friendly)
- `seo_title` 10-60 chars
- `seo_description` 120-160 chars
- `excerpt` 80-200 chars
- `slug` kebab-case obrigatório
- `featured_image_alt` obrigatório (SEO/A11y)
- `faq[]` opcional com `question` + `answer`

## Licença

MIT.
