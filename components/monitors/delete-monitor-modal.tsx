'use client';

import React from 'react';
import { RawButton } from '@/components/ui/raw-button';
import { Monitor } from '@/types/monitor';

interface DeleteMonitorModalProps {
  isOpen: boolean;
  monitor: Monitor | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => void;
}

export function DeleteMonitorModal({
  isOpen,
  monitor,
  onClose,
  onConfirmDelete,
}: DeleteMonitorModalProps) {
  if (!isOpen || !monitor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md bg-white border-[5px] border-black p-6 space-y-4">
        {/* Header */}
        <div className="border-b-[3px] border-black pb-3">
          <div className="text-[#FF0000] font-headline text-base uppercase">
            DELETE MONITORED SERVICE
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 text-xs font-mono">
          <p className="font-body text-sm text-black">
            Are you sure you want to permanently delete this service from active monitoring?
          </p>
          <div className="bg-[#F0F0F0] border-[2px] border-black p-3 space-y-1">
            <div>
              <span className="text-[#666666]">SERVICE NAME:</span>{' '}
              <strong>{monitor.name}</strong>
            </div>
            <div className="truncate">
              <span className="text-[#666666]">TARGET URL:</span>{' '}
              <strong>{monitor.url}</strong>
            </div>
          </div>
          <p className="text-[#FF0000] font-bold">
            This action cannot be undone. SLA history and metrics will be permanently removed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t-[2px] border-black flex justify-end gap-3">
          <RawButton type="button" variant="secondary" onClick={onClose}>
            CANCEL
          </RawButton>
          <RawButton
            type="button"
            variant="destructive"
            onClick={() => onConfirmDelete(monitor.id)}
          >
            DELETE PERMANENTLY
          </RawButton>
        </div>
      </div>
    </div>
  );
}
