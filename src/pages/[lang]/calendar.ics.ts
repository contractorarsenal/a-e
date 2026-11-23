import type { APIRoute } from 'astro';
import { buildIcs } from '../../lib/calendar';
import { lp, type Lang } from '../../i18n';

export const getStaticPaths = () => [{ params: { lang: 'en' } }, { params: { lang: 'es' } }];
export const GET: APIRoute = ({ site, params }) => {
  const lang = params.lang as Lang;
  return new Response(buildIcs(new URL(lp(lang, '/'), site).href, lang), {
    headers: { 'content-type': 'text/calendar; charset=utf-8', 'content-disposition': 'attachment; filename="A-plus-E-wedding.ics"' },
  });
};
