import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        slate: {
          css: {
            '--tw-prose-links': theme('colors.blue.600'),
            '--tw-prose-headings': theme('colors.slate.900'),
          },
        },
      }),
    },
  },
  plugins: [typography],
};
