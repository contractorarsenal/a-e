import { faqAnswers, venue, fullAddress, rsvp, contact, wedding } from '../content/site';
import { getT, tx, dateLong, dateShort, fmt, mi, lp, type Lang } from '../i18n';
import geo from '../generated/geo.json';

export type FaqEntry = { id: string; q: string; a: string | null; link?: { href: string; label: string } };
const hrefs: Record<string, string> = { where: '/details#directions', stay: '/travel#stay', airport: '/travel#airports', car: '/travel#cars' };

/** Builds the localized FAQ. Anything not confirmed in src/content/site.ts comes back as null ("To be confirmed"). */
export function buildFaq(lang: Lang): FaqEntry[] {
  const t = getT(lang);
  const g = geo.airportToVenue as Record<string, { miles: number }>;
  return t.faq.items.map((it) => {
    let a: string | null = it.a || null;
    switch (it.id) {
      case 'where': a = fmt(it.a, { venue: venue.name, address: fullAddress }); break;
      case 'day': a = fmt(it.a, { date: dateLong(wedding.dateISO, lang) }); break;
      case 'airport': a = fmt(it.a, { crq: mi(g.CRQ.miles, lang), san: mi(g.SAN.miles, lang) }); break;
      case 'parking': a = venue.parkingNotes ? tx(venue.parkingNotes, lang) : null; break;
      case 'rsvp': a = rsvp.deadlineISO ? fmt(it.a, { date: dateShort(rsvp.deadlineISO, lang) }) : null; break;
      case 'contact': a = contact.email ? fmt(it.a, { email: contact.email }) : null; break;
      case 'arrive': case 'dress': case 'kids': case 'plusone': case 'registry': {
        const v = faqAnswers[it.id as keyof typeof faqAnswers];
        a = v ? tx(v, lang) : null; break;
      }
    }
    const href = hrefs[it.id];
    return { id: it.id, q: it.q, a, link: a && it.link && href ? { href: lp(lang, href), label: it.link } : undefined };
  });
}
