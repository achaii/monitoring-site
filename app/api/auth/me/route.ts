import { NextRequest, NextResponse } from 'next/server';
import { AUTH_CREDENTIALS, AUTH_COOKIE_NAME } from '@/lib/auth/auth-constants';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);

  if (cookie && cookie.value.startsWith('authenticated_token_')) {
    return NextResponse.json({
      authenticated: true,
      username: AUTH_CREDENTIALS.username,
    });
  }

  return NextResponse.json({
    authenticated: false,
  });
}
