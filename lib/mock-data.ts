// Nandito ang seed data para sa mga lugar, users, drivers, bookings, incidents, anunsyo, at base fare.
import type { Announcement, Booking, Driver, Incident, Place, User } from './types';

// Mga lugar sa Tuguegarao at fare matrix para sa bawat destination.
export const PLACES: Place[] = [
  { id: 'p1', name: 'Namabbalan Sur (Mababalan Sur)', lat: 17.547379, lng: 121.784107, discountedFare: 20, regularFare: 33 },
  { id: 'p2', name: 'Namabbalan Norte (Mababalan Norte)', lat: 17.553597, lng: 121.782827, discountedFare: 20, regularFare: 30 },
  { id: 'p3', name: 'Dadda', lat: 17.565849, lng: 121.778454, discountedFare: 20, regularFare: 27 },
  { id: 'p4', name: 'Tagga', lat: 17.612, lng: 121.722, discountedFare: 20, regularFare: 25 },
  { id: 'p5', name: 'Gosi Sur', lat: 17.616, lng: 121.716, discountedFare: 20, regularFare: 25 },
  { id: 'p6', name: 'Gosi Norte', lat: 17.620, lng: 121.716, discountedFare: 20, regularFare: 25 },
  { id: 'p7', name: 'Libag Bajo', lat: 17.621, lng: 121.722, discountedFare: 20, regularFare: 23 },
  { id: 'p8', name: 'Libag Sur', lat: 17.625, lng: 121.722, discountedFare: 20, regularFare: 23 },
  { id: 'p9', name: 'Libag Norte', lat: 17.629, lng: 121.722, discountedFare: 20, regularFare: 22 },
  { id: 'p10', name: 'Lingaing', lat: 17.624, lng: 121.731, discountedFare: 20, regularFare: 25 },
  { id: 'p11', name: 'Capatan', lat: 17.629, lng: 121.731, discountedFare: 20, regularFare: 22 },
  { id: 'p12', name: 'Larion Bajo', lat: 17.620, lng: 121.736, discountedFare: 20, regularFare: 23 },
  { id: 'p13', name: 'Larion Alto', lat: 17.625, lng: 121.739, discountedFare: 20, regularFare: 25 },
  { id: 'p14', name: 'Bagay', lat: 17.631, lng: 121.738, discountedFare: 20, regularFare: 23 },
  { id: 'p15', name: 'Pallua Sur', lat: 17.602, lng: 121.735, discountedFare: 20, regularFare: 23 },
  { id: 'p16', name: 'Pallua Norte', lat: 17.607, lng: 121.739, discountedFare: 20, regularFare: 23 },
  { id: 'p17', name: 'Buntun', lat: 17.594, lng: 121.704, discountedFare: 20, regularFare: 24 },
  { id: 'p18', name: 'Cataggaman Nuevo', lat: 17.616, lng: 121.700, discountedFare: 20, regularFare: 22 },
  { id: 'p19', name: 'Cataggaman Viejo', lat: 17.620, lng: 121.697, discountedFare: 20, regularFare: 24 },
  { id: 'p20', name: 'Cataggaman Pardo', lat: 17.625, lng: 121.696, discountedFare: 20, regularFare: 25 },
  { id: 'p21', name: 'Carig Norte', lat: 17.632, lng: 121.721, discountedFare: 20, regularFare: 27 },
  { id: 'p22', name: 'Carig Sur', lat: 17.624, lng: 121.723, discountedFare: 20, regularFare: 26 },
  { id: 'p23', name: 'CSU Carig', lat: 17.620, lng: 121.727, discountedFare: 20, regularFare: 24 },
  { id: 'p24', name: 'Leonarda', lat: 17.610, lng: 121.738, discountedFare: 20, regularFare: 24 },
  { id: 'p25', name: 'Pengue-Ruyu', lat: 17.605, lng: 121.728, discountedFare: 20, regularFare: 23 },
  { id: 'p26', name: 'Tanza', lat: 17.612, lng: 121.731, discountedFare: 20, regularFare: 22 },
  { id: 'p27', name: 'Caggay', lat: 17.627, lng: 121.749, discountedFare: 20, regularFare: 23 },
  { id: 'p28', name: 'Capitol Market', lat: 17.615, lng: 121.727, discountedFare: 20, regularFare: 25 },
  { id: 'p29', name: 'City Hall / RGC / CVMC', lat: 17.613, lng: 121.727, discountedFare: 20, regularFare: 26 },
  { id: 'p30', name: 'Caritan Norte', lat: 17.618, lng: 121.720, discountedFare: 20, regularFare: 22 },
  { id: 'p31', name: 'Caritan Centro', lat: 17.613, lng: 121.721, discountedFare: 20, regularFare: 22 },
  { id: 'p32', name: 'Caritan Sur', lat: 17.608, lng: 121.720, discountedFare: 20, regularFare: 22 },
  { id: 'p33', name: 'Annafunan East', lat: 17.610, lng: 121.745, discountedFare: 20, regularFare: 23 },
  { id: 'p34', name: 'Annafunan West', lat: 17.610, lng: 121.739, discountedFare: 20, regularFare: 23 },
  { id: 'p35', name: 'Atulayan Norte', lat: 17.617, lng: 121.744, discountedFare: 20, regularFare: 22 },
  { id: 'p36', name: 'Atulayan Sur', lat: 17.611, lng: 121.744, discountedFare: 20, regularFare: 23 },
  { id: 'p37', name: 'Linao West', lat: 17.590, lng: 121.712, discountedFare: 20, regularFare: 24 },
  { id: 'p38', name: 'Linao Norte', lat: 17.595, lng: 121.718, discountedFare: 20, regularFare: 25 },
  { id: 'p39', name: 'Linao East', lat: 17.594, lng: 121.727, discountedFare: 20, regularFare: 24 },
  { id: 'p40', name: 'Ugac Norte', lat: 17.608, lng: 121.752, discountedFare: 20, regularFare: 24 },
  { id: 'p41', name: 'Ugac Sur', lat: 17.600, lng: 121.752, discountedFare: 20, regularFare: 22 },
  { id: 'p42', name: 'Ugac Highway', lat: 17.607, lng: 121.760, discountedFare: 20, regularFare: 22 },
  { id: 'p43', name: 'San Gabriel', lat: 17.618, lng: 121.756, discountedFare: 20, regularFare: 22 },
  { id: 'p44', name: 'Within Central Business District (Centro 1–Centro 10)', lat: 17.613, lng: 121.727, discountedFare: 20, regularFare: 22 },
  { id: 'p45', name: 'Robinsons Place Tuguegarao', lat: 17.619, lng: 121.724, discountedFare: 20, regularFare: 25 },
  { id: 'p46', name: 'SM City Tuguegarao', lat: 17.623, lng: 121.724, discountedFare: 20, regularFare: 25 },
  { id: 'p47', name: 'Mall of the Valley', lat: 17.613, lng: 121.727, discountedFare: 20, regularFare: 25 },
];

export const MIN_REGULAR_FARE = 25;
export const MIN_DISCOUNTED_FARE = 20;

// Seed accounts para makapag-demo ng commuter, driver, at admin roles.
export const USERS: User[] = [
  { id: 'u1', name: 'Aze Suor', email: 'commuter@ayab.com', password: '123456', role: 'commuter', phone: '09171234567', status: 'active' },
  { id: 'u2', name: 'Maria Garcia', email: 'maria@ayab.com', password: '123456', role: 'commuter', phone: '09171234568', status: 'active' },
  { id: 'u3', name: 'Carlo Reyes', email: 'carlo@ayab.com', password: '123456', role: 'commuter', phone: '09171234569', status: 'active' },
  { id: 'd1', name: 'Russel Banan', email: 'driver@ayab.com', password: '123456', role: 'driver', phone: '09181234567', status: 'active' },
  { id: 'd2', name: 'Ramon Bautista', email: 'ramon@ayab.com', password: '123456', role: 'driver', phone: '09181234568', status: 'active' },
  { id: 'd3', name: 'Noel Ramirez', email: 'noel@ayab.com', password: '123456', role: 'driver', phone: '09181234569', status: 'active' },
  { id: 'a1', name: 'AYAB Administrator', email: 'admin@ayab.com', password: '123456', role: 'admin', phone: '09991234567', status: 'active' },
];

// Seed driver profiles, vehicle details, availability, ratings, at sample coordinates.
export const DRIVERS: Driver[] = [
  { id: 'd1', name: 'Russel Banan', email: 'driver@ayab.com', password: '123456', role: 'driver', phone: '09181234567', status: 'active', rating: 4.8, completedTrips: 125, plate: 'ABC 1234', tricycle: 'AYAB Blue Tricycle', qrId: 'AYAB-DRIVER-001', online: true, verified: true, lat: 17.6132, lng: 121.7269, eta: 4 },
  { id: 'd2', name: 'Ramon Bautista', email: 'ramon@ayab.com', password: '123456', role: 'driver', phone: '09181234568', status: 'active', rating: 5.0, completedTrips: 98, plate: 'DEF 5678', tricycle: 'AYAB Green Tricycle', qrId: 'AYAB-DRIVER-002', online: true, verified: true, lat: 17.6151, lng: 121.7310, eta: 6 },
  { id: 'd3', name: 'Noel Ramirez', email: 'noel@ayab.com', password: '123456', role: 'driver', phone: '09181234569', status: 'active', rating: 4.9, completedTrips: 210, plate: 'GHI 9012', tricycle: 'AYAB Red Tricycle', qrId: 'AYAB-DRIVER-003', online: false, verified: false, lat: 17.6180, lng: 121.7300, eta: 8 },
];

// Sample rides na may iba’t ibang status para makita ang history at dashboard states.
export const BOOKINGS: Booking[] = [
  {
    id: 'AYAB-DEMO01',
    passengerId: 'u2',
    passengerName: 'Maria Garcia',
    pickup: PLACES[0],
    destination: PLACES[2],
    distance: 1.4,
    fare: 23.2,
    fareCategory: 'regular',
    passengerCount: 1,
    status: 'searching',
    paymentStatus: 'pending_payment',
    createdAt: '2026-09-02T10:00:00+08:00',
    driverResponseDeadline: new Date(Date.now() + 60_000).toISOString(),
  },
];

// Sample incident records para sa admin review flow.
export const INCIDENTS: Incident[] = [
  {
    id: 'i1',
    title: 'Late pickup',
    passenger: 'Maria Garcia',
    driver: 'Ramon Bautista',
    description: 'Driver arrived later than expected.',
    status: 'Resolved',
    notes: 'Demo incident.',
    date: '2026-08-28',
  },
  {
    id: 'i2',
    title: 'QR verification issue',
    passenger: 'Aze Suor',
    driver: 'Russel Banan',
    description: 'QR did not scan on first attempt.',
    status: 'Investigating',
    notes: '',
    date: '2026-09-01',
  },
];

// Sample announcement records na puwedeng i-manage ng admin.
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'an1',
    title: 'Welcome to AYAB',
    body: 'Maysa nga Ayab, May Tricy Agad',
    published: true,
    date: '2026-09-01',
  },
  {
    id: 'an2',
    title: 'Ride Safely',
    body: 'Please verify the driver QR before starting your trip.',
    published: true,
    date: '2026-08-30',
  },
];

// Base at per-kilometer rates na ginagamit ng fare estimate helper.
export const BASE_FARE = 20;
export const PER_KM_RATE = 8;
