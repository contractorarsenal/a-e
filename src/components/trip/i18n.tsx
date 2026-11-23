import { createContext, useContext, type ReactNode } from 'react';
import { fmt, dur, mi, money, dateTiny, dateDay, nightsBetween, type Lang } from '../../i18n/format';
import type { Dict } from '../../i18n/en';

export type TripT = Dict['trip'];
type Ctx = {
  lang: Lang;
  t: TripT;
  newTab: string;
  fmt: typeof fmt;
  dur: (m: number) => string;
  mi: (n: number) => string;
  money: (n: number) => string;
  tiny: (iso: string) => string;
  day: (iso: string) => string;
  nights: (a: string, b: string) => number;
};
const C = createContext<Ctx>(null as unknown as Ctx);
export const useI18n = () => useContext(C);

export function I18nProvider({ lang, t, newTab, children }: { lang: Lang; t: TripT; newTab: string; children: ReactNode }) {
  const v: Ctx = {
    lang, t, newTab, fmt,
    dur: (m) => dur(m, lang), mi: (n) => mi(n, lang), money: (n) => money(n, lang),
    tiny: (iso) => dateTiny(iso, lang), day: (iso) => dateDay(iso, lang), nights: nightsBetween,
  };
  return <C.Provider value={v}>{children}</C.Provider>;
}

/** Replace {key} placeholders with React nodes (for sentences that contain a link or bold text). */
export function rich(s: string, map: Record<string, ReactNode>): ReactNode[] {
  return s.split(/(\{\w+\})/g).map((part, i) => {
    const m = /^\{(\w+)\}$/.exec(part);
    return m && m[1] in map ? <span key={i} style={{ display: 'contents' }}>{map[m[1]]}</span> : part;
  });
}

/** Screen-reader hint for links that open a new tab. */
export const NewTab = () => { const { newTab } = useI18n(); return <span className="sr-only"> {newTab}</span>; };
