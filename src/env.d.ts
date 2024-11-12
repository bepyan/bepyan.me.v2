// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_ID: string;
  readonly PUBLIC_MIXPANEL_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
