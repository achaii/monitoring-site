import { neon } from '@neondatabase/serverless';
import { Monitor } from '@/types/monitor';
import { initialMonitors } from '@/lib/data/mock-monitors';

function getDatabaseUrl(): string | null {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    null
  );
}

export function isDbConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

export function getSql() {
  const url = getDatabaseUrl();
  if (!url) {
    return null;
  }
  return neon(url);
}

let tableInitialized = false;

export async function ensureMonitorsTable() {
  const sql = getSql();
  if (!sql) return;

  if (tableInitialized) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS monitors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        type TEXT NOT NULL,
        interval_seconds INTEGER NOT NULL,
        status TEXT NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    tableInitialized = true;
  } catch (err) {
    console.error('Failed to initialize monitors table in Neon:', err);
  }
}

export async function getAllMonitorsFromDb(): Promise<Monitor[]> {
  const sql = getSql();
  if (!sql) {
    return initialMonitors;
  }

  await ensureMonitorsTable();

  try {
    const rows = await sql`
      SELECT data FROM monitors ORDER BY updated_at DESC;
    `;

    if (!rows || rows.length === 0) {
      // Seed initial monitors so the user has the default starting monitor
      for (const mon of initialMonitors) {
        await saveMonitorToDb(mon);
      }
      return initialMonitors;
    }

    return rows.map((r) => {
      const parsed = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
      return parsed as Monitor;
    });
  } catch (err) {
    console.error('Failed to fetch monitors from Neon database:', err);
    return initialMonitors;
  }
}

export async function saveMonitorToDb(monitor: Monitor): Promise<void> {
  const sql = getSql();
  if (!sql) return;

  await ensureMonitorsTable();

  try {
    const jsonStr = JSON.stringify(monitor);
    await sql`
      INSERT INTO monitors (id, name, url, type, interval_seconds, status, data, updated_at)
      VALUES (
        ${monitor.id},
        ${monitor.name},
        ${monitor.url},
        ${monitor.type},
        ${monitor.intervalSeconds},
        ${monitor.status},
        ${jsonStr}::jsonb,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        url = EXCLUDED.url,
        type = EXCLUDED.type,
        interval_seconds = EXCLUDED.interval_seconds,
        status = EXCLUDED.status,
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP;
    `;
  } catch (err) {
    console.error(`Failed to save monitor ${monitor.id} to Neon:`, err);
    throw err;
  }
}

export async function deleteMonitorFromDb(id: string): Promise<void> {
  const sql = getSql();
  if (!sql) return;

  await ensureMonitorsTable();

  try {
    await sql`DELETE FROM monitors WHERE id = ${id};`;
  } catch (err) {
    console.error(`Failed to delete monitor ${id} from Neon:`, err);
    throw err;
  }
}
