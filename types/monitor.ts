export type MonitorStatus = 'UP' | 'DOWN' | 'DEGRADED' | 'PAUSED';
export type MonitorType = 'HTTP' | 'API' | 'SSL' | 'PING' | 'PORT';

export interface DayUptime {
  date: string;
  uptimePercentage: number;
  status: 'up' | 'down' | 'degraded' | 'paused';
  downtimeMinutes: number;
  incidentsCount: number;
}

export interface LatencyWaterfall {
  dnsTime: number;      // ms
  tcpTime: number;      // ms
  tlsTime: number;      // ms
  ttfbTime: number;     // ms (server processing wait)
  transferTime: number; // ms
  totalTime: number;    // ms
}

export interface SslInfo {
  valid: boolean;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  tlsVersion: string;
  cipherSuite: string;
  subjectAltNames: string[];
  ocspStatus?: string;
}

export interface GlobalProbeNode {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  flag?: string;
  latencyMs: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'UNREACHABLE';
  ip: string;
}

export interface Incident {
  id: string;
  monitorId: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'RESOLVED';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  startedAt: string;
  resolvedAt?: string;
  durationFormatted: string;
  rootCause: string;
  affectedRegions: string[];
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  type: MonitorType;
  intervalSeconds: number;
  status: MonitorStatus;
  httpStatusCode: number;
  httpStatusText: string;
  currentLatencyMs: number;
  uptime24h: number;
  uptime7d: number;
  uptime30d: number;
  uptime90d: number;
  apdexScore: number;
  lastCheckTimestamp: string;
  waterfall: LatencyWaterfall;
  ssl: SslInfo;
  probes: GlobalProbeNode[];
  history90d: DayUptime[];
  incidents: Incident[];
  headers?: Record<string, string>;
  resolvedIp?: string;
  hostingProvider?: string;
}

export interface CheckUrlResult {
  isUp: boolean;
  statusCode: number;
  statusText: string;
  latency: LatencyWaterfall;
  ssl?: SslInfo;
  headers: Record<string, string>;
  resolvedIp: string;
  timestamp: string;
  error?: string;
}
