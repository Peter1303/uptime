<template>
  <i class="icon" v-html="svgContent" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  name: string;
}>();

// 动态导入所有 SVG 图标
const icons = import.meta.glob("@/assets/icons/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
});

// 获取图标组件
const svgContent = computed(() => {
  const key = Object.keys(icons).find((k) => k.endsWith(`${props.name}.svg`));
  if (!key) return null;

  return icons[key] as string;
});
</script>

<style scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon :deep(svg) {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
