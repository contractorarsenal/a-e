/**
 * Travel content. Verified 2026-11-22 — see TRAVEL_RESEARCH.md for sources and what could NOT be verified.
 * Hotel pages blocked automated fetch, so amenities are kept generic; guests should confirm on the hotel's own page.
 * No nightly prices, availability, group rates or room blocks are stated anywhere on this site.
 */
import { fullAddress, mapLinks } from './site';

export const travelIntro =
  'Escondido is in north San Diego County. These are places to stay in Escondido and nearby San Marcos, with approximate drive times to the venue.';

export const stayDates = { checkin: '2027-08-27', checkout: '2027-08-29' }; // suggestion only, guests adjust

const enc = encodeURIComponent;
const driveFrom = (origin: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${enc(origin)}&destination=${enc('Ethereal Gardens, ' + fullAddress)}`;
const appleFrom = (origin: string) => `https://maps.apple.com/?saddr=${enc(origin)}&daddr=${enc(fullAddress)}&dirflg=d`;

export type Hotel = {
  id: string;
  name: string;
  area: string;
  address: string;
  type: string;
  tier: string;
  why: string;
  /** Amenities as reported for the property. Brand pages blocked automated checks, so guests should confirm at booking. */
  amenities: string[];
  roomTypes: string;
  kitchen: string;
  family: string;
  parking: string;
  bookingUrl: string;
  /** Authorized photo (path under /public/hotels/ or an https URL you have rights to). Leave null until supplied. */
  photo: string | null;
  googleDirections: string;
  appleDirections: string;
};

const h = (x: Omit<Hotel, 'googleDirections' | 'appleDirections' | 'photo'> & { photo?: string | null }): Hotel => ({
  photo: null,
  ...x,
  googleDirections: driveFrom(x.name + ', ' + x.address),
  appleDirections: appleFrom(x.address),
});

export const hotels: Hotel[] = [
  h({
    id: 'best-western',
    name: 'Best Western Escondido Hotel',
    area: 'Escondido',
    address: '1700 Seven Oakes Rd, Escondido, CA 92026',
    type: 'Hotel',
    tier: 'Hotel',
    why: 'A straightforward hotel in Escondido, with family suites listed on the hotel’s page.',
    amenities: ['Complimentary breakfast', 'Heated outdoor pool', 'Free Wi-Fi', 'Microwave & fridge in rooms'],
    roomTypes: 'Standard rooms, two-room and family suites',
    kitchen: 'Microwave and refrigerator in rooms (no full kitchen reported)',
    family: 'Good for families: family suites and a pool',
    parking: 'Confirm with the hotel when booking',
    bookingUrl: 'https://www.bestwestern.com/en_US/book/escondido/hotel-rooms/best-western-escondido-hotel/propertyCode.05487.html',
  }),
  h({
    id: 'springhill',
    name: 'SpringHill Suites by Marriott San Diego Escondido/Downtown',
    area: 'Downtown Escondido',
    address: '200 La Terraza Blvd, Escondido, CA 92025',
    type: 'All-suite hotel',
    tier: 'All-suite hotel',
    why: 'Suite-style rooms close to downtown Escondido’s restaurants and the SPRINTER line.',
    amenities: ['All-suite rooms', 'Fitness center', 'Lobby bar', 'Business center'],
    roomTypes: 'Suites',
    kitchen: 'Not confirmed',
    family: 'Roomy suites suit small families',
    parking: 'Confirm with the hotel when booking',
    bookingUrl: 'https://www.marriott.com/en-us/hotels/sansd-springhill-suites-san-diego-escondido-downtown/overview/',
  }),
  h({
    id: 'residence-inn',
    name: 'Residence Inn by Marriott San Diego North/San Marcos',
    area: 'San Marcos',
    address: '1245 Los Vallecitos Blvd, San Marcos, CA 92069',
    type: 'Extended-stay suites',
    tier: 'Suites with kitchens',
    why: 'Studio, one- and two-bedroom suites with kitchens, which suit families or friends sharing a room set.',
    amenities: ['Full kitchens', 'Complimentary breakfast', 'Studio to two-bedroom suites'],
    roomTypes: 'Studio, one-bedroom and two-bedroom suites',
    kitchen: 'Full kitchens reported',
    family: 'Best for larger families and groups',
    parking: 'Confirm with the hotel when booking',
    bookingUrl: 'https://www.marriott.com/en-us/hotels/sanmc-residence-inn-san-diego-north-san-marcos/overview/',
  }),
  h({
    id: 'welk',
    name: 'Hyatt Vacation Club at The Welk',
    area: 'Escondido (Welk Resort)',
    address: '8860 Lawrence Welk Dr, Escondido, CA 92026',
    type: 'Resort (vacation club)',
    tier: 'Resort',
    why: 'A resort setting on large grounds, and the closest of these to the venue. It is a vacation-club property, so check on the Hyatt page whether your dates are bookable.',
    amenities: ['Resort grounds with pools and golf', 'Vacation-club accommodations'],
    roomTypes: 'Vacation-club villas and suites (check Hyatt page)',
    kitchen: 'Not confirmed',
    family: 'Resort setting, family-friendly',
    parking: 'Confirm with the resort',
    bookingUrl: 'https://www.hyatt.com/en-US/hotel/california/the-welk/sansw',
  }),
];

const bnb = (place: string) =>
  `https://www.airbnb.com/s/${place}/homes?checkin=${stayDates.checkin}&checkout=${stayDates.checkout}&adults=2`;
const vrbo = (dest: string) =>
  `https://www.vrbo.com/search?destination=${enc(dest)}&startDate=${stayDates.checkin}&endDate=${stayDates.checkout}&adults=2`;

export const rentals = [
  { area: 'Escondido', note: 'Closest to the venue.', airbnb: bnb('Escondido--CA'), vrbo: vrbo('Escondido, California') },
  { area: 'San Marcos', note: 'Next door, with more chain hotels along the SPRINTER line.', airbnb: bnb('San-Marcos--CA'), vrbo: vrbo('San Marcos, California') },
  { area: 'Valley Center', note: 'Quieter and more rural; best if you are driving.', airbnb: bnb('Valley-Center--CA'), vrbo: vrbo('Valley Center, California') },
  { area: 'Vista', note: 'A little farther west, towards the coast.', airbnb: bnb('Vista--CA'), vrbo: vrbo('Vista, California') },
];

export const airports = [
  {
    code: 'SAN',
    name: 'San Diego International Airport',
    role: 'Best for most guests',
    body: 'The main commercial airport for the region, with the widest choice of flights and a dedicated rental car center.',
    href: 'https://www.san.org/before-you-go-travel-tips/rental-car-center/',
    linkLabel: 'SAN rental car center',
  },
  {
    code: 'CRQ',
    name: 'McClellan-Palomar Airport (Carlsbad)',
    role: 'Smaller, closer option',
    body: 'San Diego County lists a few commercial carriers here. Service has changed over time, so check the airlines for current schedules before relying on it.',
    href: 'https://www.sandiegocounty.gov/content/sdc/dpw/airports/palomar.html',
    linkLabel: 'Airport information',
  },
  {
    code: 'ONT · SNA · LAX',
    name: 'Ontario, Orange County, Los Angeles',
    role: 'Alternatives',
    body: 'Useful if the fares are much better, but expect a noticeably longer drive. Check a maps app for your own travel time.',
    href: 'https://www.flylax.com',
    linkLabel: 'LAX',
    extra: [
      { href: 'https://www.flyontario.com', label: 'Ontario' },
      { href: 'https://www.ocair.com', label: 'Orange County' },
    ],
  },
];

export const rentalCompanies = [
  { name: 'Enterprise', href: 'https://www.enterprise.com' },
  { name: 'Hertz', href: 'https://www.hertz.com' },
  { name: 'Avis', href: 'https://www.avis.com' },
  { name: 'National', href: 'https://www.nationalcar.com' },
  { name: 'Budget', href: 'https://www.budget.com' },
  { name: 'Alamo', href: 'https://www.alamo.com' },
  { name: 'Sixt', href: 'https://www.sixt.com' },
  { name: 'Compare on Kayak', href: 'https://www.kayak.com/cars' },
];

export const sanRentalFacts = [
  'The SAN Rental Car Center is at 3355 Admiral Boland Way, San Diego, off the airport grounds.',
  'A free shuttle runs between the terminals and the center, around the clock. Individual rental counters keep their own hours, so check yours.',
];

export const transit = {
  sprinter: {
    href: 'https://gonctd.com/services/sprinter/',
    body: 'NCTD’s SPRINTER light rail runs between Oceanside and Escondido (stops include San Marcos and Vista) and connects with the COASTER and Amtrak Pacific Surfliner at Oceanside. It is a reasonable way to reach Escondido without a car, but it will not take you to the venue, and weekend frequency is lower in the early morning and evening.',
  },
  rideshare: {
    uber: 'https://www.uber.com',
    lyft: 'https://www.lyft.com',
  },
};

export const guidance = [
  { t: 'Book early', b: 'It is a Saturday in late August, peak travel season in Southern California. Hotels and rentals can fill, so look sooner rather than later.' },
  { t: 'Plan your ride home', b: 'We cannot promise rideshare availability at the venue late at night. Decide in advance who is driving or how you will get back.' },
  { t: 'Share a car or a stay', b: 'Splitting a rental car or a house keeps costs down and takes care of the ride. Our guest group is the easiest place to find a travel buddy.' },
  { t: 'Use the live drive time', b: 'Every hotel card has Maps links that show the current drive time to the venue from that address.' },
];

export { mapLinks };
