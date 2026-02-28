<template>
  <GlobalProvider>
    <n-scrollbar
      :content-style="{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }"
      style="height: 100vh"
      @scroll="siteScroll"
    >
      <SiteNav />
      <SiteHeader />
      <!-- 主内容 -->
      <main v-if="siteLoaded" id="main">
        <SiteCards />
      </main>
      <SiteFooter />
      <!-- 回到顶部 -->
      <n-back-top :visibility-height="10" />
    </n-scrollbar>
  </GlobalProvider>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useStatusStore } from "@/stores";
import { siteConfig } from "@/config";
import { getSiteData } from "@/utils";

const route = useRoute();
const statusStore = useStatusStore();

const { locale } = useI18n();

// 加载状态
const siteLoaded = ref<boolean>(false);

// 初始化站点
const checkSite = async () => {
  try {
    // 从 URL query 参数获取 slug
    const slugParam = route.query.s as string;
    if (slugParam) {
      statusStore.setSlug(slugParam);
    }
    // 加载数据
    await getSiteData();
  } catch (error) {
    console.error("error in checkSite", error);
  } finally {
    siteLoaded.value = true;
  }
};

// 页面滚动
const siteScroll = (e: Event) => {
  // 滚动高度
  const scrollTop = (e.target as HTMLElement).scrollTop;
  statusStore.setScrollTop(scrollTop);
};

// 更改站点语言
const setSiteLang = (lang: string) => {
  locale.value = lang;
  document.documentElement.lang = lang;
  localStorage.setItem("i18n_redirected", lang);
};

// 更新页面标题
const updateTitle = (title: string) => {
  document.title = title;
};

// 更新图标
const updateFavicon = (href: string) => {
  const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
  if (link) link.href = href;
};

// 监听站点状态
watch(
  () => statusStore.siteStatus,
  (status: string) => {
    const { siteTitle } = siteConfig;
    // 错误数据
    const isError = status === "error" || status === "warn";
    const error = statusStore.siteData?.status?.error || 0;
    const unknown = statusStore.siteData?.status?.unknown || 0;
    // 更改标题
    updateTitle(isError ? `( ${error + unknown} ) ` + siteTitle : siteTitle);
    // 更改图标
    updateFavicon(isError ? "/favicon-error.ico" : "/favicon.ico");
  },
);

// 语言更改
watch(() => statusStore.siteLang, setSiteLang);

onBeforeMount(checkSite);

onMounted(() => {
  setSiteLang(statusStore.siteLang);
});
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
