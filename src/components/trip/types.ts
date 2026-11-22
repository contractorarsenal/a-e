export type Leg = { miles: number; minutes: number };
export type RoutePath = Leg & { path: [number, number][] };

export type HotelData = {
  id: string; name: string; area: string; address: string; type: string; tier: string; why: string;
  amenities: string[]; roomTypes: string; kitchen: string; family: string; parking: string;
  bookingUrl: string; photo: string | null; googleDirections: string; appleDirections: string;
  lat: number; lon: number;
  toVenue: RoutePath;
  fromAirport: Record<string, Leg>;
};
export type AirportData = { code: string; name: string; note: string; lat: number; lon: number; toVenue: RoutePath; toHotel: Record<string, Leg> };
export type ConciergeData = {
  hotels: HotelData[];
  airports: AirportData[];
  venue: { name: string; address: string; lat: number; lon: number; googleDirections: string; appleDirections: string };
  couple: string;
  dateISO: string; dateLong: string;
  schedule: { time: string; title: string; note?: string }[];
  stay: { checkin: string; checkout: string };
  rentals: { area: string; note: string; airbnb: string; vrbo: string }[];
  rentalCompanies: { name: string; href: string }[];
  routeMeta: { provider: string; date: string; note: string };
  group: { state: 'none' | 'gated' | 'public'; url: string | null };
  base: string;
};

export type TripState = {
  hotelId: string | null;
  airport: string;
  mode: 'fly' | 'drive';
  from: string;
  party: number;
  checkin: string;
  checkout: string;
  stayType: 'hotel' | 'rental' | 'both';
  transport: 'rental' | 'rideshare' | 'coordinate';
  together: string[];
  compare: string[];
  budget: { rooms: number; hotelNight: string; rentalNight: string; carTotal: string; rideTotal: string; otherTotal: string };
};

export const defaultTrip = (d: ConciergeData): TripState => ({
  hotelId: null, airport: 'SAN', mode: 'fly', from: '', party: 2,
  checkin: d.stay.checkin, checkout: d.stay.checkout,
  stayType: 'hotel', transport: 'rental', together: [], compare: [],
  budget: { rooms: 1, hotelNight: '', rentalNight: '', carTotal: '', rideTotal: '', otherTotal: '' },
});
