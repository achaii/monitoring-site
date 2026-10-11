'use client';

import React, { useState } from 'react';
import { RawButton } from '@/components/ui/raw-button';
import { RawInput } from '@/components/ui/raw-input';
import { AUTH_STORAGE_KEY } from '@/lib/auth/auth-constants';

interface LoginViewProps {
  onLoginSuccess: (username: string) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid username or password.');
      }

      // Store in storage for instant client rehydration
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, data.user.username);
      }

      onLoginSuccess(data.user.username);
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md border-[5px] border-black bg-white p-8">
        {/* Brand Header */}
        <div className="border-b-[3px] border-black pb-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3.5 h-3.5 bg-black inline-block" />
            <h1 className="font-headline text-xl uppercase tracking-wider">
              MONITORING SITE
            </h1>
          </div>
          <p className="font-mono text-xs text-[#666666] uppercase">
            REAL-TIME SYNTHETIC UPTIME &amp; API RELIABILITY PLATFORM
          </p>
        </div>

        {error && (
          <div className="border-[3px] border-[#FF0000] bg-white p-3 mb-5 text-[#FF0000] font-mono text-xs">
            <strong>ERROR:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <RawInput
            label="USERNAME"
            placeholder="Enter username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            disabled={loading}
          />

          <RawInput
            label="PASSWORD"
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />

          <div className="pt-2">
            <RawButton
              type="submit"
              disabled={loading}
              className="w-full h-[48px]"
            >
              {loading ? 'VERIFYING CREDENTIALS...' : 'LOGIN TO DASHBOARD'}
            </RawButton>
          </div>
        </form>
      </div>

      <div className="mt-4 font-mono text-xs text-[#666666] uppercase">
        REAL-TIME SYNTHETIC UPTIME &amp; API PERFORMANCE ENGINE
      </div>
    </div>
  );
}
