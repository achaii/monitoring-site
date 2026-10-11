'use client';

import React, { useState } from 'react';
import { RawButton } from '@/components/ui/raw-button';
import { RawInput } from '@/components/ui/raw-input';
import { MonitorType } from '@/types/monitor';

export function NewMonitorModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (monitor: { name: string; url: string; type: MonitorType; intervalSeconds: number }) => void;
}) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<MonitorType>('HTTP');
  const [interval, setInterval] = useState(60);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    onAdd({
      name: name.trim(),
      url: url.trim(),
      type,
      intervalSeconds: interval,
    });

    setName('');
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg bg-white border-[5px] border-black p-6">
        <div className="flex items-center justify-between border-b-[3px] border-black pb-3 mb-4">
          <h3 className="font-headline text-base uppercase tracking-wider">
            ADD NEW MONITOR
          </h3>
          <button
            onClick={onClose}
            className="font-headline text-lg px-2.5 py-0.5 border-[2px] border-black hover:bg-black hover:text-white transition-none cursor-pointer"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <RawInput
            label="SERVICE / WEBSITE NAME"
            placeholder="e.g. Production Billing API"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <RawInput
            label="TARGET URL / HOST"
            placeholder="https://app.domain.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-xs uppercase tracking-wider text-black mb-1">
                MONITOR TYPE
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MonitorType)}
                className="w-full font-mono text-sm px-3 py-2 text-black bg-[#F0F0F0] border-[3px] border-black focus:border-[5px] focus:outline-none"
              >
                <option value="HTTP">HTTP(S) Website</option>
                <option value="API">REST API Endpoint</option>
                <option value="SSL">SSL-Only Certificate</option>
                <option value="PING">ICMP Ping</option>
                <option value="PORT">TCP Port</option>
              </select>
            </div>

            <div>
              <label className="block font-headline text-xs uppercase tracking-wider text-black mb-1">
                CHECK INTERVAL
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full font-mono text-sm px-3 py-2 text-black bg-[#F0F0F0] border-[3px] border-black focus:border-[5px] focus:outline-none"
              >
                <option value={30}>Every 30 Seconds</option>
                <option value={60}>Every 1 Minute</option>
                <option value={180}>Every 3 Minutes</option>
                <option value={300}>Every 5 Minutes</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t-[2px] border-black flex justify-end gap-3">
            <RawButton type="button" variant="secondary" onClick={onClose}>
              CANCEL
            </RawButton>
            <RawButton type="submit">
              CREATE MONITOR
            </RawButton>
          </div>
        </form>
      </div>
    </div>
  );
}
