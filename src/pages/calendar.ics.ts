import type { APIRoute } from 'astro';
import { buildIcs } from '../lib/calendar';
import { u } from '../lib/url';

export const GET: APIRoute = ({ site }) =>
  new Response(buildIcs(new URL(u('/'), site).href), {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': 'attachment; filename="A-plus-E-wedding.ics"',
    },
  });
