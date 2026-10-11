'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Monitor, MonitorType } from '@/types/monitor';
import { initialProbes, generate90DaysHistory } from '@/lib/data/mock-monitors';
import {
  getStoredMonitors,
  saveStoredMonitors,
  addStoredMonitor,
  deleteStoredMonitor,
} from '@/lib/storage/monitors-storage';
import { AUTH_STORAGE_KEY } from '@/lib/auth/auth-constants';
import { RawButton } from '@/components/ui/raw-button';
import { RawBadge } from '@/components/ui/raw-badge';
import { RawInput } from '@/components/ui/raw-input';
import { UptimeHistoryBar } from '@/components/charts/uptime-history-bar';
import { LatencyWaterfallChart } from '@/components/charts/latency-waterfall-chart';
import { GlobalProbeMap } from '@/components/charts/global-probe-map';
import { ApdexGauge } from '@/components/charts/apdex-gauge';
import { SslCountdownWidget } from '@/components/charts/ssl-countdown-widget';
import { StatusCodeDistribution } from '@/components/charts/status-code-donut';
import { IncidentsLog } from '@/components/monitors/incidents-log';
import { LiveCheckDrawer } from '@/components/monitors/live-check-drawer';
import { NewMonitorModal } from '@/components/monitors/new-monitor-modal';
import { DeleteMonitorModal } from '@/components/monitors/delete-monitor-modal';
import { RefreshCw } from 'lucide-react';
import { LoginView } from '@/components/auth/login-view';

export default function DashboardPage() {
  // 1. AUTHENTICATION STATE
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 2. MONITORS DATA STATE
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [selectedMonitorId, setSelectedMonitorId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // 3. MODALS STATE
  const [isLiveCheckOpen, setIsLiveCheckOpen] = useState(false);
  const [isNewMonitorOpen, setIsNewMonitorOpen] = useState(false);
  const [monitorToDelete, setMonitorToDelete] = useState<Monitor | null>(null);
  const [isCheckingCurrent, setIsCheckingCurrent] = useState(false);

  // Check auth session on client mount
  useEffect(() => {
    async function checkAuthSession() {
      try {
        // Cek cookie session via API
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data.authenticated) {
          setCurrentUser(data.username);
        } else {
          // Fallback cek localStorage
          const localUser = localStorage.getItem(AUTH_STORAGE_KEY);
          if (localUser) {
            setCurrentUser(localUser);
          } else {
            setCurrentUser(null);
          }
        }
      } catch {
        const localUser = localStorage.getItem(AUTH_STORAGE_KEY);
        setCurrentUser(localUser || null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    checkAuthSession();
  }, []);

  // Helper to re-check a specific monitor live
  const checkMonitorLive = async (targetMonitor: Monitor) => {
    if (!targetMonitor.url || !targetMonitor.url.startsWith('http')) return;
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetMonitor.url }),
      });
      const data = await res.json();
      if (res.ok && data && data.isUp !== undefined) {
        setMonitors((prev) => {
          const updated = prev.map((m) =>
            m.id === targetMonitor.id
              ? {
                  ...m,
                  status: (data.isUp ? 'UP' : 'DOWN') as Monitor['status'],
                  httpStatusCode: data.statusCode || m.httpStatusCode,
                  httpStatusText: data.statusText || m.httpStatusText,
                  currentLatencyMs: data.latency?.totalTime || m.currentLatencyMs,
                  waterfall: data.latency || m.waterfall,
                  ssl: data.ssl || m.ssl,
                  lastCheckTimestamp: new Date().toISOString(),
                  resolvedIp: data.resolvedIp || m.resolvedIp,
                  headers: data.headers || m.headers,
                }
              : m
          );
          saveStoredMonitors(updated);
          return updated;
        });
      }
    } catch {
      // Ignore network errors
    }
  };

  // Load persistent monitors from storage & run live check
  useEffect(() => {
    const loaded = getStoredMonitors();
    setMonitors(loaded);
    if (loaded.length > 0) {
      setSelectedMonitorId(loaded[0].id);
      checkMonitorLive(loaded[0]);
    }
  }, []);

  // Periodic live check every 60 seconds
  useEffect(() => {
    if (!selectedMonitorId) return;
    const current = monitors.find((m) => m.id === selectedMonitorId);
    if (!current || current.status === 'PAUSED') return;

    const interval = setInterval(() => {
      checkMonitorLive(current);
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedMonitorId, monitors]);

  // Active selected monitor
  const selectedMonitor = useMemo(() => {
    return monitors.find((m) => m.id === selectedMonitorId) || monitors[0] || null;
  }, [monitors, selectedMonitorId]);

  // Filtered monitors list
  const filteredMonitors = useMemo(() => {
    return monitors.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        filterStatus === 'ALL' || m.status.toUpperCase() === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [monitors, searchQuery, filterStatus]);

  // Overall Global Stats
  const stats = useMemo(() => {
    const total = monitors.length;
    if (total === 0) {
      return { total: 0, upCount: 0, downCount: 0, degradedCount: 0, avgLatency: 0, avgUptime: 100 };
    }
    const upCount = monitors.filter((m) => m.status === 'UP').length;
    const downCount = monitors.filter((m) => m.status === 'DOWN').length;
    const degradedCount = monitors.filter((m) => m.status === 'DEGRADED').length;
    const avgLatency = Math.round(
      monitors.reduce((acc, curr) => acc + (curr.currentLatencyMs || 0), 0) / total
    );
    const avgUptime =
      monitors.reduce((acc, curr) => acc + curr.uptime30d, 0) / total;

    return { total, upCount, downCount, degradedCount, avgLatency, avgUptime };
  }, [monitors]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
  };

  // Handle Add Monitor
  const handleAddMonitor = (newMon: {
    name: string;
    url: string;
    type: MonitorType;
    intervalSeconds: number;
  }) => {
    const id = `mon-${Date.now()}`;
    const created: Monitor = {
      id,
      name: newMon.name,
      url: newMon.url,
      type: newMon.type,
      intervalSeconds: newMon.intervalSeconds,
      status: 'UP',
      httpStatusCode: 200,
      httpStatusText: 'OK',
      currentLatencyMs: 95,
      uptime24h: 100.0,
      uptime7d: 100.0,
      uptime30d: 99.98,
      uptime90d: 99.95,
      apdexScore: 0.99,
      lastCheckTimestamp: new Date().toISOString(),
      waterfall: {
        dnsTime: 12,
        tcpTime: 18,
        tlsTime: 25,
        ttfbTime: 32,
        transferTime: 8,
        totalTime: 95,
      },
      ssl: {
        valid: true,
        issuer: 'Let\'s Encrypt Authority',
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 75,
        tlsVersion: 'TLSv1.3',
        cipherSuite: 'TLS_AES_256_GCM_SHA384',
        subjectAltNames: [newMon.url.replace(/^https?:\/\//, '')],
      },
      probes: initialProbes,
      history90d: generate90DaysHistory(99.98, false),
      incidents: [],
      resolvedIp: '104.21.4.18',
      hostingProvider: 'Cloudflare / Anycast',
    };

    const updated = addStoredMonitor(created);
    setMonitors(updated);
    setSelectedMonitorId(id);
    checkMonitorLive(created);
  };

  // Handle Delete Monitor
  const handleConfirmDelete = (id: string) => {
    const updated = deleteStoredMonitor(id);
    setMonitors(updated);
    setMonitorToDelete(null);

    // Update selected monitor
    if (selectedMonitorId === id) {
      setSelectedMonitorId(updated.length > 0 ? updated[0].id : '');
    }
  };

  // Run Immediate Check on Selected
  const handleImmediateCheck = async () => {
    if (!selectedMonitor) return;
    setIsCheckingCurrent(true);

    try {
      if (selectedMonitor.url.startsWith('http')) {
        const res = await fetch('/api/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: selectedMonitor.url }),
        });
        const data = await res.json();
        if (res.ok) {
          const updated = monitors.map((m) =>
            m.id === selectedMonitor.id
              ? {
                  ...m,
                  status: (data.isUp ? 'UP' : 'DOWN') as Monitor['status'],
                  httpStatusCode: data.statusCode || m.httpStatusCode,
                  httpStatusText: data.statusText || m.httpStatusText,
                  currentLatencyMs: data.latency.totalTime,
                  waterfall: data.latency,
                  ssl: data.ssl || m.ssl,
                  lastCheckTimestamp: new Date().toISOString(),
                  resolvedIp: data.resolvedIp || m.resolvedIp,
                }
              : m
          );
          setMonitors(updated);
          saveStoredMonitors(updated);
        }
      }
    } catch {
      // Ignore network errors
    } finally {
      setIsCheckingCurrent(false);
    }
  };

  // Toggle Pause
  const handleTogglePause = (id: string) => {
    const updated = monitors.map((m) =>
      m.id === id
        ? { ...m, status: (m.status === 'PAUSED' ? 'UP' : 'PAUSED') as Monitor['status'] }
        : m
    );
    setMonitors(updated);
    saveStoredMonitors(updated);
  };

  // IF LOADING AUTH STATE
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="border-[5px] border-black bg-white p-8 flex items-center justify-center">
          <RefreshCw className="w-10 h-10 text-black animate-spin stroke-[2.5]" aria-label="Loading..." />
        </div>
      </div>
    );
  }

  // IF NOT LOGGED IN -> RENDER LOGIN VIEW
  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // IF AUTHENTICATED -> RENDER FULL DASHBOARD
  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 space-y-6">
      {/* 1. TOP HEADER & BRANDING */}
      <header className="border-[5px] border-black bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-black inline-block" />
            <h1 className="font-headline text-2xl md:text-3xl uppercase tracking-widest">
              MONITORING SITE
            </h1>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#666666]">
            <span>REAL-TIME SYNTHETIC UPTIME &amp; API RELIABILITY PLATFORM</span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <RawButton
            variant="secondary"
            onClick={() => setIsLiveCheckOpen(true)}
            className="flex items-center gap-2"
          >
            LIVE URL TESTER
          </RawButton>
          <RawButton
            variant="primary"
            onClick={() => setIsNewMonitorOpen(true)}
            className="flex items-center gap-2"
          >
            ADD MONITOR
          </RawButton>
          <RawButton
            variant="ghost"
            onClick={handleLogout}
            className="text-xs"
          >
            [LOGOUT]
          </RawButton>
        </div>
      </header>

      {/* 2. KPI METRICS OVERVIEW CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="border-[3px] border-black p-4 bg-white">
          <div className="text-[10px] font-mono text-[#666666] uppercase">TOTAL MONITORS</div>
          <div className="font-headline text-3xl mt-1">{stats.total}</div>
          <div className="text-[11px] font-mono text-[#008000] mt-1">PERSISTED ON VERCEL</div>
        </div>

        <div className="border-[3px] border-black p-4 bg-white">
          <div className="text-[10px] font-mono text-[#666666] uppercase">ONLINE / UP</div>
          <div className="font-headline text-3xl mt-1 text-[#008000]">{stats.upCount}</div>
          <div className="text-[11px] font-mono text-[#666666] mt-1">HEALTHY ENDPOINTS</div>
        </div>

        <div className="border-[3px] border-black p-4 bg-white">
          <div className="text-[10px] font-mono text-[#666666] uppercase">ISSUES / DOWN</div>
          <div className={`font-headline text-3xl mt-1 ${stats.downCount > 0 ? 'text-[#FF0000]' : 'text-black'}`}>
            {stats.downCount}
          </div>
          <div className="text-[11px] font-mono text-[#666666] mt-1">
            {stats.degradedCount} DEGRADED
          </div>
        </div>

        <div className="border-[3px] border-black p-4 bg-white">
          <div className="text-[10px] font-mono text-[#666666] uppercase">AVG LATENCY</div>
          <div className="font-headline text-3xl mt-1">{stats.avgLatency} <span className="text-xs font-mono">MS</span></div>
          <div className="text-[11px] font-mono text-[#008000] mt-1">GLOBAL ROUNDTRIP</div>
        </div>

        <div className="border-[3px] border-black p-4 bg-white col-span-2 md:col-span-1">
          <div className="text-[10px] font-mono text-[#666666] uppercase">GLOBAL 30D SLA</div>
          <div className="font-headline text-3xl mt-1 text-[#008000]">
            {stats.avgUptime.toFixed(2)}%
          </div>
          <div className="text-[11px] font-mono text-[#666666] mt-1">TARGET &gt;99.90%</div>
        </div>
      </section>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Monitors Selection List (4 Cols) */}
        <aside className="lg:col-span-4 space-y-3">
          <div className="w-full border-[3px] border-black bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-headline text-xs uppercase tracking-wider">
                MONITORED TARGETS ({filteredMonitors.length})
              </span>
            </div>

            {/* Search Input */}
            <RawInput
              placeholder="Search service name or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Status Filter Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['ALL', 'UP', 'DEGRADED', 'DOWN', 'PAUSED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 border-[2px] transition-none cursor-pointer uppercase ${
                    filterStatus === st
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black hover:bg-[#F0F0F0]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Monitors Scrollable Cards List */}
          <div className="w-full space-y-3 max-h-[680px] overflow-y-auto">
            {filteredMonitors.length === 0 ? (
              <div className="w-full border-[3px] border-black p-6 text-center font-mono text-xs text-[#666666] bg-[#F0F0F0]">
                NO MONITORS FOUND.
              </div>
            ) : (
              filteredMonitors.map((mon) => {
                const isSelected = mon.id === selectedMonitor?.id;
                const statusBadge =
                  mon.status === 'UP'
                    ? 'ACTIVE'
                    : mon.status === 'DEGRADED'
                    ? 'WARNING'
                    : mon.status === 'DOWN'
                    ? 'ERROR'
                    : 'DEFAULT';

                return (
                  <div
                    key={mon.id}
                    onClick={() => setSelectedMonitorId(mon.id)}
                    className={`w-full h-[114px] p-4 border-[3px] flex flex-col justify-between transition-none cursor-pointer select-none relative box-border ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-[#F0F0F0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-headline text-sm uppercase leading-tight truncate">
                          {mon.name}
                        </div>
                        <div
                          className={`text-xs font-mono truncate mt-1 ${
                            isSelected ? 'text-[#CCCCCC]' : 'text-[#666666]'
                          }`}
                        >
                          {mon.url}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <RawBadge status={statusBadge} label={mon.status} className="h-6" />
                        {/* Quick Delete Button */}
                        <button
                          type="button"
                          title="Delete this monitor"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMonitorToDelete(mon);
                          }}
                          className={`w-6 h-6 flex items-center justify-center text-xs border-[2px] font-mono font-bold hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-none cursor-pointer ${
                            isSelected ? 'border-white text-white' : 'border-[#FF0000] text-[#FF0000]'
                          }`}
                        >
                          X
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-current text-xs font-mono">
                      <span>
                        {mon.httpStatusCode > 0 ? `HTTP ${mon.httpStatusCode}` : mon.type}
                      </span>
                      <span className="font-bold">
                        {mon.currentLatencyMs > 0 ? `${mon.currentLatencyMs}ms` : '--'}
                      </span>
                      <span className="font-bold text-[#008000]">
                        {mon.uptime30d.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: Selected Monitor Deep-Dive View (8 Cols) */}
        {selectedMonitor ? (
          <main className="lg:col-span-8 space-y-6">
            {/* Monitor Header Details */}
            <div className="border-[5px] border-black bg-white p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-[3px] border-black pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <RawBadge
                      status={
                        selectedMonitor.status === 'UP'
                          ? 'ACTIVE'
                          : selectedMonitor.status === 'DEGRADED'
                          ? 'WARNING'
                          : selectedMonitor.status === 'DOWN'
                          ? 'ERROR'
                          : 'DEFAULT'
                      }
                      label={selectedMonitor.status}
                    />
                    <h2 className="font-headline text-xl md:text-2xl uppercase">
                      {selectedMonitor.name}
                    </h2>
                  </div>
                  <div className="font-mono text-xs text-[#666666] flex flex-wrap gap-3 items-center">
                    <a
                      href={selectedMonitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0000FF] font-bold underline"
                    >
                      {selectedMonitor.url}
                    </a>
                    <span>|</span>
                    <span>TYPE: {selectedMonitor.type}</span>
                    <span>|</span>
                    <span>INTERVAL: {selectedMonitor.intervalSeconds}s</span>
                    <span>|</span>
                    <span>IP: {selectedMonitor.resolvedIp || 'N/A'}</span>
                  </div>
                </div>

                {/* Immediate Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <RawButton
                    size="sm"
                    variant="secondary"
                    disabled={isCheckingCurrent}
                    onClick={handleImmediateCheck}
                  >
                    {isCheckingCurrent ? 'CHECKING...' : 'RE-CHECK NOW'}
                  </RawButton>
                  <RawButton
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTogglePause(selectedMonitor.id)}
                  >
                    {selectedMonitor.status === 'PAUSED' ? 'RESUME' : 'PAUSE'}
                  </RawButton>
                  <RawButton
                    size="sm"
                    variant="destructive"
                    onClick={() => setMonitorToDelete(selectedMonitor)}
                  >
                    DELETE SERVICE
                  </RawButton>
                </div>
              </div>

              {/* 4 Quick Stat Hero Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#F0F0F0] border-[2px] border-black p-3">
                  <div className="text-[10px] font-mono text-[#666666]">HTTP STATUS</div>
                  <div className="font-headline text-lg mt-0.5">
                    {selectedMonitor.httpStatusCode} {selectedMonitor.httpStatusText}
                  </div>
                </div>

                <div className="bg-[#F0F0F0] border-[2px] border-black p-3">
                  <div className="text-[10px] font-mono text-[#666666]">RESPONSE TIME</div>
                  <div className="font-headline text-lg mt-0.5">
                    {selectedMonitor.currentLatencyMs} <span className="text-xs font-mono">MS</span>
                  </div>
                </div>

                <div className="bg-[#F0F0F0] border-[2px] border-black p-3">
                  <div className="text-[10px] font-mono text-[#666666]">30D UPTIME SLA</div>
                  <div className="font-headline text-lg mt-0.5 text-[#008000]">
                    {selectedMonitor.uptime30d.toFixed(2)}%
                  </div>
                </div>

                <div className="bg-[#F0F0F0] border-[2px] border-black p-3">
                  <div className="text-[10px] font-mono text-[#666666]">SSL DAYS LEFT</div>
                  <div className="font-headline text-lg mt-0.5">
                    {selectedMonitor.ssl.valid ? `${selectedMonitor.ssl.daysRemaining} DAYS` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* 1. 90-Day SLA Timeline */}
            <UptimeHistoryBar
              days={selectedMonitor.history90d}
              uptime90d={selectedMonitor.uptime90d}
              uptime30d={selectedMonitor.uptime30d}
              uptime24h={selectedMonitor.uptime24h}
            />

            {/* 2. Latency Waterfall Chart */}
            <LatencyWaterfallChart waterfall={selectedMonitor.waterfall} />

            {/* 3. Global Probes & Consensus */}
            <GlobalProbeMap probes={selectedMonitor.probes} />

            {/* 4. Side-by-Side: Apdex, SSL, and Status Code Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ApdexGauge score={selectedMonitor.apdexScore} />
              <SslCountdownWidget ssl={selectedMonitor.ssl} />
              <StatusCodeDistribution />
            </div>

            {/* 5. Incidents Log & Reliability History */}
            <IncidentsLog incidents={selectedMonitor.incidents} />

            {/* 6. Technical Inspection & Response Headers */}
            {selectedMonitor.headers && (
              <div className="border-[3px] border-black p-5 bg-white">
                <div className="flex items-center justify-between border-b-[2px] border-black pb-2 mb-3">
                  <h4 className="font-headline text-xs uppercase tracking-wider">
                    CAPTURED RESPONSE HEADERS & SECURITY POSTURE
                  </h4>
                  <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5">
                    LIVE PAYLOAD
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
                  {Object.entries(selectedMonitor.headers).map(([key, val]) => (
                    <div
                      key={key}
                      className="border border-black p-2 bg-[#F0F0F0] flex flex-col justify-center"
                    >
                      <span className="text-[10px] text-[#666666] font-bold uppercase">{key}:</span>
                      <span className="truncate font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        ) : (
          <div className="lg:col-span-8 border-[5px] border-black bg-white p-12 text-center space-y-4">
            <h3 className="font-headline text-xl uppercase">NO ACTIVE MONITORS</h3>
            <p className="font-mono text-xs text-[#666666]">
              Add your first monitored target using the button below.
            </p>
            <RawButton onClick={() => setIsNewMonitorOpen(true)}>
              ADD NEW MONITOR
            </RawButton>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-[3px] border-black bg-white p-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs font-mono text-[#666666]">
        <div>
          ARCHITECTED BY ACHAII — BUILT FOR 99.99% UPTIME & RELIABILITY © 2026
        </div>
        <div>
          <a href="https://github.com/achaii/monitoring-site.git" target="_blank" rel="noopener noreferrer">
            achaii/monitoring-site
          </a>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <LiveCheckDrawer
        isOpen={isLiveCheckOpen}
        onClose={() => setIsLiveCheckOpen(false)}
      />

      <NewMonitorModal
        isOpen={isNewMonitorOpen}
        onClose={() => setIsNewMonitorOpen(false)}
        onAdd={handleAddMonitor}
      />

      <DeleteMonitorModal
        isOpen={!!monitorToDelete}
        monitor={monitorToDelete}
        onClose={() => setMonitorToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
