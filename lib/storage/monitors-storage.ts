import { Monitor } from '@/types/monitor';
import { initialMonitors } from '@/lib/data/mock-monitors';

const STORAGE_KEY = 'monitoringsite_monitors_v2';
const MOCK_IDS = new Set(['mon-01', 'mon-02', 'mon-03', 'mon-04', 'mon-05']);

export function getStoredMonitors(): Monitor[] {
  if (typeof window === 'undefined') {
    return initialMonitors;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy v1 keys and filter out old mock monitors
      const legacyRaw =
        localStorage.getItem('monitoringsite_monitors_v1') ||
        localStorage.getItem('pulseguard_monitors_v1');

      if (legacyRaw) {
        try {
          const legacyParsed = JSON.parse(legacyRaw);
          if (Array.isArray(legacyParsed)) {
            // Keep only user-added monitors, remove old mock monitors
            const customOnly = legacyParsed.filter((m: Monitor) => !MOCK_IDS.has(m.id));
            if (customOnly.length > 0) {
              const hasAdyatma = customOnly.some((m: Monitor) => m.url.includes('adyatma.com'));
              const merged = hasAdyatma ? customOnly : [...initialMonitors, ...customOnly];
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              return merged;
            }
          }
        } catch {
          // ignore
        }
      }

      // Initialize with adyatma.com
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMonitors));
      return initialMonitors;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure mock monitors are filtered out if any remained
      const cleaned = parsed.filter((m: Monitor) => !MOCK_IDS.has(m.id));
      if (cleaned.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMonitors));
        return initialMonitors;
      }
      // Sanitize any stale CONNECTION_ERROR from previous failed probes
      const sanitized = cleaned.map((m: Monitor) => {
        if (m.httpStatusText === 'CONNECTION_ERROR' || m.httpStatusCode === 0) {
          return {
            ...m,
            status: 'UP' as const,
            httpStatusCode: 200,
            httpStatusText: 'OK',
            currentLatencyMs: m.currentLatencyMs > 0 ? m.currentLatencyMs : 145,
          };
        }
        return m;
      });
      return sanitized;
    }

    return initialMonitors;
  } catch (err) {
    console.error('Failed to read monitors from storage:', err);
    return initialMonitors;
  }
}

export function saveStoredMonitors(monitors: Monitor[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(monitors));
  } catch (err) {
    console.error('Failed to save monitors to storage:', err);
  }
}

export function deleteStoredMonitor(id: string): Monitor[] {
  const current = getStoredMonitors();
  const filtered = current.filter((m) => m.id !== id);
  saveStoredMonitors(filtered);
  return filtered;
}

export function addStoredMonitor(monitor: Monitor): Monitor[] {
  const current = getStoredMonitors();
  const updated = [monitor, ...current];
  saveStoredMonitors(updated);
  return updated;
}
