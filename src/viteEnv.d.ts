/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="google-apps-script" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  // ajoutez ici d'autres variables d'environnement si nécessaire
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
