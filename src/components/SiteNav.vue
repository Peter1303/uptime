<!-- 导航栏 -->
<template>
  <nav
    id="nav"
    :class="{ scroll: statusStore.scrollTop > 0 }"
    :style="{ color: iconColor }"
  >
    <div class="nav-content">
      <span class="logo">{{ siteConfig.siteTitle }}</span>
      <n-flex align="center" justify="end">
        <!-- 明暗切换 -->
        <Transition name="fade" mode="out-in">
          <n-button
            :key="themeIcon"
            :focusable="false"
            :color="iconColor"
            size="large"
            quaternary
            circle
            @click="toggleTheme"
          >
            <template #icon>
              <Icon :name="themeIcon" />
            </template>
          </n-button>
        </Transition>
        <!-- 语言 -->
        <n-popselect
          v-model:value="statusStore.siteLang"
          :options="langOptions"
          trigger="click"
        >
          <n-button
            :focusable="false"
            :color="iconColor"
            size="large"
            quaternary
            circle
          >
            <template #icon>
              <Icon name="language" />
            </template>
          </n-button>
        </n-popselect>
        <!-- 菜单 -->
        <n-dropdown trigger="click" :options="navMenu">
          <n-button
            :focusable="false"
            :color="iconColor"
            size="large"
            quaternary
            circle
          >
            <template #icon>
              <Icon name="menu" />
            </template>
          </n-button>
        </n-dropdown>
      </n-flex>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import { type DropdownOption, NIcon, type SelectOption } from "naive-ui";
import { useColorMode } from "@vueuse/core";
import { useStatusStore } from "@/stores";
import { langData, siteConfig } from "@/config";
import Icon from "./Icon.vue";

// 配置 useColorMode
const colorMode = useColorMode({
  attribute: "class",
  initialValue: "auto",
  modes: {
    light: "light-mode",
    dark: "dark-mode",
    auto: "auto",
  },
});
const statusStore = useStatusStore();

// 语言选项
const langOptions = langData.map((item) => ({
  label: item.label,
  value: item.value,
})) as SelectOption[];

// 图标渲染
const renderIcon = (icon: string) => () =>
  h(NIcon, null, () => h(Icon, { name: icon }));

// 导航栏菜单
const navMenu = computed<DropdownOption[]>(() => [
  {
    key: "github",
    label: "GitHub",
    icon: renderIcon("github"),
    props: {
      onClick: () => window.open(import.meta.env.VITE_GITHUB_LINK),
    },
  },
]);

// 模式图标
const themeIcon = computed(() => {
  const mode = useStatusStore().theme;
  // 根据当前模式返回对应图标名称
  if (mode === "dark") {
    return "dark-mode";
  } else if (mode === "light") {
    return "light-mode";
  } else {
    return "system-mode";
  }
});

// 图标颜色
const iconColor = computed<string | undefined>(() =>
  statusStore.scrollTop === 0 ? "#fff" : undefined,
);

// 切换明暗模式
const toggleTheme = () => {
  const themeList = ["auto", "light", "dark"] as const;
  const currentIndex = themeList.indexOf(useStatusStore().theme);
  const nextIndex = (currentIndex + 1) % themeList.length;
  colorMode.value = themeList[nextIndex];
  statusStore.setTheme(themeList[nextIndex]);
};
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition:
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px;
    transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .logo {
    font-size: 20px;
    font-weight: bold;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    @media (max-width: 512px) {
      font-size: 16px;
    }
  }

  &.scroll {
    background-color: var(--main-card-color);
    border-bottom: solid 1px var(--mian-border-color);
    box-shadow: 0px 0px 8px 4px var(--main-box-shadow);

    .nav-content {
      padding: 12px 20px;
    }
  }
}
</style>
