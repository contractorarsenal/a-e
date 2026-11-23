/**
 * ═══════════════════════════════════════════════════════════════════
 *  A + E — EDITABLE WEDDING FACTS (language-neutral)
 *  Use `null` for anything not yet confirmed: the site shows a tasteful
 *  "Details coming soon" state instead of inventing information.
 *
 *  Guest-facing wording lives in src/i18n/en.ts and src/i18n/es-MX.ts.
 *  Where YOU supply text here (arrival notes, schedule titles, FAQ answers…), give both languages:
 *      { en: 'Garden lawn', es: 'El jardín' }
 *  or a plain string when it is identical in both (e.g. a name).
 *  See WEDDING_CONTENT.md for the full list of open questions.
 * ═══════════════════════════════════════════════════════════════════
 */
import type { L10n } from '../i18n';

export const couple = {
  /** Decorative monogram and small branding. */
  initials: 'A + E',
  first: 'Adrian',
  second: 'Emma',
  /** Primary public-facing name (a proper noun: not translated). */
  display: 'Adrian & Emma',
};

export const wedding = {
  /** Local date of the wedding (venue time zone). Long/short dates are formatted per language from this. */
  dateISO: '2027-08-28',
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
  /** Apple Maps place link supplied by the couple. */
  appleMapsPlace: 'https://maps.apple/p/pVYvAG1Jc2gwNb',
  /** Arrival notes (gate, shuttle from parking, drop-off). null = "to be confirmed" until supplied. */
  arrivalNotes: null as L10n | null,
  /** Parking guidance specific to the wedding. null until confirmed with couple/venue. */
  parkingNotes: null as L10n | null,
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
 *   { time: '4:00 PM', title: { en: 'Ceremony', es: 'Ceremonia' }, note: { en: 'Garden lawn', es: 'En el jardín' } }
 */
export type ScheduleItem = { time: string; title: L10n; note?: L10n };
export const schedule: ScheduleItem[] = [];

/** Shuttle info — fill in only if the couple arranges one. */
export const shuttle = {
  arranged: false,
  details: null as L10n | null,
};

export const rsvp = {
  /** ISO date (YYYY-MM-DD) of the reply-by date, or null. Shown in the guest's language; the form closes after this day. */
  deadlineISO: null as string | null,
  /** Max additional guests a household may name on the public form. Invitations are reconciled against your guest list by hand. */
  maxAdditionalGuests: 3,
};

export const contact = {
  /** Public contact for guest questions. null until the couple chooses one. */
  email: null as string | null,
};

/** Story chapters. Empty = only the photographs are shown. */
export const story = {
  chapters: [] as { title: L10n; body: L10n }[],
};

/**
 * Answers for the FAQ items that need real wedding facts. Keep null until confirmed ("To be confirmed" is shown).
 * Keys are the FAQ ids in the dictionaries. (Parking comes from venue.parkingNotes; reply-by from rsvp.deadlineISO;
 * contact from contact.email.)
 */
export const faqAnswers: Record<'arrive' | 'dress' | 'kids' | 'plusone' | 'registry', L10n | null> = {
  arrive: null,
  dress: null,
  kids: null,
  plusone: null,
  registry: null,
};

/**
 * Optional sections — flip `enabled` to true and fill in the content (both languages).
 * Components for each already exist; nothing needs redesigning.
 */
export const optional = {
  registry: { enabled: false, links: [] as { label: L10n; href: string }[] },
  weekend: { enabled: false, events: [] as { when: L10n; title: L10n; note?: L10n }[] },
  nearby: { enabled: false, places: [] as { name: string; kind: L10n; note?: L10n; href?: string }[] },
  weddingParty: { enabled: false, members: [] as { name: string; role: L10n; note?: L10n }[] },
  photoSharing: { enabled: false, href: null as string | null },
};

/** Page order. Labels come from the dictionaries (t.nav[key]). Desktop shows `primaryNav`; the menu and footer show `allPages`. */
export type PageKey = 'wedding' | 'travel' | 'story' | 'faq';
export const primaryNav: { href: string; key: PageKey }[] = [
  { href: '/details', key: 'wedding' },
  { href: '/travel', key: 'travel' },
];
export const allPages: { href: string; key: PageKey }[] = [
  { href: '/details', key: 'wedding' },
  { href: '/travel', key: 'travel' },
  { href: '/story', key: 'story' },
  { href: '/faq', key: 'faq' },
];
/** The page slugs that exist in every language (used for localized routes and the language switcher). */
export const pageSlugs = ['details', 'travel', 'story', 'faq', 'rsvp'] as const;
