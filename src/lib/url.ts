/** Prefix an internal path with Astro's base (e.g. "/a-e") so links keep working if the site is ever served from a sub-path (on Cloudflare Pages the base is "/"). External URLs pass through. */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export function u(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const i = path.search(/[#?]/);
  const p = i === -1 ? path : path.slice(0, i);
  const rest = i === -1 ? '' : path.slice(i);
  const slashed = p.endsWith('/') || /\.[a-z0-9]+$/i.test(p) ? p : p + '/';
  return base + (slashed.startsWith('/') ? slashed : '/' + slashed) + rest;
}
