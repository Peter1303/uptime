import { defineStore } from "pinia";
import type { MonitorsDataResult, SiteLangType, SiteType } from "@/types/main";

export const useStatusStore = defineStore(
  "status",
  () => {
    // 站点状态
    const siteStatus = ref<SiteType>("loading");
    // 站点数据
    const siteData = ref<MonitorsDataResult>();
    // 滚动高度
    const scrollTop = ref<number>(0);
    // 站点语言
    const siteLang = ref<SiteLangType>("zh-CN");
    // 状态页 slug
    const slug = ref<string>("");
    // 主题状态
    const theme = ref<"auto" | "light" | "dark">("auto");

    // 设置滚动高度
    const setScrollTop = (value: number) => {
      scrollTop.value = value;
    };

    // 设置站点状态
    const setSiteStatus = (value: SiteType) => {
      siteStatus.value = value;
    };

    // 设置 slug
    const setSlug = (value: string) => {
      slug.value = value;
    };

    // 设置主题
    const setTheme = (value: "auto" | "light" | "dark") => {
      theme.value = value;
    };

    return {
      siteStatus,
      siteData,
      scrollTop,
      siteLang,
      slug,
      theme,
      setScrollTop,
      setSiteStatus,
      setSlug,
      setTheme,
    };
  },
  {
    persist: {
      pick: ["siteLang"],
    },
  },
);
