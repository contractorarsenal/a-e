# CLAUDE.md — Adrian & Emma wedding site

## Hard rules
- Never invent wedding facts (times, dress code, parking, registry, hotel rates/availability/blocks, drive times). Unknown ⇒ `null` in `src/content/*` ⇒ "Details coming soon".
- Never commit: `Photos/` originals, `.env`, guest lists, RSVP data, credentials. The repo is **public**.
- Never publish (enable Pages / run deploy) without the owner's approval.
- No fake success: RSVP confirmation only after the service returns 2xx. Hide features that need missing config (no endpoint ⇒ "RSVP opens soon").
- Do not modify other projects in AI-WORKSPACE. Do not touch `Photos/`.

## Stack & constraints
Astro 6 (static) + Tailwind 4 + TypeScript; one React island (`src/components/trip/`) with Leaflet. Hosted on **Cloudflare Pages** (native Git integration; push to `main` deploys; build `npm run build`, output `dist`, Node 22). Base path is `/` (SITE_URL `https://a-e.pages.dev`). Keep using `u()` from `src/lib/url.ts` for internal links so a sub-path would still work; `npm run verify` checks every internal reference resolves. Never add a GitHub Pages/Actions deploy or Wrangler.
`vite` is pinned via `overrides` (7.3.8) so Astro 6 and `@tailwindcss/vite` share one Vite. Don't upgrade Astro/Vite without testing the build.

## Design rules
Paper-cream ground, near-black text, one terracotta `clay` accent (the dress). Bodoni Moda (display) + Jost (text). No dark bands, arches, gradient overlays or scroll animation; avoid decorative overlines above every heading. Self-hosted via fontsource. Photographs as uncropped framed prints with captions, hairlines and whitespace over cards, progressive disclosure (`<details>`) for secondary info, one primary action per view; restrained rectangular buttons; no gold gradients, clip-art or decorative animation. Mobile-first: test 320 → 1440, no horizontal overflow, tap targets ≥ 44px, respect `prefers-reduced-motion`. Faces/hands/rings must never be cropped (tune `position` on `<Picture>`).

## Languages (English + Mexican Spanish)
- Routes are `/en/…` and `/es/…` (same slugs); `/` is the first-visit chooser and forwards returning visitors (localStorage `ae-lang`). Old `/travel/`-style links forward too.
- All guest-facing wording lives in `src/i18n/en.ts` (defines the type) and `src/i18n/es-MX.ts` (must match; `npm run check` fails otherwise). Never hard-code visible text in a component. Use `useLang(Astro)` in Astro files and `useI18n()` in the React island.
- Facts the couple edits (`src/content/site.ts`) are language-neutral or `{ en, es }` (`L10n`). Trip state stores codes only, so switching language never loses selections.
- Voice: warm, informal "tú", Mexican vocabulary; proper nouns unchanged. Sans (Source Sans 3) for everything people read; Bodoni Moda only for the names and page titles. Body ≥17px, nothing under 15px, tap targets ≥44px.

## Where things live
- Content: `src/content/site.ts`, `src/content/travel.ts`; photo captions/alt text in the dictionaries (`photos`); photo list in `scripts/optimize-images.mjs`.
- Build-time config: `src/lib/env.ts` + `.env.example` (all public).
- Generated (committed): `src/generated/images.json` (`npm run images`), `src/generated/geo.json` (`npm run geo`, OSM geocoding + OSRM routing, approximate).
- Travel numbers must stay labeled "approximate / typical conditions".

## Checks
`npm run verify` (astro check + build + link check). For browser testing, load pages in iframes at 320/375/390/430/768/1024/1440 and check `scrollWidth <= clientWidth`.
