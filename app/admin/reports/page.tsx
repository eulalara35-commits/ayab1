// Purpose: View service and driver reports.
'use client';

import { RequireRole } from '@/components/RequireRole';
import { PageHeader } from '@/components/PageHeader';
import { BottomTabs } from '@/components/BottomTabs';
import { useApp } from '@/lib/store';
import { formatPeso } from '@/lib/utils';


function ReportsAdmin() {
  const { bookings, drivers } = useApp();

  const completed = bookings.filter((b) => b.status === 'completed');
  const cancelled = bookings.filter((b) => b.status === 'cancelled');
  const revenue = completed.reduce((sum, b) => sum + b.fare, 0);
  const avgFare = completed.length ? revenue / completed.length : 0;

  const leaderboard = [...drivers]
    .sort((a, b) => b.completedTrips - a.completedTrips)
    .slice(0, 5);

  const statusCounts = ['searching', 'accepted', 'picking_up', 'verified', 'started', 'completed', 'cancelled'].map(
    (status) => ({
      status,
      count: bookings.filter((b) => b.status === status).length,
    }),
  );
  const maxCount = Math.max(1, ...statusCounts.map((s) => s.count));

  return (
    <div className="shell">
      <PageHeader title="Reports" />
      <div className="page-body">
        <div className="grid grid-cols-2 gap-3">
          <div className="panel !mt-0 text-center">
            <p className="font-display text-[20px] font-extrabold text-brand">{formatPeso(revenue)}</p>
            <p className="text-[12px] text-ink/50">Total revenue</p>
          </div>
          <div className="panel !mt-0 text-center">
            <p className="font-display text-[20px] font-extrabold text-brand">{formatPeso(avgFare)}</p>
            <p className="text-[12px] text-ink/50">Average fare</p>
          </div>
          <div className="panel !mt-0 text-center">
            <p className="font-display text-[20px] font-extrabold text-brand">{completed.length}</p>
            <p className="text-[12px] text-ink/50">Completed trips</p>
          </div>
          <div className="panel !mt-0 text-center">
            <p className="font-display text-[20px] font-extrabold text-brand">{cancelled.length}</p>
            <p className="text-[12px] text-ink/50">Cancelled trips</p>
          </div>
        </div>

        <p className="section-label">Bookings by status</p>
        <div className="panel !mt-0">
          {statusCounts.map((s) => (
            <div key={s.status} className="mb-2 last:mb-0">
              <div className="mb-1 flex justify-between text-[12px] text-ink/60">
                <span className="capitalize">{s.status}</span>
                <span>{s.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${(s.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="section-label">Top drivers</p>
        <div className="panel !mt-0 divide-y divide-line">
          {leaderboard.map((d) => (
            <div key={d.id} className="row !border-b-0">
              <span className="text-[14px]">{d.name}</span>
              <span className="ml-auto text-[13px] text-ink/55">{d.completedTrips} trips</span>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs role="admin" />
    </div>
  );
}

export default function Page() {
  return (
    <RequireRole role="admin">
      <ReportsAdmin />
    </RequireRole>
  );
}
