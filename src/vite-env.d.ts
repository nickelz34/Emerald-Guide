/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_BASE_PATH?: string;
  readonly VITE_GITHUB_OWNER?: string;
  readonly VITE_GITHUB_REPO?: string;
  readonly VITE_GUIDE_DATA_PATH?: string;
  readonly VITE_GITHUB_BRANCH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
