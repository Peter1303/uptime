<template>
  <footer id="footer">
    <n-flex :size="4" class="text" align="center" vertical>
      <n-p depth="3">
        {{ $t("footer.basedOn") }}
        <n-text depth="3" @click="jumpLink('https://uptimekuma.org')">
          {{ $t("uptimeKuma") }}
        </n-text>
        {{ $t("footer.interface") }}
      </n-p>
      <n-p depth="3">
        Copyright &copy; 2020 - {{ new Date().getFullYear() }}
        <n-text depth="3" @click="jumpLink(linkData.home)"> IMSYY</n-text> |
        Peter1303
        <n-text
          v-if="siteConfig.siteIcp"
          depth="3"
          @click="jumpLink('https://beian.miit.gov.cn/')"
        >
          | {{ siteConfig.siteIcp }}
        </n-text>
      </n-p>
    </n-flex>
  </footer>
</template>

<script setup lang="ts">
import { siteConfig } from "@/config";
import { jumpLink } from "@/utils";

const linkData: Record<string, string> = {
  github: import.meta.env.VITE_GITHUB_LINK,
  home: "https://www.imsyy.top",
  email: "mailto:one@imsyy.top",
};
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 90px;
  margin-top: auto;
  z-index: 100;

  .text {
    .n-p,
    .n-text {
      margin: 0;
      font-size: 13px;
      line-height: 26px;
    }

    .n-text {
      font-weight: bold;
      cursor: pointer;

      &:hover {
        color: var(--normal-color);
      }
    }
  }
}
</style>
