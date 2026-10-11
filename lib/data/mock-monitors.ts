import { Monitor, DayUptime, GlobalProbeNode, Incident } from '@/types/monitor';

// 90-day uptime history generator
export function generate90DaysHistory(
  baseUptime = 99.9,
  hasIncidents = false
): DayUptime[] {
  const history: DayUptime[] = [];
  const now = new Date();

  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    let status: 'up' | 'down' | 'degraded' | 'paused' = 'up';
    let uptimePercentage = 100;
    let downtimeMinutes = 0;
    let incidentsCount = 0;

    if (hasIncidents && (i === 12 || i === 47)) {
      status = 'down';
      uptimePercentage = 94.2;
      downtimeMinutes = 84;
      incidentsCount = 1;
    } else if (hasIncidents && (i === 3 || i === 29 || i === 70)) {
      status = 'degraded';
      uptimePercentage = 98.8;
      downtimeMinutes = 17;
      incidentsCount = 1;
    }

    history.push({
      date: dateStr,
      uptimePercentage: Number(uptimePercentage.toFixed(2)),
      status,
      downtimeMinutes,
      incidentsCount,
    });
  }

  return history;
}

export const initialProbes: GlobalProbeNode[] = [
  { id: 'sin-1', city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '', latencyMs: 28, status: 'OPTIMAL', ip: '139.180.133.42' },
  { id: 'tyo-1', city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '', latencyMs: 74, status: 'OPTIMAL', ip: '108.61.201.11' },
  { id: 'fra-1', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', flag: '', latencyMs: 168, status: 'OPTIMAL', ip: '194.195.241.9' },
  { id: 'iad-1', city: 'N. Virginia', country: 'United States', countryCode: 'US', flag: '', latencyMs: 215, status: 'OPTIMAL', ip: '143.198.160.2' },
  { id: 'syd-1', city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '', latencyMs: 104, status: 'OPTIMAL', ip: '45.76.115.88' },
];

export const mockIncidents: Incident[] = [];

export const initialMonitors: Monitor[] = [
  {
    id: 'mon-adyatma',
    name: 'ADYATMA',
    url: 'https://adyatma.com',
    type: 'HTTP',
    intervalSeconds: 60,
    status: 'UP',
    httpStatusCode: 200,
    httpStatusText: 'OK',
    currentLatencyMs: 145,
    uptime24h: 100.0,
    uptime7d: 100.0,
    uptime30d: 99.98,
    uptime90d: 99.95,
    apdexScore: 1.0,
    lastCheckTimestamp: new Date().toISOString(),
    waterfall: {
      dnsTime: 38,
      tcpTime: 32,
      tlsTime: 39,
      ttfbTime: 36,
      transferTime: 0,
      totalTime: 145,
    },
    ssl: {
      valid: true,
      issuer: "Let's Encrypt",
      validFrom: '2026-09-09T00:10:25.000Z',
      validTo: '2026-12-08T00:10:24.000Z',
      daysRemaining: 57,
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      subjectAltNames: ['adyatma.com', 'www.adyatma.com'],
      ocspStatus: 'Good (Stapled)',
    },
    probes: [
      { id: 'sin-1', city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '', latencyMs: 28, status: 'OPTIMAL', ip: '192.250.235.40' },
      { id: 'tyo-1', city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '', latencyMs: 74, status: 'OPTIMAL', ip: '192.250.235.40' },
      { id: 'fra-1', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', flag: '', latencyMs: 168, status: 'OPTIMAL', ip: '192.250.235.40' },
      { id: 'iad-1', city: 'N. Virginia', country: 'United States', countryCode: 'US', flag: '', latencyMs: 215, status: 'OPTIMAL', ip: '192.250.235.40' },
      { id: 'syd-1', city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '', latencyMs: 104, status: 'OPTIMAL', ip: '192.250.235.40' },
    ],
    history90d: generate90DaysHistory(99.98, false),
    incidents: [],
    resolvedIp: '192.250.235.40',
    hostingProvider: 'OpenResty Server',
    headers: {
      'server': 'openresty/1.31.1.1',
      'content-type': 'text/html',
      'connection': 'keep-alive',
      'cache-control': 'private, no-cache, no-store, must-revalidate, max-age=0',
    },
  },
];
