import { en, type Dict } from './en';
import { esMX } from './es-MX';
import { u } from '../lib/url';
import { LANGS, htmlLang, type Lang } from './format';

export { LANGS, htmlLang, type Lang, type Dict };
export * from './format';

export const dictionaries: Record<Lang, Dict> = { en, es: esMX };
export const getT = (lang: Lang): Dict => dictionaries[lang];
export const isLang = (s: unknown): s is Lang => s === 'en' || s === 'es';
export const otherLang = (l: Lang): Lang => (l === 'en' ? 'es' : 'en');

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Language of a localized URL (/en/… or /es/…). Falls back to English. */
export function langFromUrl(url: URL): Lang {
  const seg = url.pathname.slice(base.length).split('/')[1];
  return isLang(seg) ? seg : 'en';
}
/** Localized internal link: lp('es', '/travel#stay') → /es/travel/#stay (respecting the site base). */
export const lp = (lang: Lang, path: string) => u(`/${lang}${path === '/' ? '' : path}`);
/** The same page in the other language (keeps the path; the hash is re-attached in the browser). */
export function swapLangPath(url: URL, to: Lang): string {
  const rest = url.pathname.slice(base.length).split('/').slice(2).join('/');
  return u(`/${to}/${rest}`);
}
/** Choose a string from an editable { en, es } value (or a plain string used in both languages). */
export type L10n = string | { en: string; es: string };
export const tx = (v: L10n, lang: Lang): string => (typeof v === 'string' ? v : v[lang]);

/** One call gives a page everything it needs: Astro components call useLang(Astro). */
export function useLang(Astro: { url: URL }) {
  const lang = langFromUrl(Astro.url);
  return { lang, t: getT(lang), l: (p: string) => lp(lang, p) };
}
