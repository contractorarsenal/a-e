import type { APIRoute } from 'astro';
import { visibility } from '../lib/env';
import { u } from '../lib/url';

const paths = ['/', '/story', '/details', '/travel', '/rsvp', '/faq'];
export const GET: APIRoute = ({ site }) => {
  const urls = (visibility() === 'public' ? paths : []).map((p) => `  <url><loc>${new URL(u(p), site).href}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
