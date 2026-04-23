/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_ADSENSE_TOP?: string;
  readonly PUBLIC_ADSENSE_MIDDLE?: string;
  readonly PUBLIC_ADSENSE_BOTTOM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
