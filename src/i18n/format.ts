/**
 * Language-aware formatting shared by Astro pages and the React trip tools.
 * Pure functions only (no imports from Astro), so it is safe in the browser bundle.
 */
export type Lang = 'en' | 'es';
export const LANGS: Lang[] = ['en', 'es'];
/** BCP-47 tags used for <html lang> and Intl. */
export const htmlLang: Record<Lang, string> = { en: 'en', es: 'es-MX' };
const intl: Record<Lang, string> = { en: 'en-US', es: 'es-MX' };

const d = (iso: string) => new Date(iso + 'T12:00:00Z');
const f = (iso: string, lang: Lang, o: Intl.DateTimeFormatOptions) => d(iso).toLocaleDateString(intl[lang], { ...o, timeZone: 'UTC' });

/** "Saturday, August 28, 2027" / "sábado 28 de agosto de 2027" */
export const dateLong = (iso: string, lang: Lang) => {
  const s = f(iso, lang, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return lang === 'es' ? s.replace(',', '') : s;
};
/** "August 28, 2027" / "28 de agosto de 2027" */
export const dateShort = (iso: string, lang: Lang) => f(iso, lang, { month: 'long', day: 'numeric', year: 'numeric' });
/** "Fri, Aug 27" / "vie, 27 ago" */
export const dateTiny = (iso: string, lang: Lang) => f(iso, lang, { weekday: 'short', month: 'short', day: 'numeric' });
/** "Saturday, August 28" / "sábado, 28 de agosto" */
export const dateDay = (iso: string, lang: Lang) => f(iso, lang, { weekday: 'long', month: 'long', day: 'numeric' });

/** Replace {name} placeholders. Unknown placeholders are left as-is. */
export const fmt = (s: string, vars: Record<string, string | number> = {}) =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

export const dur = (m: number, lang: Lang) => {
  const h = lang === 'es' ? 'h' : 'hr';
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} ${h}${m % 60 ? ` ${m % 60} min` : ''}`;
};
const trim = (n: number) => n.toFixed(1).replace(/\.0$/, '');
/** Miles, plus kilometres in Spanish for guests who think in km. */
export const mi = (n: number, lang: Lang) => (lang === 'es' ? `${trim(n)} mi (${Math.round(n * 1.609344)} km)` : `${trim(n)} mi`);
export const miOnly = (n: number) => `${trim(n)} mi`;
export const kmOnly = (n: number) => `${Math.round(n * 1.609344)} km`;
export const money = (n: number, lang: Lang) =>
  (lang === 'es' ? 'US$' : '$') + Math.round(n).toLocaleString(intl[lang]);
export const nightsBetween = (a: string, b: string) => Math.max(0, Math.round((+new Date(b) - +new Date(a)) / 864e5));
