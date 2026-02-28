// site status
export type SiteType =
  | "loading"
  | "warn"
  | "error"
  | "unknown"
  | "normal"
  | "maintenance";

// UptimeKuma Monitor Type
export type MonitorType =
  | "http"
  | "port"
  | "ping"
  | "keyword"
  | "grpc"
  | "dns"
  | "docker"
  | "real-browser"
  | "steam"
  | "gamedig"
  | "mqtt"
  | "sqlserver"
  | "postgres"
  | "mysql"
  | "mongodb"
  | "radius";

// UptimeKuma Heartbeat
export interface Heartbeat {
  status: 0 | 1 | 2 | 3; // 0-down, 1-up, 2-pending, 3-maintenance
  time: string;
  msg: string;
  ping: number | null;
  duration?: number;
}

// UptimeKuma Monitor
export interface UptimeKumaMonitor {
  id: number;
  name: string;
  type: MonitorType;
  url?: string;
  active?: boolean;
}

// UptimeKuma Public Group
export interface UptimeKumaPublicGroup {
  id: number;
  name: string;
  weight: number;
  monitorList: UptimeKumaMonitor[];
}

// UptimeKuma Incident
export interface UptimeKumaIncident {
  id: number;
  title: string;
  content: string;
  style: "info" | "warning" | "danger" | "primary" | "light" | "dark";
  createdDate: string;
  lastUpdatedDate: string;
  pin: boolean;
}

// UptimeKuma Maintenance Timeslot
export interface MaintenanceTimeslot {
  startDate: string;
  endDate: string;
}

// UptimeKuma Maintenance
export interface UptimeKumaMaintenance {
  id: number;
  title: string;
  description: string;
  strategy: string;
  active: boolean;
  status: "scheduled" | "under-maintenance" | "ended" | "inactive";
  timeslotList: MaintenanceTimeslot[];
}

// UptimeKuma Status Page Config
export interface UptimeKumaStatusPageConfig {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  theme?: string;
  published: boolean;
  showTags?: boolean;
}

// UptimeKuma Status Page Response
export interface UptimeKumaStatusPageResponse {
  config: UptimeKumaStatusPageConfig;
  incident: UptimeKumaIncident | null;
  publicGroupList: UptimeKumaPublicGroup[];
  maintenanceList: UptimeKumaMaintenance[];
}

// UptimeKuma Heartbeat Response
export interface UptimeKumaHeartbeatResponse {
  heartbeatList: Record<string, Heartbeat[]>;
  uptimeList: Record<string, number>; // e.g., "1_24" -> 0.9998
}

// Site Days Status (for display)
export interface SiteDaysStatus {
  date?: number;
  percent: number;
  down: {
    times: number;
    duration: number;
  };
}

// Site Status Type (for display, mapped from UptimeKuma)
export interface SiteStatusType {
  id: number;
  name: string;
  // 0 - down / 1 - up / 2 - pending / 3 - maintenance
  status: 0 | 1 | 2 | 3;
  type: MonitorType;
  interval?: number;
  heartbeats?: Heartbeat[]; // 心跳数据用于显示时间段可用性
  url?: string;
  uptime?: number; // 24h uptime percentage
  ping?: number | null;
}

// Monitors Result
export interface MonitorsDataResult {
  // 总状态
  status: {
    count: number;
    ok: number;
    error: number;
    unknown: number;
    maintenance: number;
  };
  // 状态页配置
  config?: UptimeKumaStatusPageConfig;
  // 事件
  incident?: UptimeKumaIncident | null;
  // 维护列表
  maintenanceList?: UptimeKumaMaintenance[];
  // 监控数据
  data: SiteStatusType[];
  // 更新时间
  timestamp: number;
}

export interface MonitorsResult {
  code: number;
  message: string;
  source: "cache" | "api";
  data: MonitorsDataResult | undefined;
}

// site lang
export type SiteLangType = "zh-CN" | "en";
