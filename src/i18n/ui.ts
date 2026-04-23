import pt from './pt.json';
import en from './en.json';
import type { Locale } from '../consts';

const dict = { pt, en } as const;

export function t(lang: Locale, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, dict[lang]);
  return typeof value === 'string' ? value : key;
}
