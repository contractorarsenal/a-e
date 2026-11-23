import type { APIRoute } from 'astro';
import { visibility } from '../lib/env';
import { lp, LANGS, htmlLang } from '../i18n';
import { pageSlugs } from '../content/site';

export const GET: APIRoute = ({ site }) => {
  const abs = (p: string) => new URL(p, site).href;
  const pages = ['', ...pageSlugs.map((s) => '/' + s)];
  const urls = (visibility() === 'public' ? pages : []).flatMap((p) =>
    LANGS.map((lang) => {
      const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${htmlLang[l]}" href="${abs(lp(l, p || '/'))}"/>`).join('');
      return `  <url><loc>${abs(lp(lang, p || '/'))}</loc>${alts}</url>`;
    }),
  ).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
