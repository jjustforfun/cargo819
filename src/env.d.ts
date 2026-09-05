/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  // Add Yandex Metrika, etc. via env to avoid hardcoding secrets
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
