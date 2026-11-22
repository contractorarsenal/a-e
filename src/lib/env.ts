/**
 * Build-time configuration (this is a static site: values are baked in when `astro build` runs).
 * On GitHub Actions, set these as repository *Variables* (Settings → Secrets and variables → Actions → Variables).
 * Only put values here that are safe to be public — everything below ends up in the published HTML/JS.
 */
const e = (import.meta.env ?? {}) as Record<string, string | undefined>;
const get = (k: string) => {
  const v = (typeof process !== 'undefined' ? process.env[k] : undefined) ?? e[k];
  return v && v.trim() !== '' ? v.trim() : undefined;
};

export type Visibility = 'public' | 'noindex';
/** noindex (default) hides the site from search engines until you set SITE_VISIBILITY=public. */
export const visibility = (): Visibility => (get('SITE_VISIBILITY') === 'public' ? 'public' : 'noindex');

/** External form endpoint, e.g. a Formspree URL: https://formspree.io/f/xxxxxxxx */
export const rsvpEndpoint = () => get('PUBLIC_RSVP_ENDPOINT');
/** Approved group-chat invite URL (WhatsApp etc.). Empty = feature disabled. */
export const groupUrl = () => get('PUBLIC_GUEST_GROUP_URL');
export const plausibleDomain = () => get('PUBLIC_PLAUSIBLE_DOMAIN');
/** 'rsvp' = link appears only after someone confirms attendance (default). 'public' = shown on the Travel page.
 *  Note: this is a static site, so the URL is present in the published JavaScript either way — it is a courtesy gate, not security. */
export const groupGate = (): 'rsvp' | 'public' => (get('PUBLIC_GUEST_GROUP_GATE') === 'public' ? 'public' : 'rsvp');
