// Purpose: Request a ride.
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { RequireRole } from '@/components/RequireRole';
import { RideMap } from '@/components/RideMap';
import { BackIcon, MapPinIcon } from '@/components/Icons';
import { PLACES } from '@/lib/mock-data';
import { useApp } from '@/lib/store';
import { estimateFareForCategory, formatPeso } from '@/lib/utils';
import { fetchDrivingRoute, snapToRoad, type DrivingRoute, type RoutePoint } from '@/lib/routing';
import type { FareCategory, Place } from '@/lib/types';


function PlaceSearch({
  label,
  selectedPlace,
  onSelect,
  marker,
}: {
  label: string;
  selectedPlace: Place;
  onSelect: (placeId: string) => void;
  marker: 'pickup' | 'destination';
}) {
  const [query, setQuery] = useState(selectedPlace.name);
  const [open, setOpen] = useState(false);
  const idPrefix = label.toLowerCase().replace(/\s+/g, '-');
  
  const matches = PLACES.filter((place) => place.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 7);

  return (
    <div className="relative">
      <div className="flex items-center gap-3 px-3 py-2.5">
        {marker === 'pickup' ? (
          <span aria-hidden="true" className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1769e0] ring-[3px] ring-blue-100" />
          </span>
        ) : (
          <MapPinIcon aria-hidden="true" className="shrink-0 text-[#e34c4c]" width={20} height={20} />
        )}
        <div className="min-w-0 flex-1">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#94a0ae]" htmlFor={`${idPrefix}-search`}>{label}</label>
          <input
            id={`${idPrefix}-search`}
            className="block h-6 w-full border-0 bg-transparent p-0 text-[16px] font-semibold text-[#26384f] outline-none placeholder:text-[#9aa6b4] focus:ring-0"
            type="search"
            autoComplete="off"
            role="combobox"
            aria-expanded={open && matches.length > 0}
            aria-controls={`${idPrefix}-suggestions`}
            aria-autocomplete="list"
            placeholder={`Search ${label.toLowerCase()}`}
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => { setQuery(event.target.value); onSelect(''); setOpen(true); }}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          />
        </div>
      </div>
      {open && query.trim() && matches.length > 0 && (
        <ul id={`${idPrefix}-suggestions`} role="listbox" className="absolute inset-x-0 top-full z-[80] mt-1 max-h-52 overflow-y-auto rounded-xl border border-[#e6ebf1] bg-white py-1 shadow-xl  ">
          {matches.map((place) => (
            <li key={place.id} role="option" aria-selected={place.id === selectedPlace.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#f4f7fb] "
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => { onSelect(place.id); setQuery(place.name); setOpen(false); }}
              >
                <MapPinIcon width={16} height={16} className={marker === 'pickup' ? 'text-[#1769e0]' : 'text-[#e34c4c]'} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#34465c] ">{place.name}</span>
                <span className="shrink-0 text-[10px] text-[#8491a1] ">{formatPeso(estimateFareForCategory(place, 'regular'))}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && matches.length === 0 && (
        <p className="absolute inset-x-0 top-full z-[80] mt-1 rounded-xl border border-[#e6ebf1] bg-white px-3 py-3 text-[12px] text-[#738196] shadow-xl   ">No matching places. Try another barangay.</p>
      )}
    </div>
  );
}

function BookRide() {
  const { drivers, bookings, createBooking } = useApp();
  const router = useRouter();
  const [pickupId, setPickupId] = useState(PLACES[0].id);
  const [destinationId, setDestinationId] = useState(PLACES[2].id);
  const [pickupPoint, setPickupPoint] = useState<[number, number]>([PLACES[0].lat, PLACES[0].lng]);
  const [destinationPoint, setDestinationPoint] = useState<[number, number]>([PLACES[2].lat, PLACES[2].lng]);
  const [fareCategory, setFareCategory] = useState<FareCategory>('regular');
  const [passengerCount, setPassengerCount] = useState(1);
  const [specialFareInput, setSpecialFareInput] = useState('');
  const [requestStarted, setRequestStarted] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [locationMessage, setLocationMessage] = useState('');
  const [snappingLocation, setSnappingLocation] = useState<'pickup' | 'destination' | ''>('');
  const [previewRoute, setPreviewRoute] = useState<DrivingRoute | null>(null);
  const [routeError, setRouteError] = useState('');
  const [routeRetry, setRouteRetry] = useState(0);
  const snapControllers = useRef<{ pickup: AbortController | null; destination: AbortController | null }>({
    pickup: null,
    destination: null,
  });

  const pickupPlace = PLACES.find((p) => p.id === pickupId) ?? PLACES[0];
  const destinationPlace = PLACES.find((p) => p.id === destinationId) ?? PLACES[2];
  const pickup: Place = { ...pickupPlace, lat: pickupPoint[0], lng: pickupPoint[1] };
  const destination: Place = { ...destinationPlace, lat: destinationPoint[0], lng: destinationPoint[1] };
  const mapPickup = previewRoute
    ? { ...pickup, lat: previewRoute.pickup[0], lng: previewRoute.pickup[1] }
    : pickup;
  const mapDestination = previewRoute
    ? { ...destination, lat: previewRoute.destination[0], lng: previewRoute.destination[1] }
    : destination;
  const hasBothPlaces = Boolean(pickupId && destinationId);
  const sameStop = hasBothPlaces && pickupPoint[0] === destinationPoint[0] && pickupPoint[1] === destinationPoint[1];
  const specialRide = fareCategory === 'special';
  const minimumFare = estimateFareForCategory(destination, specialRide ? 'regular' : fareCategory) * passengerCount;
  const enteredSpecialFare = Number(specialFareInput);
  const validSpecialFare = Number.isFinite(enteredSpecialFare) && enteredSpecialFare >= minimumFare;
  const fare = specialRide ? (validSpecialFare ? enteredSpecialFare : minimumFare) : minimumFare;
  const availableDrivers = drivers.filter(
    (d) =>
      d.online &&
      d.verified &&
      !bookings.some(
        (booking) =>
          booking.driverId === d.id &&
          ['accepted', 'picking_up', 'verified', 'confirmed', 'started'].includes(booking.status),
      ),
  );

  useEffect(() => {
    const controller = new AbortController();
    setPreviewRoute(null);
    setRouteError('');

    async function loadPreviewRoute() {
      try {
        const route = await fetchDrivingRoute(pickupPoint, destinationPoint, controller.signal);
        if (!controller.signal.aborted) setPreviewRoute(route);
      } catch (error) {
        if (controller.signal.aborted) return;
        setRouteError(error instanceof Error ? error.message : 'Unable to load the driving route.');
      }
    }

    void loadPreviewRoute();
    return () => controller.abort();
  }, [pickupPoint[0], pickupPoint[1], destinationPoint[0], destinationPoint[1], routeRetry]);

  useEffect(() => () => {
    snapControllers.current.pickup?.abort();
    snapControllers.current.destination?.abort();
  }, []);

  async function updateRoadLocation(point: RoutePoint, location: 'pickup' | 'destination') {
    setRequestStarted(false);
    const controller = new AbortController();
    const otherLocation = location === 'pickup' ? 'destination' : 'pickup';
    snapControllers.current[location]?.abort();
    snapControllers.current[otherLocation]?.abort();
    snapControllers.current[location] = controller;
    setSnappingLocation(location);
    setLocationMessage('');
    try {
      const roadPoint = await snapToRoad(point, controller.signal);
      if (!controller.signal.aborted) {
        if (location === 'pickup') setPickupPoint(roadPoint);
        else setDestinationPoint(roadPoint);
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setLocationMessage(error instanceof Error ? error.message : 'Unable to place the pin on a road.');
    } finally {
      if (snapControllers.current[location] === controller) {
        snapControllers.current[location] = null;
        setSnappingLocation('');
      }
    }
  }

  function selectPickup(placeId: string) {
    setRequestStarted(false);
    setPickupId(placeId);
    const place = PLACES.find((item) => item.id === placeId);
    if (place) {
      setPickupPoint([place.lat, place.lng]);
      void updateRoadLocation([place.lat, place.lng], 'pickup');
    }
  }

  function selectDestination(placeId: string) {
    setRequestStarted(false);
    setDestinationId(placeId);
    const place = PLACES.find((item) => item.id === placeId);
    if (place) {
      setDestinationPoint([place.lat, place.lng]);
      void updateRoadLocation([place.lat, place.lng], 'destination');
    }
  }

  function beginRequest() {
    if (!previewRoute || snappingLocation) {
      setValidationMessage('Wait until both locations are placed on a road and the route is ready.');
      return;
    }
    if (!hasBothPlaces || sameStop) {
      setValidationMessage('Please choose both a pickup point and destination.');
      return;
    }
    if (specialRide && !validSpecialFare) {
      setValidationMessage('Enter a valid fare offer for this special trip.');
      return;
    }
    if (availableDrivers.length === 0) {
      setValidationMessage('No drivers are available right now.');
      return;
    }
    setValidationMessage('');
    setRequestStarted(true);
  }

  function requestRide() {
    if (!requestStarted || requesting) return;
    if (!previewRoute || snappingLocation) {
      setValidationMessage('Wait until both locations are placed on a road and the route is ready.');
      return;
    }
    if (!hasBothPlaces || sameStop) {
      setValidationMessage('Please choose both a pickup point and destination.');
      return;
    }
    if (!Number.isFinite(passengerCount) || passengerCount < 1) {
      setValidationMessage('Please select a valid number of passengers.');
      return;
    }
    if (availableDrivers.length === 0) {
      setValidationMessage('No drivers are available right now.');
      return;
    }
    if (specialRide && !validSpecialFare) {
      setValidationMessage('Enter a valid fare offer for this special trip.');
      return;
    }

    setRequesting(true);
    setValidationMessage('');
    try {
      createBooking(
        pickup,
        destination,
        fareCategory,
        specialRide ? enteredSpecialFare : undefined,
        passengerCount,
      );
      router.push('/commuter/tracking');
    } catch (error) {
      setValidationMessage(error instanceof Error ? error.message : 'Unable to assign a driver. Please try again.');
      setRequesting(false);
    }
  }

  return (
    <main className="booking-screen relative w-full overflow-hidden bg-[#e8edf1]">
      
      <RideMap
        pickup={mapPickup}
        destination={mapDestination}
        fullBleed
        allowLocationSelection
        onPickupChange={(point) => void updateRoadLocation(point, 'pickup')}
        onDestinationChange={(point) => void updateRoadLocation(point, 'destination')}
        route={previewRoute?.points}
        hideUnroutedLine
      />

      
      <div className="booking-top-controls pointer-events-none absolute inset-x-0 z-40 px-3 sm:px-4">
        <section className="booking-top-card pointer-events-auto mx-auto w-full max-w-[448px] overflow-y-auto overscroll-contain rounded-xl border border-white/80 bg-white shadow-md shadow-slate-900/10">
          <div className="flex items-center gap-3 px-3 pb-2 pt-3">
            <Link href="/commuter/home" className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-[#53657b] transition hover:bg-[#f1f5f9] hover:text-[#1769e0]" aria-label="Back to home">
              <BackIcon width={20} height={20} />
            </Link>
            <div>
              <h1 className="font-display text-[15px] font-bold text-[#25374e] ">Book a ride</h1>
              <p className="text-[11px] text-[#8996a6] ">Tuguegarao City</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="rounded-full bg-[#f1f6fd] px-2.5 py-1 text-[9px] font-bold tracking-[0.1em] text-[#4778b4]  ">TRICYCLE</span>
            </div>
          </div>

          <div className="relative px-2 pb-2">
            <div aria-hidden="true" className="absolute left-[21px] top-[25px] z-0 h-[39px] border-l border-[#c7d2df] " />
            <div className="relative divide-y divide-[#edf0f4] rounded-lg bg-[#f8fafc]  ">
              <PlaceSearch label="Pickup point" selectedPlace={pickup} onSelect={selectPickup} marker="pickup" />
              <PlaceSearch label="Destination" selectedPlace={destination} onSelect={selectDestination} marker="destination" />
            </div>
          </div>
          <p className="px-3 pb-2 text-[10px] font-medium text-[#738196]">
            {snappingLocation ? `Placing ${snappingLocation} pin on the nearest road…` : 'Drag the blue P and red D pins to the exact pickup and drop-off spots.'}
          </p>
          {(locationMessage || routeError) && (
            <div className="px-3 pb-2 text-[11px] font-medium text-rose-600" role="status">
              <p>{locationMessage || `Road route preview unavailable: ${routeError}`}</p>
              {routeError && (
                <button type="button" className="mt-1 underline" onClick={() => setRouteRetry((attempt) => attempt + 1)}>
                  Retry route
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      
      <section className="booking-fare-sheet absolute inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[480px] flex-col overflow-hidden rounded-t-[26px] border border-white/80 bg-white px-4 pt-3 shadow-[0_-12px_40px_rgba(20,43,72,0.16)] sm:px-6">
        <div className="booking-fare-sheet__content min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#d8dee7] " />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-[15px] font-bold text-[#26384f] ">Passenger fare</h2>
          <span className="rounded-full bg-[#f3f6fa] px-2.5 py-1 text-[10px] font-medium text-[#78879a]  ">Per ride</span>
        </div>

        
        <div role="group" aria-label="Passenger fare type" className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[#f1f4f8] p-1.5">
          {([
            ['regular', 'Regular', 'Standard fare'],
            ['discounted', 'Discounted', 'Student · Senior · PWD'],
            ['special', 'Special', 'Custom offer'],
          ] as [FareCategory, string, string][]).map(([value, label, detail]) => {
            const selected = fareCategory === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setFareCategory(value);
                  setRequestStarted(false);
                  if (value !== 'special') setSpecialFareInput('');
                }}
                className={`flex min-h-[60px] touch-manipulation flex-col items-start justify-center rounded-xl px-2 text-left transition duration-150 ${selected ? 'bg-[#1769e0] text-white shadow-sm' : 'text-[#65758a] hover:bg-white/80'}`}
              >
                <span className="text-[12px] font-semibold leading-4">{label}</span>
                <span className={`mt-0.5 text-[9px] leading-3 ${selected ? 'text-white/75' : 'text-[#93a0af]'}`}>{detail}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 rounded-xl border border-[#e6ebf1] bg-[#f8fafc] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#8290a3]">Number of passengers</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => { setPassengerCount((count) => Math.max(1, count - 1)); setRequestStarted(false); }}
              className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-[#dfe7f0] bg-white text-[20px] font-medium text-[#3a4d64]"
              aria-label="Decrease passengers"
            >
              −
            </button>
            <div className="min-w-[90px] text-center">
              <span className="font-display text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#1b2e47]">{passengerCount}</span>
            </div>
            <button
              type="button"
              onClick={() => { setPassengerCount((count) => Math.min(8, count + 1)); setRequestStarted(false); }}
              className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-[#dfe7f0] bg-white text-[20px] font-medium text-[#3a4d64]"
              aria-label="Increase passengers"
            >
              +
            </button>
          </div>
        </div>

        {specialRide && (
          <div className="mt-2">
            <label htmlFor="special-ride-fare" className="mb-1 block text-[11px] font-medium text-[#7b899a]">
              Your Offer (minimum {formatPeso(minimumFare)})
            </label>
            <div className="flex items-center rounded-xl border border-[#dfe5ec] bg-white px-3">
              <span className="mr-2 text-[13px] text-[#8491a1]">₱</span>
              <input
                id="special-ride-fare"
                type="number"
                inputMode="decimal"
                min={minimumFare}
                step="0.01"
                value={specialFareInput}
                onChange={(event) => { setSpecialFareInput(event.target.value); setRequestStarted(false); }}
                placeholder={minimumFare.toFixed(2)}
                className="h-11 w-full border-0 bg-transparent p-0 text-[16px] font-semibold text-[#26384f] outline-none focus:ring-0"
                required
              />
            </div>
            {specialFareInput && !validSpecialFare && (
              <p className="mt-1 text-[10px] text-red-600">Enter at least {formatPeso(minimumFare)} for this fare type.</p>
            )}
          </div>
        )}

        
        <div className="my-4 h-px bg-[#edf0f4] " />
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-medium text-[#7b899a] ">{specialRide ? 'Your Offered Fare' : 'Estimated Fare'}</span>
            <span className="font-display text-[23px] font-extrabold leading-none tracking-[-0.025em] text-[#1b2e47] ">{formatPeso(fare)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-medium text-[#7b899a] ">Nearby Drivers</span>
            <span className="text-[12px] font-semibold text-[#3a4d64] ">{availableDrivers.length} drivers available</span>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-[#a0aab6] ">Fare matrix - Effective June 20, 2026</p>

        {sameStop && <p className="mt-2 text-[11px] text-red-600 ">Pickup and destination can&apos;t be the same place.</p>}
        {validationMessage && <p className="mt-2 text-center text-[11px] text-red-600" role="alert">{validationMessage}</p>}
        </div>

        <div className="booking-fare-sheet__footer">
          {!requestStarted ? (
            <button
              type="button"
              onClick={beginRequest}
              disabled={!hasBothPlaces || sameStop || Boolean(snappingLocation) || !previewRoute || availableDrivers.length === 0 || (specialRide && !validSpecialFare)}
              className="flex min-h-[56px] w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-[#1769e0] px-5 text-[15px] font-bold text-white shadow-[0_7px_18px_rgba(23,105,224,0.24)] transition duration-150 hover:bg-[#125cc9] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Request Tricycle <span aria-hidden="true">{'\u2192'}</span>
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-center text-[11px] text-[#738196]">Paying verifies your fare and sends the request to drivers.</p>
              <button
                onClick={requestRide}
                disabled={!hasBothPlaces || sameStop || requesting || Boolean(snappingLocation) || !previewRoute || availableDrivers.length === 0 || (specialRide && !validSpecialFare)}
                className="flex min-h-[56px] w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-[#1769e0] px-5 text-[15px] font-bold text-white shadow-[0_7px_18px_rgba(23,105,224,0.24)] transition duration-150 hover:bg-[#125cc9] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {requesting ? 'Verifying payment and sending…' : `Pay and verify · ${formatPeso(fare)}`}
                {!requesting && <span aria-hidden="true">{'\u2192'}</span>}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <RequireRole role="commuter">
      <BookRide />
    </RequireRole>
  );
}
