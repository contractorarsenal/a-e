# Adrian & Emma — Wedding Website

Saturday, August 28, 2027 · Ethereal Gardens, Escondido, California

A static, mobile-first wedding site built with **Astro 6, TypeScript and Tailwind CSS 4**, with one React island (the trip planner and map). It is hosted free on **Cloudflare Pages** at https://a-e.pages.dev/ and deploys automatically on every push to `main`.

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321/
npm run verify       # type-check + production build + internal link/base-path check
npm run preview      # serve the production build
```

Requires Node 22.12+.

## What's in the site

| Page | Path | Notes |
|---|---|---|
| Home | `/` | Names, date, place, one photograph, a short photo series, three wayfinding rows |
| The Wedding | `/details/` | Date, schedule (editable), venue, Apple/Google directions, map on demand, calendar download |
| Travel & Stay | `/travel/` | Hotels with approximate drive times and Book/Directions; airports, rides, Airbnb/Vrbo; optional collapsed map, compare, trip planner and budget |
| RSVP | `/rsvp/` | Posts to an external form service (see below); shows "not open yet" until configured |
| Our Story | `/story/` | Photo series with lightbox (keyboard, swipe) |
| Questions | `/faq/` | Answers come from `src/content/site.ts`; unknown ones show "To be confirmed" |

Navigation: desktop shows *The Wedding*, *Travel & Stay* and *RSVP*; Our Story and Questions are in the mobile menu, footer and page links. Design research and decisions: [DESIGN_RESEARCH.md](DESIGN_RESEARCH.md).

## Editing content (no component edits needed)

- `src/content/site.ts`: names, date, venue, schedule, RSVP deadline, story, FAQ, optional sections (registry, weekend, nearby, wedding party, photo sharing).
- `src/content/travel.ts`: hotels, airports, rental links, guidance.
- `src/lib/photos.ts`: photo captions and alt text.
- Anything `null` or empty shows a tasteful "coming soon" state or is hidden. See [WEDDING_CONTENT.md](WEDDING_CONTENT.md).

## Configuration (build-time, public)

Copy `.env.example` to `.env` for local use. On GitHub, set the same names as **repository Variables** (Settings → Secrets and variables → Actions → Variables). They are baked into the static site, so never put real secrets there.

| Variable | Purpose |
|---|---|
| `SITE_VISIBILITY` | `public` to allow search engines. Anything else = `noindex` (default). |
| `PUBLIC_RSVP_ENDPOINT` | External form endpoint (e.g. Formspree). **Blank ⇒ the RSVP page says "RSVP opens soon" (no fake form).** |
| `PUBLIC_GUEST_GROUP_URL` | Approved WhatsApp (or similar) invite link. Blank ⇒ shows "Group link coming soon". |
| `PUBLIC_GUEST_GROUP_GATE` | `rsvp` (default: link appears only after confirming attendance) or `public`. |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Optional privacy-friendly analytics. Blank ⇒ no analytics. |
| `SITE_URL`, `BASE_PATH` | Only for a custom domain (`BASE_PATH=""`). |

## RSVP

The site is static, so there is no server or database. RSVPs go to an **external form service**:

1. Create a free form at [Formspree](https://formspree.io) (or any service that accepts a JSON `POST` and answers `2xx` on success).
2. Enable its spam protection, and notifications to the couple's email.
3. Set `PUBLIC_RSVP_ENDPOINT` to the form URL (`https://formspree.io/f/xxxxxxxx`).

The form validates on the client, includes a honeypot, and **only shows the confirmation after the service returns a success status.** Network or service errors are shown honestly, with nothing saved locally.

Trade-off: a static site cannot hold a private guest list or enforce invitation codes. The form lets a guest name up to 3 additional guests (`rsvp.maxAdditionalGuests`); nothing verifies the names or party size, so the couple must reconcile submissions against the guest list themselves. If a controlled guest list is needed later, move to a small backend (e.g. Supabase) and keep the static front end.

## Travel concierge: how the numbers are made

- Hotel and airport coordinates: geocoded once from street addresses (OpenStreetMap Nominatim). The venue pin comes from the couple's Apple Maps link.
- Driving distance/time and route lines: calculated from road data (OSRM on OpenStreetMap). They are **approximate, typical-conditions** figures and are labeled that way. Regenerate with `npm run geo`.
- No prices, availability, rates, or room blocks appear anywhere. "Book" buttons open each hotel's own site.
- Guest preferences are saved in the guest's own browser only (`localStorage`). They do not sync between devices and are never sent anywhere.
- Hotel photos are not included (no licensed or authorized images were available). Drop approved images in `public/hotels/` and set `photo` in `travel.ts`.
- Map tiles: OpenStreetMap standard tiles (fine for a low-traffic site; swap the URL in `MapView.tsx` for Mapbox/Stadia/MapTiler if traffic grows).

## Images

Originals live in `Photos/` and are **never modified or committed** (the repository is public). `npm run images` writes optimized AVIF/WebP/JPEG copies to `public/img/` and `src/generated/images.json`. Add a photo by adding it to the `PHOTOS` map in `scripts/optimize-images.mjs`, then to `src/lib/photos.ts`.

## Deployment: Cloudflare Pages (native Git integration)

`git push` to `main` → Cloudflare Pages builds and publishes https://a-e.pages.dev/. There is no GitHub Actions deploy and no Wrangler.

Required settings in the Cloudflare dashboard (Workers & Pages → a-e → Settings → Build):

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | 22 (pinned by `.node-version`; or set env var `NODE_VERSION=22`) |
| Framework preset | None is fine |

> **If these are blank, Cloudflare logs "No build command specified. Skipping build step", uploads the raw repository, and every URL returns 404.** That was the original outage.

Environment variables (Settings → Variables and secrets → *Production*; all optional, all public once built):
`SITE_URL` (default `https://a-e.pages.dev`), `BASE_PATH` (default `/`), `SITE_VISIBILITY`, `PUBLIC_RSVP_ENDPOINT`, `PUBLIC_GUEST_GROUP_URL`, `PUBLIC_GUEST_GROUP_GATE`, `PUBLIC_PLAUSIBLE_DOMAIN`. See `.env.example`. Changing a variable needs a new deployment (Deployments → Retry, or push a commit).

`.github/workflows/ci.yml` only runs checks (`npm run verify`: type-check, build, internal link check). `public/_headers` sets security and long-cache headers.

## Project structure

```
src/
  content/   site.ts, travel.ts, places.json   ← edit these
  components/ Nav, Footer, Gallery, Schedule, RsvpForm, … and trip/ (React island)
  pages/     index, story, details, travel, rsvp, faq, 404, calendar.ics, robots.txt, sitemap.xml
  lib/       env.ts (build-time config), url.ts (base-path helper), calendar.ts, photos.ts
  generated/ images.json, geo.json (generated; committed)
scripts/     optimize-images, build-geo, check-links
public/img/  optimized photos (committed)
```


## Languages

The site is bilingual: English (`/en/`) and Mexican Spanish (`/es/`). `/` asks first-time visitors to choose (nothing is guessed from location), remembers the choice in `localStorage` (`ae-lang`), and sends returning visitors straight to their language. Direct links to `/en/…` or `/es/…` always work without any saved choice. The EN / ES control in the header switches language on the same page and section; trip-planner selections (localStorage) and an unsent RSVP draft (sessionStorage, this tab only) carry over.

Edit wording in `src/i18n/en.ts` and `src/i18n/es-MX.ts` (TypeScript fails the build check if a key is missing in either). Wedding facts such as times, parking and FAQ answers go in `src/content/site.ts` as `{ en: '…', es: '…' }`.

## Our Story photos

Older photographs are listed in `scripts/optimize-images.mjs` (originals in `Photos/` are never modified or committed). They are small files, so they are never upscaled or sharpened, and they are shown uncropped at their natural proportions. Captions are intentionally undated.
