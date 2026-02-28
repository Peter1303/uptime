/// <reference types="vite/client" />

// SVG raw 导入类型声明
declare module "*.svg?raw" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_SITE_TITLE: string;
  readonly VITE_SITE_DESCRIPTION: string;
  readonly VITE_SITE_KEYWORDS: string;
  readonly VITE_SITE_LOGO: string;
  readonly VITE_SITE_ICP: string;
  readonly VITE_COUNT_DAYS: string;
  readonly VITE_SHOW_LINK: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_GITHUB_LINK: string;
  readonly VITE_STATUS_PAGE_SLUG: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
