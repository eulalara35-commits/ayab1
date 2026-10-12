// Purpose: Review and manage ride bookings.
'use client';

import { useState } from 'react';
import { RequireRole } from '@/components/RequireRole';
import { PageHeader } from '@/components/PageHeader';
import { BottomTabs } from '@/components/BottomTabs';
import { useApp } from '@/lib/store';
import { formatDate, formatPeso } from '@/lib/utils';
import type { BookingStatus } from '@/lib/types';

const FILTERS: { key: BookingStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'searching', label: 'Searching' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'picking_up', label: 'Picking up' },
  { key: 'started', label: 'On trip' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];


function statusBadgeClass(status: BookingStatus) {
  if (status === 'completed') return 'badge-success';
  if (status === 'cancelled') return 'badge-danger';
  if (status === 'searching') return 'badge-warning';
  return 'badge-brand';
}


function BookingsAdmin() {
  const { bookings, drivers } = useApp();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const filtered = bookings
    .filter((b) => filter === 'all' || b.status === filter)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div className="shell">
      <PageHeader title="Bookings" />
      <div className="page-body">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`btn-sm btn-auto shrink-0 rounded-full border ${
                filter === f.key ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="font-semibold text-ink">No bookings in this filter</p>
          </div>
        ) : (
          filtered.map((b) => {
            const driver = drivers.find((d) => d.id === b.driverId);
            return (
              <div key={b.id} className="panel">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold">
                      {b.pickup.name} → {b.destination.name}
                    </p>
                    <p className="text-[12px] text-ink/50">{formatDate(b.createdAt)}</p>
                  </div>
                  <span className={statusBadgeClass(b.status)}>{b.status}</span>
                </div>
                <div className="row">
                  <span className="text-[13px] text-ink/60">
                    {b.passengerName} · {driver?.name ?? 'Unassigned'}
                  </span>
                  <span className="ml-auto font-semibold text-brand">{formatPeso(b.fare)}</span>
                </div>
                <p className="mt-1 data-chip">{b.id}</p>
              </div>
            );
          })
        )}
      </div>
      <BottomTabs role="admin" />
    </div>
  );
}

export default function Page() {
  return (
    <RequireRole role="admin">
      <BookingsAdmin />
    </RequireRole>
  );
}
