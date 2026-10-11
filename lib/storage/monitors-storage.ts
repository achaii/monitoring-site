import { Monitor } from '@/types/monitor';
import { initialMonitors } from '@/lib/data/mock-monitors';

const STORAGE_KEY = 'monitoringsite_monitors_v1';
const LEGACY_STORAGE_KEY = 'pulseguard_monitors_v1';

export function getStoredMonitors(): Monitor[] {
  if (typeof window === 'undefined') {
    return initialMonitors;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      // Initialize seed monitors
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMonitors));
      return initialMonitors;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMonitors;
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
