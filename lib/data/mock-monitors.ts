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

    // Add periodic degradation on incident days
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

export const mockIncidents: Incident[] = [
  {
    id: 'inc-01',
    monitorId: 'mon-03',
    title: 'Upstream Gateway Timeout (504)',
    severity: 'CRITICAL',
    status: 'OPEN',
    startedAt: '2026-10-11T04:12:00Z',
    durationFormatted: '1h 48m',
    rootCause: 'Database connection pool saturation on cluster eu-central-1',
    affectedRegions: ['Frankfurt', 'N. Virginia'],
  },
  {
    id: 'inc-02',
    monitorId: 'mon-01',
    title: 'Degraded TTFB Latency (>900ms)',
    severity: 'WARNING',
    status: 'RESOLVED',
    startedAt: '2026-10-08T11:20:00Z',
    resolvedAt: '2026-10-08T11:37:00Z',
    durationFormatted: '17m',
    rootCause: 'Cache invalidation stampede post v2.14.0 deployment',
    affectedRegions: ['Tokyo'],
  },
  {
    id: 'inc-03',
    monitorId: 'mon-02',
    title: 'SSL Certificate Renewal Failure',
    severity: 'WARNING',
    status: 'RESOLVED',
    startedAt: '2026-09-24T02:00:00Z',
    resolvedAt: '2026-09-24T03:24:00Z',
    durationFormatted: '1h 24m',
    rootCause: 'ACME HTTP-01 challenge rate limit reached on Let\'s Encrypt',
    affectedRegions: ['Global'],
  },
];

export const initialMonitors: Monitor[] = [
  {
    id: 'mon-01',
    name: 'Production API Gateway',
    url: 'https://api.github.com',
    type: 'API',
    intervalSeconds: 60,
    status: 'UP',
    httpStatusCode: 200,
    httpStatusText: 'OK',
    currentLatencyMs: 142,
    uptime24h: 100.0,
    uptime7d: 99.98,
    uptime30d: 99.95,
    uptime90d: 99.91,
    apdexScore: 0.98,
    lastCheckTimestamp: new Date().toISOString(),
    waterfall: {
      dnsTime: 18,
      tcpTime: 24,
      tlsTime: 36,
      ttfbTime: 52,
      transferTime: 12,
      totalTime: 142,
    },
    ssl: {
      valid: true,
      issuer: 'DigiCert High Assurance TLS Hybrid ECC SHA256 2020 CA1',
      validFrom: '2026-02-14T00:00:00Z',
      validTo: '2027-03-15T23:59:59Z',
      daysRemaining: 155,
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_128_GCM_SHA256',
      subjectAltNames: ['*.github.com', 'github.com'],
      ocspStatus: 'Good (Stapled)',
    },
    probes: [
      { id: 'sin-1', city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '', latencyMs: 24, status: 'OPTIMAL', ip: '140.82.112.4' },
      { id: 'tyo-1', city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '', latencyMs: 68, status: 'OPTIMAL', ip: '140.82.112.4' },
      { id: 'fra-1', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', flag: '', latencyMs: 178, status: 'OPTIMAL', ip: '140.82.112.4' },
      { id: 'iad-1', city: 'N. Virginia', country: 'United States', countryCode: 'US', flag: '', latencyMs: 142, status: 'OPTIMAL', ip: '140.82.112.4' },
      { id: 'syd-1', city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '', latencyMs: 112, status: 'OPTIMAL', ip: '140.82.112.4' },
    ],
    history90d: generate90DaysHistory(99.95, true),
    incidents: [mockIncidents[1]],
    resolvedIp: '140.82.112.4',
    hostingProvider: 'AS36459 GitHub, Inc.',
    headers: {
      'server': 'github.com',
      'content-type': 'application/json; charset=utf-8',
      'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
      'x-frame-options': 'deny',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '0',
    },
  },
  {
    id: 'mon-02',
    name: 'Customer Web Portal',
    url: 'https://cloudflare.com',
    type: 'HTTP',
    intervalSeconds: 30,
    status: 'UP',
    httpStatusCode: 200,
    httpStatusText: 'OK',
    currentLatencyMs: 88,
    uptime24h: 100.0,
    uptime7d: 100.0,
    uptime30d: 99.99,
    uptime90d: 99.98,
    apdexScore: 0.99,
    lastCheckTimestamp: new Date().toISOString(),
    waterfall: {
      dnsTime: 12,
      tcpTime: 16,
      tlsTime: 22,
      ttfbTime: 28,
      transferTime: 10,
      totalTime: 88,
    },
    ssl: {
      valid: true,
      issuer: 'Cloudflare Inc ECC CA-3',
      validFrom: '2026-06-01T00:00:00Z',
      validTo: '2026-11-20T23:59:59Z',
      daysRemaining: 40,
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      subjectAltNames: ['cloudflare.com', '*.cloudflare.com'],
      ocspStatus: 'Good (Stapled)',
    },
    probes: [
      { id: 'sin-1', city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '', latencyMs: 14, status: 'OPTIMAL', ip: '104.16.132.229' },
      { id: 'tyo-1', city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '', latencyMs: 42, status: 'OPTIMAL', ip: '104.16.132.229' },
      { id: 'fra-1', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', flag: '', latencyMs: 122, status: 'OPTIMAL', ip: '104.16.132.229' },
      { id: 'iad-1', city: 'N. Virginia', country: 'United States', countryCode: 'US', flag: '', latencyMs: 88, status: 'OPTIMAL', ip: '104.16.132.229' },
      { id: 'syd-1', city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '', latencyMs: 64, status: 'OPTIMAL', ip: '104.16.132.229' },
    ],
    history90d: generate90DaysHistory(99.98, false),
    incidents: [mockIncidents[2]],
    resolvedIp: '104.16.132.229',
    hostingProvider: 'AS13335 Cloudflare, Inc.',
    headers: {
      'server': 'cloudflare',
      'content-type': 'text/html; charset=UTF-8',
      'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
      'cf-ray': '87c2b3d18e9a-SIN',
    },
  },
  {
    id: 'mon-03',
    name: 'Payment Processing Microservice',
    url: 'https://payment-svc.internal-proxy.net',
    type: 'API',
    intervalSeconds: 30,
    status: 'DOWN',
    httpStatusCode: 504,
    httpStatusText: 'Gateway Timeout',
    currentLatencyMs: 5012,
    uptime24h: 92.4,
    uptime7d: 97.2,
    uptime30d: 98.4,
    uptime90d: 98.1,
    apdexScore: 0.42,
    lastCheckTimestamp: new Date().toISOString(),
    waterfall: {
      dnsTime: 14,
      tcpTime: 28,
      tlsTime: 44,
      ttfbTime: 4920,
      transferTime: 6,
      totalTime: 5012,
    },
    ssl: {
      valid: true,
      issuer: 'Let\'s Encrypt Authority X3',
      validFrom: '2026-08-01T00:00:00Z',
      validTo: '2026-11-01T23:59:59Z',
      daysRemaining: 21,
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      subjectAltNames: ['payment-svc.internal-proxy.net'],
    },
    probes: [
      { id: 'sin-1', city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '', latencyMs: 5010, status: 'UNREACHABLE', ip: '52.77.210.12' },
      { id: 'tyo-1', city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '', latencyMs: 5014, status: 'UNREACHABLE', ip: '52.77.210.12' },
      { id: 'fra-1', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', flag: '', latencyMs: 5008, status: 'UNREACHABLE', ip: '52.77.210.12' },
      { id: 'iad-1', city: 'N. Virginia', country: 'United States', countryCode: 'US', flag: '', latencyMs: 5012, status: 'UNREACHABLE', ip: '52.77.210.12' },
      { id: 'syd-1', city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '', latencyMs: 5011, status: 'UNREACHABLE', ip: '52.77.210.12' },
    ],
    history90d: generate90DaysHistory(98.1, true),
    incidents: [mockIncidents[0]],
    resolvedIp: '52.77.210.12',
    hostingProvider: 'AS16509 Amazon.com, Inc.',
    headers: {
      'server': 'nginx/1.24.0',
      'content-type': 'text/html',
      'connection': 'close',
    },
  },
  {
    id: 'mon-04',
    name: 'Auth & SSO Identity Provider',
    url: 'https://auth0.com',
    type: 'API',
    intervalSeconds: 60,
    status: 'DEGRADED',
    httpStatusCode: 200,
    httpStatusText: 'OK (High Latency)',
    currentLatencyMs: 640,
    uptime24h: 99.2,
    uptime7d: 99.4,
    uptime30d: 99.7,
    uptime90d: 99.8,
    apdexScore: 0.76,
    lastCheckTimestamp: new Date().toISOString(),
    waterfall: {
      dnsTime: 42,
      tcpTime: 68,
      tlsTime: 95,
      ttfbTime: 410,
      transferTime: 25,
      totalTime: 640,
    },
    ssl: {
      valid: true,
      issuer: 'Amazon RSA 2048 M02',
      validFrom: '2026-05-10T00:00:00Z',
      validTo: '2027-06-09T23:59:59Z',
      daysRemaining: 241,
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_128_GCM_SHA256',
      subjectAltNames: ['auth0.com', '*.auth0.com'],
    },
    probes: [
      { id: 'sin-1', city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '', latencyMs: 140, status: 'OPTIMAL', ip: '54.215.118.2' },
      { id: 'tyo-1', city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '', latencyMs: 210, status: 'OPTIMAL', ip: '54.215.118.2' },
      { id: 'fra-1', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', flag: '', latencyMs: 820, status: 'DEGRADED', ip: '54.215.118.2' },
      { id: 'iad-1', city: 'N. Virginia', country: 'United States', countryCode: 'US', flag: '', latencyMs: 640, status: 'DEGRADED', ip: '54.215.118.2' },
      { id: 'syd-1', city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '', latencyMs: 310, status: 'OPTIMAL', ip: '54.215.118.2' },
    ],
    history90d: generate90DaysHistory(99.6, true),
    incidents: [],
    resolvedIp: '54.215.118.2',
    hostingProvider: 'AS16509 Amazon.com, Inc.',
    headers: {
      'server': 'cloudflare',
      'content-type': 'application/json',
      'strict-transport-security': 'max-age=31536000',
    },
  },
  {
    id: 'mon-05',
    name: 'Primary PostgreSQL Node (Port 5432)',
    url: 'tcp://db-cluster-primary.internal:5432',
    type: 'PORT',
    intervalSeconds: 60,
    status: 'PAUSED',
    httpStatusCode: 0,
    httpStatusText: 'PAUSED',
    currentLatencyMs: 0,
    uptime24h: 100.0,
    uptime7d: 100.0,
    uptime30d: 99.99,
    uptime90d: 99.95,
    apdexScore: 1.0,
    lastCheckTimestamp: new Date().toISOString(),
    waterfall: { dnsTime: 0, tcpTime: 0, tlsTime: 0, ttfbTime: 0, transferTime: 0, totalTime: 0 },
    ssl: {
      valid: false,
      issuer: 'N/A',
      validFrom: '',
      validTo: '',
      daysRemaining: 0,
      tlsVersion: 'N/A',
      cipherSuite: 'N/A',
      subjectAltNames: [],
    },
    probes: initialProbes.map((p) => ({ ...p, status: 'OPTIMAL' })),
    history90d: generate90DaysHistory(99.95, false),
    incidents: [],
    resolvedIp: '10.0.12.84',
    hostingProvider: 'Internal VPC',
  },
];
