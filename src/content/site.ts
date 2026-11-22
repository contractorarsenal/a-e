/**
 * ═══════════════════════════════════════════════════════════════════
 *  A + E — EDITABLE WEDDING CONTENT
 *  Everything guest-facing that may change lives here (and in travel.ts).
 *  Use `null` for anything not yet confirmed: the site shows a tasteful
 *  "Details coming soon" state instead of inventing information.
 *  See WEDDING_CONTENT.md for the full list of open questions.
 * ═══════════════════════════════════════════════════════════════════
 */

export const couple = {
  /** Decorative monogram and small branding. */
  initials: 'A + E',
  first: 'Adrian',
  second: 'Emma',
  /** Primary public-facing name. */
  display: 'Adrian & Emma',
  displayPlus: 'Adrian + Emma',
  tagline: 'Together is our favorite place to be.',
};

export const wedding = {
  /** Local date of the wedding (venue time zone). */
  dateISO: '2027-08-28',
  dateLong: 'Saturday, August 28, 2027',
  dateShort: 'August 28, 2027',
  timeZone: 'America/Los_Angeles',
  /** Offset in force on the wedding date (PDT). Used by the countdown. */
  utcOffset: '-07:00',
  cityLine: 'Escondido, California',

  /**
   * Confirmed clock times, 24h "HH:MM" (venue local time), or null.
   * When `calendarStart` is set the .ics download becomes a timed event;
   * until then it is an all-day *date reminder*.
   */
  calendarStart: null as string | null,
  calendarEnd: null as string | null,
};

export const venue = {
  name: 'Ethereal Gardens',
  street: '8561 W Lilac Rd',
  city: 'Escondido',
  region: 'CA',
  postal: '92026',
  country: 'United States',
  website: 'https://trademarkvenues.com/ethereal-gardens/',
  /** Apple Maps place link supplied by the couple. */
  appleMapsPlace: 'https://maps.apple/p/pVYvAG1Jc2gwNb',
  /** Short, factual description. Only add what the venue/couple has confirmed. */
  blurb:
    'Ethereal Gardens is a private garden venue on 40 acres in Escondido, California.',
  /** Arrival notes (gate, shuttle from parking, drop-off). null = hidden until confirmed. */
  arrivalNotes: null as string | null,
  /** Parking guidance specific to the wedding. null until confirmed with couple/venue. */
  parkingNotes: null as string | null,
};

export const fullAddress = `${venue.street}, ${venue.city}, ${venue.region} ${venue.postal}`;
export const addressLines = [venue.street, `${venue.city}, ${venue.region} ${venue.postal}`, venue.country];

const q = encodeURIComponent(`${venue.name}, ${fullAddress}`);
const qAddr = encodeURIComponent(fullAddress);
export const mapLinks = {
  appleDirections: `https://maps.apple.com/?daddr=${qAddr}&dirflg=d`,
  applePlace: venue.appleMapsPlace,
  googleDirections: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
  googlePlace: `https://www.google.com/maps/search/?api=1&query=${q}`,
  googleEmbed: `https://www.google.com/maps?q=${q}&output=embed`,
};

/**
 * Wedding-day schedule. Add confirmed items; nothing is shown until you do.
 * Example item:
 *   { time: '4:00 PM', title: 'Ceremony', note: 'Garden lawn' }
 */
export type ScheduleItem = { time: string; title: string; note?: string };
export const schedule: ScheduleItem[] = [];

/** Shuttle info — fill in only if the couple arranges one. */
export const shuttle = {
  arranged: false,
  details: null as string | null,
};

export const rsvp = {
  /** e.g. 'June 1, 2027' once confirmed. */
  deadline: null as string | null,
  /** ISO date (YYYY-MM-DD). If set, the server stops accepting RSVPs after this day. */
  deadlineISO: null as string | null,
  /** Max additional guests a household may name on the public form. Invitations are reconciled against your guest list by hand. */
  maxAdditionalGuests: 3,
  contactNote: 'Questions about your invitation? We will share a contact here soon.',
};

export const contact = {
  /** Public contact for guest questions. null until the couple chooses one. */
  email: null as string | null,
};

/** Story copy. Keep it to what the couple has confirmed; the photos carry the feeling for now. */
export const story = {
  eyebrow: 'Our Story',
  headline: 'The moment we said yes.',
  /** Only describes what the photographs show — add the real story below when ready. */
  intro:
    'A beach at golden hour, flower leis, and a question asked on one knee. These are the photographs from the day we got engaged.',
  /** Add paragraphs of the couple's real story here. Empty array = section is omitted. */
  chapters: [] as { title: string; body: string }[],
};

export const faq: { q: string; a: string | null; link?: { href: string; label: string } }[] = [
  {
    q: 'Where is the wedding?',
    a: `${venue.name}, ${fullAddress}.`,
    link: { href: '/details#directions', label: 'Directions' },
  },
  { q: 'What day is it?', a: `${wedding.dateLong}.` },
  { q: 'What time should we arrive?', a: null },
  {
    q: 'Is parking available?',
    a: venue.parkingNotes,
  },
  { q: 'What should we wear?', a: null },
  {
    q: 'Where should we stay?',
    a: 'Escondido and San Marcos are the closest places to stay. We have collected hotels and short-term rental searches for you.',
    link: { href: '/travel#stay', label: 'Where to stay' },
  },
  {
    q: 'What is the closest airport?',
    a: 'San Diego International Airport (SAN) is the main airport for most guests. See the travel page for alternatives and how to get to Escondido.',
    link: { href: '/travel#airports', label: 'Airports' },
  },
  {
    q: 'Should I rent a car?',
    a: 'Most guests will find a rental car the simplest way to get to and from Escondido. We cannot promise rideshare availability from the venue late in the evening, so having your own car (or sharing one) is the most dependable plan.',
    link: { href: '/travel#cars', label: 'Rental cars & rides' },
  },
  { q: 'Are children invited?', a: null },
  {
    q: 'Can I bring a plus-one?',
    a: 'Your invitation lists exactly who is included, and the RSVP form shows the same names, so you will always know who is invited.',
    link: { href: '/rsvp', label: 'RSVP' },
  },
  {
    q: 'When should I RSVP?',
    a: rsvp.deadline ? `Please reply by ${rsvp.deadline}.` : null,
  },
  { q: 'Is there a wedding registry?', a: null },
  {
    q: 'Who should I contact with questions?',
    a: contact.email ? `Email us at ${contact.email}.` : null,
  },
];

/**
 * Optional sections — flip `enabled` to true and fill in the content.
 * Components for each already exist; nothing needs redesigning.
 */
export const optional = {
  registry: {
    enabled: false,
    intro: 'Your presence is the gift. If you wish to give something, we have gathered a few ideas.',
    links: [] as { label: string; href: string }[],
  },
  weekend: {
    enabled: false,
    intro: 'Making a weekend of it? Here is what is happening around the wedding.',
    events: [] as { when: string; title: string; note?: string }[],
  },
  nearby: {
    enabled: false,
    intro: 'A few of our favorite places to eat and explore nearby.',
    places: [] as { name: string; kind: string; note?: string; href?: string }[],
  },
  weddingParty: {
    enabled: false,
    members: [] as { name: string; role: string; note?: string }[],
  },
  photoSharing: {
    enabled: false,
    intro: 'Share your photos from the weekend.',
    href: null as string | null,
  },
  /** Spanish / bilingual support: add a locale dictionary in src/lib/i18n.ts, then enable. */
  spanish: { enabled: false },
};

export const nav = [
  { href: '/story', label: 'Our Story' },
  { href: '/details', label: 'Details' },
  { href: '/travel', label: 'Travel' },
  { href: '/faq', label: 'FAQ' },
];
