<!-- 站点数据卡片 -->
<template>
  <Transition name="fade" mode="out-in">
    <div v-if="!isEmpty(siteData)" class="site-cards">
      <n-card
        v-for="(site, index) in siteData"
        :key="index"
        :style="{ animationDelay: `${index * 0.1}s` }"
        class="site-item"
        hoverable
      >
        <!-- 信息 -->
        <n-flex class="meta" justify="space-between">
          <n-flex :size="8" class="title" align="center">
            <n-text class="site-name">
              {{ site.name }}
            </n-text>
            <n-popover>
              <template #trigger>
                <n-tag :bordered="false" size="small" round>
                  {{ siteTypeMap[site.type]?.tag || "HTTP" }}
                </n-tag>
              </template>
              <n-text>
                {{ siteTypeMap[site.type]?.text }}
              </n-text>
            </n-popover>
            <!-- 跳转 -->
            <n-button
              v-if="site?.url"
              :focusable="false"
              size="tiny"
              tertiary
              round
              @click="jumpLink(site.url)"
            >
              <template #icon>
                <Icon name="link" />
              </template>
            </n-button>
          </n-flex>
          <n-flex
            :style="{
              '--bg-color': `var(--${siteStatusMap(site)?.type || 'unknown'}-color)`,
            }"
            class="status"
            align="center"
          >
            <div class="point" />
            <n-text>{{ siteStatusMap(site)?.text }}</n-text>
          </n-flex>
        </n-flex>
        <!-- 心跳时间轴 -->
        <n-flex
          v-if="site.heartbeats && site.heartbeats.length > 0"
          :size="2"
          class="timeline"
          justify="space-between"
        >
          <n-popover
            v-for="(heartbeat, hbIndex) in [...site.heartbeats]"
            :key="hbIndex"
          >
            <template #trigger>
              <div
                :style="{
                  backgroundColor: `var(--${getHeartbeatStatus(heartbeat.status)}-color)`,
                }"
                class="day"
              />
            </template>
            <div class="day-data">
              <n-text class="date" depth="3">
                {{ formatHeartbeatTime(heartbeat.time) }}
              </n-text>
              <n-text v-if="heartbeat.status === 1">
                {{ $t("card.percent", { percent: 100 }) }}
              </n-text>
              <n-text v-else-if="heartbeat.status === 0">
                {{ $t("card.status.down") }}
                <template v-if="heartbeat.msg"> - {{ heartbeat.msg }}</template>
              </n-text>
              <n-text v-else-if="heartbeat.status === 2">
                {{ $t("card.status.pending") }}
                <template v-if="heartbeat.msg"> - {{ heartbeat.msg }}</template>
              </n-text>
              <n-text v-else-if="heartbeat.status === 3">
                {{ $t("card.status.maintenance") }}
              </n-text>
              <n-text v-else>{{ $t("card.unknownData") }}</n-text>
            </div>
          </n-popover>
        </n-flex>
        <!-- 总结 -->
        <n-flex class="summary" justify="space-between">
          <n-text class="date" depth="3">
            {{
              site.heartbeats?.length
                ? formatHeartbeatTime(site.heartbeats[0]?.time)
                : "--"
            }}
          </n-text>
          <n-text v-if="site.uptime" depth="3">
            {{ $t("card.summary", { percent: formatUptime(site.uptime) }) }}
          </n-text>
          <n-text v-else depth="3">{{ $t("card.unknownData") }}</n-text>
          <n-text class="date" depth="3">{{ $t("meta.today") }}</n-text>
        </n-flex>
      </n-card>
    </div>
    <div
      v-else
      :style="{ '--color': `var(--${statusStore.siteStatus}-color)` }"
      class="site-cards loading"
    >
      <n-card class="site-item" hoverable>
        <Transition name="fade" mode="out-in">
          <n-spin v-if="statusStore.siteStatus !== 'unknown'" />
          <n-result
            v-else
            status="error"
            :title="$t('card.error')"
            :description="$t('card.errorText')"
          >
            <template #footer>
              <n-button tertiary round @click="refresh">
                {{ $t("meta.refresh") }}
              </n-button>
            </template>
          </n-result>
        </Transition>
      </n-card>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStatusStore } from "@/stores";
import { getSiteData, isEmpty, jumpLink } from "@/utils";
import type { SiteStatusType } from "@/types/main";
import Icon from "./Icon.vue";

const { t } = useI18n();
const statusStore = useStatusStore();

// 站点状态 (UptimeKuma: 0-down, 1-up, 2-pending, 3-maintenance)
const siteStatusMap = (site: SiteStatusType) => {
  if (site.status === 0 || !site.uptime) {
    return {
      text: t("card.status.down"),
      type: "error",
    };
  }
  if (site.uptime) {
    const uptime = site.uptime;
    if (uptime >= 0.8 && uptime < 0.9) {
      return {
        text: t("card.status.slow"),
        type: "warn",
      };
    }
  }
  return {
    text: t("card.status.normal"),
    type: "normal",
  };
};

// 监控类型
const siteTypeMap = computed(() => ({
  http: { tag: "HTTP", text: t("card.type.HTTP") },
  port: { tag: "PORT", text: t("card.type.PORT") },
  ping: { tag: "PING", text: t("card.type.PING") },
  keyword: { tag: "KEYWORD", text: t("card.type.KEYWORD") },
  grpc: { tag: "GRPC", text: "gRPC" },
  dns: { tag: "DNS", text: "DNS" },
  docker: { tag: "DOCKER", text: "Docker" },
  "real-browser": { tag: "BROWSER", text: t("card.type.BROWSER") },
  steam: { tag: "STEAM", text: "Steam" },
  gamedig: { tag: "GAME", text: t("card.type.GAME") },
  mqtt: { tag: "MQTT", text: "MQTT" },
  sqlserver: { tag: "MSSQL", text: "MS SQL" },
  postgres: { tag: "POSTGRES", text: "PostgreSQL" },
  mysql: { tag: "MYSQL", text: "MySQL" },
  mongodb: { tag: "MONGO", text: "MongoDB" },
  radius: { tag: "RADIUS", text: "Radius" },
}));

// 全部站点数据
const siteData = computed<SiteStatusType[] | undefined>(
  () => statusStore.siteData?.data,
);
console.log(siteData.value);

// 格式化可用率
const formatUptime = (uptime?: number): string => {
  if (uptime === undefined || uptime === null) return "--";
  return `${(uptime * 100).toFixed(2)}%`;
};

// 获取心跳状态类型
const getHeartbeatStatus = (
  status: number,
): "normal" | "error" | "unknown" | "warn" => {
  switch (status) {
    case 1:
      return "normal";
    case 0:
      return "error";
    case 2:
      return "warn"; // 卡顿，橙色
    case 3:
      return "warn";
    default:
      return "unknown";
  }
};

// 格式化心跳时间
const formatHeartbeatTime = (time: string): string => {
  if (!time) return "--";
  const date = new Date(time + "Z");
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 重试
const refresh = async () => {
  statusStore.$patch({
    siteStatus: "loading",
    siteData: undefined,
  });
  await getSiteData();
};
</script>

<style lang="scss" scoped>
.site-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 900px;
  margin: 30px auto 20px;
  padding: 0 20px;

  .site-item {
    opacity: 0;
    border-radius: 12px;
    animation: float-up 0.5s forwards;
    overflow: hidden;

    .meta {
      .site-name {
        font-weight: bold;
      }

      .n-tag {
        --n-height: 20px;
        cursor: pointer;
      }

      .status {
        .n-text {
          color: var(--bg-color);
        }
      }

      .point {
        position: relative;
        width: 14px;
        height: 14px;
        min-width: 14px;
        background-color: var(--bg-color);
        border-radius: 50%;

        &::after {
          content: "";
          background-color: var(--bg-color);
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border-radius: 50%;
          opacity: 1;
          z-index: -1;
          animation: breathing 1.5s ease infinite;
          transition: background-color 1s;
        }
      }
    }

    .timeline {
      margin: 15px 0 10px;

      .day {
        height: 26px;
        flex: 1;
        border-radius: 25px;
        background-color: var(--normal-color);
        transition: transform 0.3s;
        transform-origin: bottom;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    .summary {
      .date {
        width: 100px;

        &:last-child {
          text-align: right;
        }
      }

      .n-text {
        font-size: 13px;
      }
    }
  }

  &.loading {
    .site-item {
      min-height: 200px;

      :deep(.n-card__content) {
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .n-spin-body {
      --n-size: 40px;
      --n-color: var(--color);
    }
  }
}

.day-data {
  display: flex;
  flex-direction: column;

  .date {
    font-size: 12px;
  }
}
</style>
