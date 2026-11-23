import { couple, wedding, venue, fullAddress } from '../content/site';
import { getT, fmt, type Lang } from '../i18n';

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const compact = (d: string) => d.replace(/-/g, '');
const hm = (t: string) => t.replace(':', '') + '00';
const nextDay = (iso: string) => {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
const fold = (line: string) => (line.match(/.{1,73}/g) ?? ['']).join('\r\n ');

export const isTimed = () => !!wedding.calendarStart;
export const eventTitle = (lang: Lang) => fmt(getT(lang).calendar[isTimed() ? 'title' : 'titleReminder'], { couple: couple.display });
export const eventDescription = (siteUrl: string, lang: Lang) =>
  fmt(getT(lang).calendar[isTimed() ? 'descTimed' : 'descReminder'], { couple: couple.display, venue: venue.name, url: siteUrl });

export function buildIcs(siteUrl: string, lang: Lang): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//A+E Wedding//${lang.toUpperCase()}`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  if (isTimed()) {
    lines.push(
      'BEGIN:VTIMEZONE', 'TZID:America/Los_Angeles',
      'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0800', 'TZOFFSETTO:-0700', 'TZNAME:PDT', 'DTSTART:19700308T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT',
      'BEGIN:STANDARD', 'TZOFFSETFROM:-0700', 'TZOFFSETTO:-0800', 'TZNAME:PST', 'DTSTART:19701101T020000', 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD',
      'END:VTIMEZONE',
    );
  }
  lines.push('BEGIN:VEVENT', `UID:wedding-${wedding.dateISO}@ae-wedding`, `DTSTAMP:${stamp}`);
  if (isTimed()) {
    const end = wedding.calendarEnd ?? wedding.calendarStart!;
    lines.push(
      `DTSTART;TZID=${wedding.timeZone}:${compact(wedding.dateISO)}T${hm(wedding.calendarStart!)}`,
      `DTEND;TZID=${wedding.timeZone}:${compact(wedding.dateISO)}T${hm(end)}`,
    );
  } else {
    lines.push(`DTSTART;VALUE=DATE:${compact(wedding.dateISO)}`, `DTEND;VALUE=DATE:${compact(nextDay(wedding.dateISO))}`, 'TRANSP:TRANSPARENT');
  }
  lines.push(
    `SUMMARY:${esc(eventTitle(lang))}`,
    `LOCATION:${esc(`${venue.name}, ${fullAddress}`)}`,
    `DESCRIPTION:${esc(eventDescription(siteUrl, lang))}`,
    `URL:${siteUrl}`,
    'END:VEVENT', 'END:VCALENDAR',
  );
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function googleCalendarUrl(siteUrl: string, lang: Lang): string {
  const d = compact(wedding.dateISO);
  const dates = isTimed()
    ? `${d}T${hm(wedding.calendarStart!)}/${d}T${hm(wedding.calendarEnd ?? wedding.calendarStart!)}`
    : `${d}/${compact(nextDay(wedding.dateISO))}`;
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(lang),
    dates,
    location: `${venue.name}, ${fullAddress}`,
    details: eventDescription(siteUrl, lang),
  });
  if (isTimed()) p.set('ctz', wedding.timeZone);
  return `https://calendar.google.com/calendar/render?${p}`;
}
