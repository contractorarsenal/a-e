/**
 * Travel data (language-neutral): names, addresses, links. Descriptions, amenities and guidance live in the
 * dictionaries (src/i18n/*.ts → hotels, travel). Verified 2026-11-22 — see TRAVEL_RESEARCH.md for sources and what
 * could NOT be verified. Hotel pages blocked automated fetch, so amenities are kept generic; guests should confirm on
 * the hotel's own page. No nightly prices, availability, group rates or room blocks are stated anywhere on this site.
 */
import { fullAddress, mapLinks } from './site';

export const stayDates = { checkin: '2027-08-27', checkout: '2027-08-29' }; // suggestion only, guests adjust

const enc = encodeURIComponent;
const driveFrom = (origin: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${enc(origin)}&destination=${enc('Ethereal Gardens, ' + fullAddress)}`;
const appleFrom = (origin: string) => `https://maps.apple.com/?saddr=${enc(origin)}&daddr=${enc(fullAddress)}&dirflg=d`;

export type HotelId = 'best-western' | 'springhill' | 'residence-inn' | 'welk';
export type Hotel = {
  id: HotelId;
  /** Official property name (a proper noun, never translated). */
  name: string;
  address: string;
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
    address: '1700 Seven Oakes Rd, Escondido, CA 92026',
    bookingUrl: 'https://www.bestwestern.com/en_US/book/escondido/hotel-rooms/best-western-escondido-hotel/propertyCode.05487.html',
  }),
  h({
    id: 'springhill',
    name: 'SpringHill Suites by Marriott San Diego Escondido/Downtown',
    address: '200 La Terraza Blvd, Escondido, CA 92025',
    bookingUrl: 'https://www.marriott.com/en-us/hotels/sansd-springhill-suites-san-diego-escondido-downtown/overview/',
  }),
  h({
    id: 'residence-inn',
    name: 'Residence Inn by Marriott San Diego North/San Marcos',
    address: '1245 Los Vallecitos Blvd, San Marcos, CA 92069',
    bookingUrl: 'https://www.marriott.com/en-us/hotels/sanmc-residence-inn-san-diego-north-san-marcos/overview/',
  }),
  h({
    id: 'welk',
    name: 'Hyatt Vacation Club at The Welk',
    address: '8860 Lawrence Welk Dr, Escondido, CA 92026',
    bookingUrl: 'https://www.hyatt.com/en-US/hotel/california/the-welk/sansw',
  }),
];

const bnb = (place: string) =>
  `https://www.airbnb.com/s/${place}/homes?checkin=${stayDates.checkin}&checkout=${stayDates.checkout}&adults=2`;
const vrbo = (dest: string) =>
  `https://www.vrbo.com/search?destination=${enc(dest)}&startDate=${stayDates.checkin}&endDate=${stayDates.checkout}&adults=2`;

/** `id` keys the localized note in the dictionary (travel.rentalNotes). Area names are proper nouns. */
export const rentals = [
  { id: 'escondido', area: 'Escondido', airbnb: bnb('Escondido--CA'), vrbo: vrbo('Escondido, California') },
  { id: 'san-marcos', area: 'San Marcos', airbnb: bnb('San-Marcos--CA'), vrbo: vrbo('San Marcos, California') },
  { id: 'valley-center', area: 'Valley Center', airbnb: bnb('Valley-Center--CA'), vrbo: vrbo('Valley Center, California') },
  { id: 'vista', area: 'Vista', airbnb: bnb('Vista--CA'), vrbo: vrbo('Vista, California') },
];

/** `kayak: true` entries take their label from the dictionary (travel.compareKayak). */
export const rentalCompanies: { name: string; href: string; kayak?: boolean }[] = [
  { name: 'Enterprise', href: 'https://www.enterprise.com' },
  { name: 'Hertz', href: 'https://www.hertz.com' },
  { name: 'Avis', href: 'https://www.avis.com' },
  { name: 'National', href: 'https://www.nationalcar.com' },
  { name: 'Budget', href: 'https://www.budget.com' },
  { name: 'Alamo', href: 'https://www.alamo.com' },
  { name: 'Sixt', href: 'https://www.sixt.com' },
  { name: 'Kayak', href: 'https://www.kayak.com/cars', kayak: true },
];

export const links = {
  sprinter: 'https://gonctd.com/services/sprinter/',
  uber: 'https://www.uber.com',
  lyft: 'https://www.lyft.com',
  ontario: 'https://www.flyontario.com',
  orangeCounty: 'https://www.ocair.com',
  lax: 'https://www.flylax.com',
  palomar: 'https://www.sandiegocounty.gov/content/sdc/dpw/airports/palomar.html',
};

export { mapLinks };
