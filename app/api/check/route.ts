import { NextRequest, NextResponse } from 'next/server';
import { checkWebsiteLive } from '@/lib/services/synthetic-checker';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL parameter is required.' },
        { status: 400 }
      );
    }

    // Format URL if protocol is omitted
    let target = url.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
    }

    const result = await checkWebsiteLive(target);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to inspect URL target.' },
      { status: 500 }
    );
  }
}
