import { NextRequest, NextResponse } from 'next/server';
import {
  getAllMonitorsFromDb,
  saveMonitorToDb,
  deleteMonitorFromDb,
  isDbConfigured,
} from '@/lib/db/neon';
import { Monitor } from '@/types/monitor';

export async function GET() {
  try {
    const monitors = await getAllMonitorsFromDb();
    return NextResponse.json({
      success: true,
      isDbConnected: isDbConfigured(),
      monitors,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const monitor = body as Monitor;

    if (!monitor || !monitor.id || !monitor.url) {
      return NextResponse.json(
        { success: false, error: 'Invalid monitor payload' },
        { status: 400 }
      );
    }

    await saveMonitorToDb(monitor);

    return NextResponse.json({
      success: true,
      isDbConnected: isDbConfigured(),
      monitor,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to save monitor';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Monitor ID is required' },
        { status: 400 }
      );
    }

    await deleteMonitorFromDb(id);

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete monitor';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
