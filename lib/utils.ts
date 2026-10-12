// Nandito ang helpers para sa distansya, pamasahe, date display, initials, at IDs.
import { BASE_FARE, MIN_DISCOUNTED_FARE, MIN_REGULAR_FARE, PER_KM_RATE } from './mock-data';
import type { FareCategory, Place } from './types';

/** Haversine distance in kilometers between two points. */
// Tumatanggap ng dalawang Place at nagbabalik ng tantyang distansya nila sa kilometro gamit ang Haversine formula.
export function distanceKm(a: Place, b: Place): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  // Pinagsasama ng Haversine formula ang mga coordinate difference para makuha ang anggulo sa pagitan ng points.
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

// Tumatanggap ng distansya sa kilometro at nagbabalik ng pamasahe gamit ang base fare at rate kada kilometro.
export function estimateFare(distanceKilometers: number): number {
  const fare = BASE_FARE + distanceKilometers * PER_KM_RATE;
  return Math.round(fare * 100) / 100;
}

// Tumatanggap ng destinasyon at fare category; ibinabalik ang regular o discounted fare nito.
export function estimateFareForCategory(place: Place, category: FareCategory): number {
  return category === 'regular'
    ? Math.max(place.regularFare, MIN_REGULAR_FARE)
    : Math.max(place.discountedFare, MIN_DISCOUNTED_FARE);
}

// Tumatanggap ng halaga at ibinabalik ito bilang peso string na may dalawang decimal place.
export function formatPeso(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}

export function getRemainingSeconds(deadline?: string | null): number {
  if (!deadline) return 0;
  const remainingMs = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

export function formatCountdown(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getTripProgress(startedAt: string, now = Date.now()): number {
  const startTime = new Date(startedAt).getTime();
  if (!Number.isFinite(startTime)) return 0;
  return Math.min(1, Math.max(0, (now - startTime) / 60_000));
}

// Tumatanggap ng ISO date string at ibinabalik ang mas madaling basahing petsa at oras; ginagamit ang original string kung hindi ma-format.
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

// Tumatanggap ng pangalan at ibinabalik ang initials ng unang dalawang salita.
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

// Tumatanggap ng prefix at gumagawa ng maikling random ID na may parehong prefix.
export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
