import type { SiteLangType } from "@/types/main";

// 站点配置
export const siteConfig = {
  siteTitle: import.meta.env.VITE_SITE_TITLE || "服务监测状态",
  siteDescription:
    import.meta.env.VITE_SITE_DESCRIPTION || "一个简约的站点监测",
  siteKeywords: import.meta.env.VITE_SITE_KEYWORDS || "站点监测,监测,监控",
  siteLogo: import.meta.env.VITE_SITE_LOGO || "/favicon.ico",
  siteIcp: import.meta.env.VITE_SITE_ICP || "",
  countDays: Number(import.meta.env.VITE_COUNT_DAYS || 60),
  showLink: import.meta.env.VITE_SHOW_LINK !== "false",
  version: "3.0.0",
};

// API 配置 (UptimeKuma)
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || "",
  slug: import.meta.env.VITE_STATUS_PAGE_SLUG || "default", // 状态页 slug
};

// 语言数据
export const langData: { label: string; value: SiteLangType }[] = [
  { label: "简体中文", value: "zh-CN" },
];
