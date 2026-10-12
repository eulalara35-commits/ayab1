// Nandito ang TypeScript types para sa users, rides, fare, incidents, anunsyo, notifications, at trip steps.
export type Role = 'commuter' | 'driver' | 'admin';
export type FareCategory = 'regular' | 'discounted' | 'special';

export type BookingStatus =
  | 'searching'
  | 'accepted'
  | 'picking_up'
  | 'declined'
  | 'expired'
  | 'pending_payment'
  | 'payment_processing'
  | 'payment_failed'
  | 'paid'
  | 'verified'
  | 'cancelled'
  | 'confirmed'
  | 'started'
  | 'completed';

export type PaymentStatus = 'pending_payment' | 'payment_processing' | 'paid' | 'payment_failed' | 'refund_pending';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone: string;
  status: 'active' | 'suspended';
}

export interface Driver extends User {
  role: 'driver';
  rating: number;
  completedTrips: number;
  plate: string;
  tricycle: string;
  qrId: string;
  online: boolean;
  verified: boolean;
  lat: number;
  lng: number;
  eta: number;
  locationUpdatedAt?: string;
}

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  discountedFare: number;
  regularFare: number;
}

export interface Booking {
  id: string;
  passengerId: string;
  passengerName: string;
  driverId?: string;
  pickup: Place;
  destination: Place;
  distance: number;
  fare: number;
  fareCategory?: FareCategory;
  specialRide?: boolean;
  fareOffer?: number;
  passengerCount: number;
  paymentStatus?: PaymentStatus;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  driverResponseDeadline?: string;
  driverArrivalDeadline?: string;
  tripStartedAt?: string;
  paymentCompletedAt?: string;
  rating?: number;
  review?: string;
}

export type IncidentStatus = 'Pending' | 'Investigating' | 'Resolved' | 'Closed';

export interface Incident {
  id: string;
  title: string;
  passenger: string;
  driver: string;
  description: string;
  status: IncidentStatus;
  notes: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  published: boolean;
  date: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  date: string;
}

// Order at label ng mga hakbang na ipinapakita sa trip progress tracker.
export const TRIP_STEPS: { key: BookingStatus; label: string }[] = [
  { key: 'searching', label: 'Finding driver' },
  { key: 'accepted', label: 'Driver assigned' },
  { key: 'verified', label: 'Trip verified' },
  { key: 'confirmed', label: 'Trip confirmed' },
  { key: 'picking_up', label: 'Picking up passenger' },
  { key: 'started', label: 'On trip' },
  { key: 'completed', label: 'Completed' },
];
