// Purpose: Show driver status, requests, and earnings.
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RequireRole } from '@/components/RequireRole';
import { PageHeader } from '@/components/PageHeader';
import { BottomTabs } from '@/components/BottomTabs';
import { MapPinIcon, StarIcon } from '@/components/Icons';
import { useApp } from '@/lib/store';
import { formatPeso } from '@/lib/utils';
import type { Booking } from '@/lib/types';

type MatchingMode = 'auto' | 'manual';


function DriverHome() {
  const { currentUser, drivers, bookings, toggleDriverOnline, acceptBooking, declineBooking } = useApp();
  const router = useRouter();
  const [matchingMode, setMatchingMode] = useState<MatchingMode>('manual');
  const [matchingReady, setMatchingReady] = useState(false);
  const driver = drivers.find((d) => d.id === currentUser?.id);
  const nearbyRequests = bookings.filter((b) => b.status === 'searching');
  const latestDriverBooking = bookings
    .filter((b) => b.driverId === currentUser?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const activeTrip =
    latestDriverBooking && ['accepted', 'picking_up', 'verified', 'confirmed', 'started'].includes(latestDriverBooking.status)
      ? latestDriverBooking
      : undefined;
  const firstNearbyRequest = nearbyRequests[0];
  const earningsToday = bookings
    .filter((b) => b.driverId === currentUser?.id && b.status === 'completed')
    .reduce((sum, b) => sum + b.fare, 0);

  useEffect(() => {
    if (!driver) return;
    const savedMode = window.localStorage.getItem(`ayab_driver_matching_mode_${driver.id}`);
    if (savedMode === 'auto' || savedMode === 'manual') setMatchingMode(savedMode);
    setMatchingReady(true);
  }, [driver?.id]);

  useEffect(() => {
    if (!matchingReady || !driver) return;
    window.localStorage.setItem(`ayab_driver_matching_mode_${driver.id}`, matchingMode);
  }, [matchingMode, matchingReady, driver?.id]);

  useEffect(() => {
    if (!matchingReady || matchingMode !== 'auto' || !driver?.online || !currentUser || activeTrip || !firstNearbyRequest) return;
    acceptBooking(firstNearbyRequest.id, currentUser.id);
    router.replace(`/driver/trip?bookingId=${encodeURIComponent(firstNearbyRequest.id)}`);
  }, [matchingReady, matchingMode, driver?.online, currentUser, activeTrip?.id, firstNearbyRequest?.id, acceptBooking, router]);

  function acceptNearbyRequest(request: Booking) {
    if (!currentUser || !driver?.online || activeTrip) return;
    acceptBooking(request.id, currentUser.id);
    router.push(`/driver/trip?bookingId=${encodeURIComponent(request.id)}`);
  }

  if (!driver) return null;

  return (
    <div className="shell bg-slate-50">
      <PageHeader title="AYAB Driver" />
      <div className="page-body space-y-5 !px-4 !pb-28 !pt-5">
        
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1769e0] via-[#206fd9] to-[#104da9] p-5 text-white shadow-[0_12px_28px_rgba(23,92,190,0.2)]">
          <span aria-hidden="true" className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[26px] border-white/[0.08]" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div role="img" className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-br from-[#d7ebff] to-[#8dbbf2] text-[16px] font-extrabold tracking-wide text-[#164d91] shadow-inner" aria-label={`${driver.name} profile image placeholder`}>
                {driver.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-blue-100">{driver.verified ? 'Verified driver' : 'Pending verification'}</p>
                <h2 className="truncate font-display text-[17px] font-bold leading-tight">{driver.name}</h2>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-white/80">
                  <StarIcon width={13} height={13} className="fill-[#ffd36b] text-[#ffd36b]" />
                  {driver.rating.toFixed(1)} <span className="text-white/50">·</span> {driver.completedTrips} trips
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={driver.online}
              aria-label={driver.online ? 'Go offline' : 'Go online'}
              onClick={() => driver.verified && toggleDriverOnline(driver.id)}
              disabled={!driver.verified}
              className={`relative z-10 inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[10px] font-extrabold tracking-[0.11em] shadow-sm transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${driver.online ? 'bg-[#22c982] text-[#073f2a] hover:bg-[#1dbb75]' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              <span className={`h-2 w-2 rounded-full ${driver.online ? 'animate-pulse bg-white' : 'bg-white/60'}`} />
              {driver.online ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>
          {!driver.verified && (
            <p className="relative mt-4 rounded-xl bg-white/10 px-3 py-2 text-[11px] leading-relaxed text-blue-50">Your account is awaiting admin verification. You can go online once approved.</p>
          )}
        </section>

        {activeTrip && (
          <Link
            href={`/driver/trip?bookingId=${encodeURIComponent(activeTrip.id)}`}
            className="block rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#1769e0]">Active trip</p>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#1769e0]">
                {activeTrip.status.replace('_', ' ')}
              </span>
            </div>
            <p className="mt-2 font-display text-[15px] font-bold text-slate-800">{activeTrip.pickup.name} → {activeTrip.destination.name}</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="truncate text-[12px] text-slate-500">{activeTrip.passengerName}</p>
              <p className="shrink-0 text-[12px] font-semibold text-[#1769e0]">{formatPeso(activeTrip.fare)} · View trip</p>
            </div>
          </Link>
        )}

        {nearbyRequests.length === 0 ? (
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1769e0]">
                <span aria-hidden="true" className="absolute h-9 w-9 animate-ping rounded-full border border-blue-300/70" />
                <span aria-hidden="true" className="absolute h-6 w-6 rounded-full border border-blue-300/80" />
                <span aria-hidden="true" className="relative h-2.5 w-2.5 rounded-full bg-[#1769e0]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[14px] font-bold text-slate-800">0 Open ride requests nearby</p>
                <p className="mt-1 text-[11px] text-slate-500">{driver.online ? 'Scanning for commuters nearby…' : 'Go online to start receiving requests.'}</p>
              </div>
              <span className={`h-2 w-2 shrink-0 rounded-full ${driver.online ? 'animate-pulse bg-emerald-400' : 'bg-slate-300'}`} />
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-[14px] font-bold text-slate-800">{nearbyRequests.length} open ride {nearbyRequests.length === 1 ? 'request' : 'requests'} nearby</p>
                <p className="mt-1 text-[11px] text-slate-500">{driver.online ? 'Choose a trip that works for you.' : 'Go online to accept requests.'}</p>
              </div>
              <Link href="/driver/requests" className="shrink-0 text-[11px] font-semibold text-[#1769e0]">View all</Link>
            </div>
          </section>
        )}

        
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[15px] font-bold text-slate-800">Ride Matching Preference</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">Choose how you receive new trips.</p>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-400 shadow-sm">{matchingMode === 'auto' ? 'AUTO' : 'MANUAL'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={matchingMode === 'auto'}
              onClick={() => setMatchingMode('auto')}
              className={`min-h-[94px] rounded-2xl border p-3 text-left shadow-sm transition ${matchingMode === 'auto' ? 'border-[#1769e0] bg-blue-50 ring-1 ring-[#1769e0]/20' : 'border-white bg-white hover:border-slate-200'}`}
            >
              <span className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-bold ${matchingMode === 'auto' ? 'bg-[#1769e0] text-white' : 'bg-slate-100 text-slate-500'}`}>A</span>
              <span className="block text-[12px] font-bold text-slate-800">Auto-Accept</span>
              <span className="mt-0.5 block text-[10px] leading-4 text-slate-500">System matches instantly</span>
            </button>
            <button
              type="button"
              aria-pressed={matchingMode === 'manual'}
              onClick={() => setMatchingMode('manual')}
              className={`min-h-[94px] rounded-2xl border p-3 text-left shadow-sm transition ${matchingMode === 'manual' ? 'border-[#1769e0] bg-blue-50 ring-1 ring-[#1769e0]/20' : 'border-white bg-white hover:border-slate-200'}`}
            >
              <span className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-bold ${matchingMode === 'manual' ? 'bg-[#1769e0] text-white' : 'bg-slate-100 text-slate-500'}`}>M</span>
              <span className="block text-[12px] font-bold text-slate-800">Manual Selection</span>
              <span className="mt-0.5 block text-[10px] leading-4 text-slate-500">Pick a route and rider</span>
            </button>
          </div>
          {matchingMode === 'manual' && nearbyRequests.length > 0 && !activeTrip && (
            <div className="mt-3 space-y-2">
              {nearbyRequests.slice(0, 2).map((request) => (
                <div key={request.id} className="rounded-2xl bg-white p-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-slate-800">{request.passengerName}</p>
                      <p className="mt-1 truncate text-[11px] text-slate-500">{request.pickup.name} → {request.destination.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><MapPinIcon width={12} height={12} /> {request.distance.toFixed(1)} km away</p>
                    </div>
                    <span className="shrink-0 font-display text-[14px] font-bold text-[#1769e0]">{formatPeso(request.fare)}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => declineBooking(request.id)} disabled={!driver.online} className="min-h-9 flex-1 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45">Decline</button>
                    <button type="button" onClick={() => acceptNearbyRequest(request)} disabled={!driver.online || Boolean(activeTrip)} className="min-h-9 flex-1 rounded-xl bg-[#1769e0] text-[11px] font-bold text-white transition hover:bg-[#125cc9] disabled:cursor-not-allowed disabled:opacity-45">Accept this trip</button>
                  </div>
                </div>
              ))}
              {nearbyRequests.length > 2 && <Link href="/driver/requests" className="block py-1 text-center text-[11px] font-semibold text-[#1769e0]">See all {nearbyRequests.length} requests</Link>}
            </div>
          )}
          {matchingMode === 'manual' && nearbyRequests.length === 0 && (
            <Link href="/driver/requests" className="mt-2 block text-[11px] font-medium text-[#1769e0]">Browse nearby requests</Link>
          )}
        </section>

        
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[15px] font-bold text-slate-800">Today</h2>
            <span className="text-[10px] text-slate-400">Your driver snapshot</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <article className="min-h-[120px] rounded-2xl bg-white p-4 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[16px] font-bold text-emerald-600">₱</span>
              <p className="mt-3 font-display text-[20px] font-extrabold leading-none tracking-tight text-slate-800">{formatPeso(earningsToday || 23.2)}</p>
              <p className="mt-1.5 text-[10px] font-medium text-slate-500">Today&apos;s earnings</p>
            </article>
            <article className="min-h-[120px] rounded-2xl bg-white p-4 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[14px] font-bold text-[#1769e0]">↗</span>
              <p className="mt-3 font-display text-[15px] font-extrabold leading-none tracking-wide text-slate-800">{driver.plate}</p>
              <p className="mt-1.5 truncate text-[10px] font-medium text-slate-500">{driver.tricycle}</p>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">Vehicle details</p>
            </article>
          </div>
        </section>
      </div>
      
      <BottomTabs role="driver" />

    </div>
  );
}

export default function Page() {
  return (
    <RequireRole role="driver">
      <DriverHome />
    </RequireRole>
  );
}
