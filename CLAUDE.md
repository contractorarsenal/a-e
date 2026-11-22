# CLAUDE.md — Adrian & Emma wedding site

## Hard rules
- Never invent wedding facts (times, dress code, parking, registry, hotel rates/availability/blocks, drive times). Unknown ⇒ `null` in `src/content/*` ⇒ "Details coming soon".
- Never commit: `Photos/` originals, `.env`, guest lists, RSVP data, credentials. The repo is **public**.
- Never publish (enable Pages / run deploy) without the owner's approval.
- No fake success: RSVP confirmation only after the service returns 2xx. Hide features that need missing config (no endpoint ⇒ "RSVP opens soon").
- Do not modify other projects in AI-WORKSPACE. Do not touch `Photos/`.

## Stack & constraints
Astro 6 (static) + Tailwind 4 + TypeScript; one React island (`src/components/trip/`) with Leaflet. Hosted on GitHub Pages under `/a-e/`. **Every internal link and asset must go through `u()` from `src/lib/url.ts`** (or `import.meta.env.BASE_URL` in React). `npm run verify` fails if any link escapes the base path.
`vite` is pinned via `overrides` (7.3.8) so Astro 6 and `@tailwindcss/vite` share one Vite. Don't upgrade Astro/Vite without testing the build.

## Design rules
Warm ivory/champagne/taupe/charcoal + muted sage. Cormorant Garamond (display) + Jost (text), self-hosted via fontsource. Hairlines and whitespace over cards; restrained rectangular buttons; no gold gradients, clip-art or decorative animation. Mobile-first: test 320 → 1440, no horizontal overflow, tap targets ≥ 44px, respect `prefers-reduced-motion`. Faces/hands/rings must never be cropped (tune `position` on `<Picture>`).

## Where things live
- Content: `src/content/site.ts`, `src/content/travel.ts`, `src/lib/photos.ts`.
- Build-time config: `src/lib/env.ts` + `.env.example` (all public).
- Generated (committed): `src/generated/images.json` (`npm run images`), `src/generated/geo.json` (`npm run geo`, OSM geocoding + OSRM routing, approximate).
- Travel numbers must stay labeled "approximate / typical conditions".

## Checks
`npm run verify` (astro check + build + link check). For browser testing, load pages in iframes at 320/375/390/430/768/1024/1440 and check `scrollWidth <= clientWidth`.
