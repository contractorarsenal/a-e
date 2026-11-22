import type { APIRoute } from 'astro';
import { visibility } from '../lib/env';
import { u } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const open = visibility() === 'public';
  const body = open
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL(u('/sitemap.xml'), site).href}\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
