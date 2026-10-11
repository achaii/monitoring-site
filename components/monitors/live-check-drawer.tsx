'use client';

import React, { useState } from 'react';
import { RawButton } from '@/components/ui/raw-button';
import { RawInput } from '@/components/ui/raw-input';
import { RawBadge } from '@/components/ui/raw-badge';
import { LatencyWaterfallChart } from '@/components/charts/latency-waterfall-chart';
import { SslCountdownWidget } from '@/components/charts/ssl-countdown-widget';
import { CheckUrlResult } from '@/types/monitor';

export function LiveCheckDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [url, setUrl] = useState('https://github.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckUrlResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRunCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Endpoint probe execution failed');
      }

      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred while probing endpoint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-4xl bg-white border-[5px] border-black p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-[3px] border-black pb-3 mb-4">
          <div>
            <h3 className="font-headline text-lg uppercase tracking-wider">
              LIVE SYNTHETIC PROBE TESTER
            </h3>
            <p className="text-xs font-mono text-[#666666]">
              Execute live synthetic inspection on any public endpoint in real time
            </p>
          </div>
          <button
            onClick={onClose}
            className="font-headline text-xl px-3 py-1 border-[2px] border-black hover:bg-black hover:text-white transition-none cursor-pointer"
          >
            X
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleRunCheck} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <RawInput
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              label="TARGET WEBSITE / API ENDPOINT"
            />
          </div>
          <div className="sm:self-end">
            <RawButton
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full sm:w-auto h-[46px]"
            >
              {loading ? 'PROBING SOCKET...' : 'RUN LIVE CHECK'}
            </RawButton>
          </div>
        </form>

        {errorMsg && (
          <div className="border-[3px] border-[#FF0000] bg-white p-4 mb-4 text-[#FF0000] font-mono text-xs">
            <strong>ERROR:</strong> {errorMsg}
          </div>
        )}

        {loading && (
          <div className="border-[3px] border-black bg-[#F0F0F0] p-8 text-center font-mono space-y-2">
            <div className="font-headline text-base animate-pulse">
              [ESTABLISHING TCP SOCKET & EXTRACTING TIMINGS...]
            </div>
            <p className="text-xs text-[#666666]">
              Measuring DNS lookup, TLS handshake, TTFB server processing, and SSL certificate...
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Top Bar Status */}
            <div className="border-[3px] border-black p-4 bg-[#F0F0F0] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <RawBadge
                  status={result.isUp ? 'ACTIVE' : 'ERROR'}
                  label={result.isUp ? 'ONLINE / UP' : 'OFFLINE / DOWN'}
                />
                <span className="font-headline text-lg">
                  HTTP {result.statusCode} ({result.statusText})
                </span>
              </div>
              <div className="text-xs font-mono">
                RESOLVED IP: <strong>{result.resolvedIp}</strong> | LATENCY:{' '}
                <strong className="text-base font-bold">{result.latency.totalTime}ms</strong>
              </div>
            </div>

            {/* Waterfall Chart Result */}
            <LatencyWaterfallChart waterfall={result.latency} />

            {/* SSL Widget if available */}
            {result.ssl && <SslCountdownWidget ssl={result.ssl} />}

            {/* Raw Headers Preview */}
            <div className="border-[3px] border-black p-4 bg-white">
              <h5 className="font-headline text-xs uppercase mb-2">
                RESPONSE HEADERS ({Object.keys(result.headers).length})
              </h5>
              <div className="bg-[#F0F0F0] border border-black p-3 font-mono text-[11px] max-h-36 overflow-y-auto space-y-1">
                {Object.entries(result.headers).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-[#666666] font-bold">{k}:</span>
                    <span className="truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
