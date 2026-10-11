import { NextRequest, NextResponse } from 'next/server';
import { AUTH_CREDENTIALS, AUTH_COOKIE_NAME } from '@/lib/auth/auth-constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const expectedUser = AUTH_CREDENTIALS.username;
    const expectedPass = AUTH_CREDENTIALS.password;

    if (
      expectedUser &&
      expectedPass &&
      username === expectedUser &&
      password === expectedPass
    ) {
      const response = NextResponse.json({
        success: true,
        user: { username: AUTH_CREDENTIALS.username },
      });

      // Set session cookie (30-day lifetime)
      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: 'authenticated_token_' + Date.now(),
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid username or password.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to process login request.' },
      { status: 500 }
    );
  }
}
