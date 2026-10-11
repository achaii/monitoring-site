import { Monitor } from '@/types/monitor';

export async function fetchMonitors(): Promise<{ monitors: Monitor[]; isDbConnected: boolean }> {
  try {
    const res = await fetch('/api/monitors', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch monitors from server');
    const data = await res.json();
    return {
      monitors: Array.isArray(data.monitors) ? data.monitors : [],
      isDbConnected: Boolean(data.isDbConnected),
    };
  } catch (err) {
    console.error('Error in fetchMonitors client helper:', err);
    return { monitors: [], isDbConnected: false };
  }
}

export async function saveMonitor(monitor: Monitor): Promise<boolean> {
  try {
    const res = await fetch('/api/monitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(monitor),
    });
    return res.ok;
  } catch (err) {
    console.error(`Error saving monitor ${monitor.id}:`, err);
    return false;
  }
}

export async function deleteMonitor(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/monitors?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error(`Error deleting monitor ${id}:`, err);
    return false;
  }
}
