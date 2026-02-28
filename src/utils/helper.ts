import { useStatusStore } from "@/stores";
import type {
  MonitorsDataResult,
  SiteStatusType,
  UptimeKumaHeartbeatResponse,
  UptimeKumaStatusPageResponse,
} from "@/types/main";

/**
 * Jump to a link.
 * @param url The link to jump to.
 */
export const jumpLink = (url: string) => window.open(url, "_blank");

/**
 * Format a number.
 * @param num The number to format.
 * @returns The formatted number.
 */
export const formatNumber = (num: number) => Math.floor(num * 100) / 100;

/**
 * Sleep for a certain amount of time.
 * @param ms The amount of time to sleep in milliseconds.
 */
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if a value is empty.
 * @param value The value to check.
 * @returns True if the value is empty.
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
};

/**
 * Get site data from UptimeKuma API.
 */
export const getSiteData = async () => {
  const statusStore = useStatusStore();
  const { apiConfig } = await import("@/config");

  try {
    statusStore.setSiteStatus("loading");

    const apiUrl = apiConfig.baseUrl;
    // 优先使用 store 中的 slug（来自 URL 参数），否则使用配置文件中的
    const slug = statusStore.slug || apiConfig.slug;

    // 并行获取状态页信息和心跳数据
    const [statusPageRes, heartbeatRes] = await Promise.all([
      fetch(`${apiUrl}/status-page/${slug}`).then((res) =>
        res.json(),
      ) as Promise<UptimeKumaStatusPageResponse>,
      fetch(`${apiUrl}/status-page/heartbeat/${slug}`).then((res) =>
        res.json(),
      ) as Promise<UptimeKumaHeartbeatResponse>,
    ]);

    // 处理监控数据
    const monitorList: SiteStatusType[] = [];
    let okCount = 0;
    let errorCount = 0;
    let unknownCount = 0;
    let maintenanceCount = 0;

    // 遍历所有分组和监控
    for (const group of statusPageRes.publicGroupList || []) {
      for (const monitor of group.monitorList || []) {
        const monitorId = monitor.id.toString();
        const heartbeats = heartbeatRes.heartbeatList[monitorId] || [];
        const latestHeartbeat = heartbeats[0];
        const uptimeKey = `${monitorId}_24`;
        const uptime = heartbeatRes.uptimeList[uptimeKey];

        const siteStatus: SiteStatusType = {
          id: monitor.id,
          name: monitor.name,
          status: latestHeartbeat.status,
          type: monitor.type,
          heartbeats,
          url: monitor.url,
          uptime: uptime,
          ping: latestHeartbeat?.ping,
        };

        // 统计状态
        switch (siteStatus.status) {
          case 1:
            okCount++;
            break;
          case 0:
            errorCount++;
            break;
          case 3:
            maintenanceCount++;
            break;
          default:
            unknownCount++;
        }

        monitorList.push(siteStatus);
      }
    }

    // 检查是否有维护中的服务
    const hasMaintenance = (statusPageRes.maintenanceList || []).some(
      (m) => m.status === "under-maintenance",
    );

    // 构建结果数据
    const result: MonitorsDataResult = {
      status: {
        count: monitorList.length,
        ok: okCount,
        error: errorCount,
        unknown: unknownCount,
        maintenance: maintenanceCount,
      },
      config: statusPageRes.config,
      incident: statusPageRes.incident,
      maintenanceList: statusPageRes.maintenanceList,
      data: monitorList,
      timestamp: Date.now(),
    };

    // 计算整体状态（参考原始项目的逻辑）
    let overallStatus: "normal" | "error" | "warn" | "maintenance";
    const { count, ok } = result.status;

    if (hasMaintenance || maintenanceCount > 0) {
      overallStatus = "maintenance";
    } else if (count === ok) {
      // 所有服务都正常
      overallStatus = "normal";
    } else if (errorCount === count) {
      // 所有服务都错误
      overallStatus = "error";
    } else {
      // 部分服务有问题
      overallStatus = "warn";
    }

    statusStore.$patch({
      siteData: result,
      siteStatus: overallStatus,
    });
  } catch (error) {
    console.error("error to get site data", error);
    statusStore.setSiteStatus("unknown");
    window.$message.error("站点数据获取失败，请重试");
  }
};
