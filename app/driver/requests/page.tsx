// Purpose: Review and accept ride requests.
'use client';

import { useRouter } from 'next/navigation';
import { RequireRole } from '@/components/RequireRole';
import { PageHeader } from '@/components/PageHeader';
import { BottomTabs } from '@/components/BottomTabs';
import { useApp } from '@/lib/store';
import { formatPeso } from '@/lib/utils';


function Requests() {
  const { currentUser, drivers, bookings, acceptBooking, declineBooking, createDemoBooking } = useApp();
  const router = useRouter();
  const driver = drivers.find((d) => d.id === currentUser?.id);
  const requests = bookings.filter((b) => b.status === 'searching');
  const hasActiveTrip = bookings.some(
    (b) => b.driverId === currentUser?.id && ['accepted', 'picking_up', 'verified', 'confirmed', 'started'].includes(b.status),
  );

  function accept(bookingId: string) {
    if (!currentUser) return;
    acceptBooking(bookingId, currentUser.id);
    router.push(`/driver/trip?bookingId=${encodeURIComponent(bookingId)}`);
  }

  return (
    <div className="shell">
      <PageHeader title="Ride requests" />
      <div className="page-body">
        {!driver?.online && (
          <div className="panel !mt-0 bg-warning/10 text-[13px] text-warning">
            You&apos;re offline. Go online from your home tab to accept requests.
          </div>
        )}
        {hasActiveTrip && (
          <div className="panel !mt-0 bg-brand/5 text-[13px] text-brand">
            Finish your current trip before accepting another one. You can still decline requests.
          </div>
        )}
        <div className="panel">
          <p className="text-[13px] text-ink/60">Want to try the driver request flow?</p>
          <button type="button" onClick={createDemoBooking} className="btn-outline mt-3 w-full">
            Create demo ride request
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="empty-state">
            <p className="font-semibold text-ink">No requests right now</p>
            <p className="text-[13px]">New commuter bookings will show up here.</p>
          </div>
        ) : (
          requests.map((r) => {
            const timer = Math.max(0, Math.ceil((new Date(r.driverResponseDeadline ?? Date.now()).getTime() - Date.now()) / 1000));
            return (
              <div key={r.id} className="panel">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-semibold">
                    {r.pickup.name} → {r.destination.name}
                  </p>
                  <span className="rounded-full bg-brand/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                    {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
                  </span>
                </div>
                <div className="row">
                  <span className="text-[13px] text-ink/60">{r.passengerName}</span>
                  <span className="ml-auto text-[13px] text-ink/60">{r.distance.toFixed(1)} km</span>
                </div>
                <div className="row">
                  <span className="text-[13px] text-ink/60">Passengers</span>
                  <span className="ml-auto text-[13px] text-ink/60">{r.passengerCount}</span>
                </div>
                <div className="row">
                  <span className="text-[13px] text-ink/60">{r.specialRide ? 'Special ride offer' : 'Fare'}</span>
                  <span className="ml-auto font-display text-[16px] font-bold text-brand">
                    {formatPeso(r.fare)}
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => declineBooking(r.id)}
                    disabled={!driver?.online}
                    className="btn-outline flex-1"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => accept(r.id)}
                    disabled={!driver?.online || hasActiveTrip}
                    className="btn-primary flex-1"
                  >
                    Accept request
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <BottomTabs role="driver" />
    </div>
  );
}


export default function Page() {
  return (
    <RequireRole role="driver">
      <Requests />
    </RequireRole>
  );
}
