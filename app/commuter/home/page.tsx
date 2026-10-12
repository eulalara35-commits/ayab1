// Purpose: Show the commuter dashboard.
'use client';

import Link from 'next/link';
import { RequireRole } from '@/components/RequireRole';
import { BottomTabs } from '@/components/BottomTabs';
import { BellIcon, MapPinIcon, MegaphoneIcon } from '@/components/Icons';
import { useApp } from '@/lib/store';
import { formatPeso } from '@/lib/utils';


function CommuterHome() {
  const { currentUser, bookings, drivers, announcements, notifications } = useApp();

  const myBookings = bookings.filter((b) => b.passengerId === currentUser?.id);
  const latestBooking = [...myBookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const activeBooking =
    latestBooking && ['searching', 'accepted', 'picking_up', 'verified', 'confirmed', 'started'].includes(latestBooking.status)
      ? latestBooking
      : undefined;
  const completedCount = myBookings.filter((b) => b.status === 'completed').length;
  const nearbyDrivers = drivers.filter((d) => d.online && d.verified).length;
  const unread = notifications.filter((n) => n.userId === currentUser?.id && !n.read).length;
  const latestAnnouncement = announcements.find((a) => a.published);

  return (
    <div className="shell bg-[#f5f7fa]">
      <header className="flex min-h-[62px] items-center justify-between border-b border-[#e9edf2] bg-[#f5f7fa] px-5">
        <Link href="/commuter/home" className="font-display text-[17px] font-extrabold tracking-[0.2em] text-[#1769e0]">AYAB</Link>
        <Link href="/commuter/notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#526780] shadow-sm transition hover:text-[#1769e0]" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}>
          <BellIcon width={19} height={19} />
          {unread > 0 && <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-[#f08a58]" />}
        </Link>
      </header>

      <div className="flex-1 px-5 pb-7 pt-6">
        <p className="font-display text-[23px] font-bold leading-tight tracking-[-0.035em] text-[#26364b] sm:text-[25px]">{'Magand\u00e0ng araw, '}{currentUser?.name.split(' ')[0]}!</p>
        <p className="mt-1 text-[13px] text-[#8491a1]">Where would you like to go today?</p>

        {activeBooking ? (
          <Link href="/commuter/tracking" className="group relative mt-6 flex min-h-[158px] items-center justify-between overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1769e0] via-[#1e75e8] to-[#1553bb] px-5 py-5 text-white shadow-[0_12px_28px_rgba(23,105,224,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(23,105,224,0.28)]">
            <div className="relative z-10 min-w-0 pr-2">
              <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-blue-50">Trip in progress</span>
              <p className="mt-3 truncate font-display text-[18px] font-bold">{activeBooking.pickup.name}{' \u2192 '}{activeBooking.destination.name}</p>
              <p className="mt-1 text-[12px] text-white/75">{'Tap to track your ride \u00b7 '}{formatPeso(activeBooking.fare)}</p>
            </div>
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[23px] text-[#1769e0] shadow-md transition group-hover:translate-x-0.5">{'\u2192'}</span>
          </Link>
        ) : (
          <Link href="/commuter/book" className="group relative mt-6 flex min-h-[176px] items-center justify-between overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1769e0] via-[#1d75ec] to-[#114fb5] px-5 py-5 text-white shadow-[0_12px_28px_rgba(23,105,224,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(23,105,224,0.3)] sm:px-6">
            <span aria-hidden="true" className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[30px] border-white/[0.08] transition-transform duration-500 group-hover:scale-110" />
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-50">Ready when you are</span>
              <p className="mt-3 font-display text-[22px] font-extrabold tracking-[-0.025em] sm:text-[24px]">Book a tricycle</p>
              <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-white/85">
                <MapPinIcon width={16} height={16} /> {nearbyDrivers} drivers online nearby
              </p>
            </div>
            <span aria-hidden="true" className="relative z-10 ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[23px] text-[#1769e0] shadow-md transition duration-200 group-hover:translate-x-1 group-hover:shadow-lg">{'\u2192'}</span>
          </Link>
        )}

        <div className="mb-3 mt-7 flex items-center justify-between">
          <h2 className="font-display text-[14px] font-bold tracking-[-0.01em] text-[#35475c]">Your trips</h2>
          <Link href="/commuter/history" className="text-[11px] font-semibold text-[#1769e0] hover:text-[#104fae]">View history</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white px-3 py-4 text-center shadow-sm ring-1 ring-black/[0.025]">
            <p className="font-display text-[26px] font-extrabold leading-none text-[#1769e0]">{completedCount}</p>
            <p className="mt-2 text-[11px] font-medium text-[#77869a]">Completed rides</p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-4 text-center shadow-sm ring-1 ring-black/[0.025]">
            <p className="font-display text-[26px] font-extrabold leading-none text-[#1769e0]">{nearbyDrivers}</p>
            <p className="mt-2 text-[11px] font-medium text-[#77869a]">Drivers online</p>
          </div>
        </div>

        {latestAnnouncement && (
          <>
            <h2 className="mb-3 mt-7 font-display text-[14px] font-bold tracking-[-0.01em] text-[#35475c]">Announcement</h2>
            <div className="rounded-2xl border border-[#f3e8cb] bg-[#fff9ed] p-4 shadow-sm shadow-amber-900/[0.025]">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7edda] text-[#a87523]"><MegaphoneIcon width={17} height={17} /></span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[13px] font-bold text-[#55462c]">{latestAnnouncement.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#82745d]">{latestAnnouncement.body}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <BottomTabs role="commuter" />
    </div>
  );
}

export default function Page() {
  return (
    <RequireRole role="commuter">
      <CommuterHome />
    </RequireRole>
  );
}
