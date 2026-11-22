# Adrian & Emma — Wedding Website

Saturday, August 28, 2027 · Ethereal Gardens, Escondido, California

A static, mobile-first wedding site built with **Astro 6, TypeScript and Tailwind CSS 4**, with one React island (the trip planner and map). It is designed to be hosted free on **GitHub Pages** at `https://contractorarsenal.github.io/a-e/`.

> **Not published yet.** GitHub Pages is intentionally *not* enabled and the deploy job is gated. See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321/a-e/   (note the /a-e/ base path)
npm run verify       # type-check + production build + internal link/base-path check
npm run preview      # serve the production build
```

Requires Node 22.12+.

## What's in the site

| Page | Path | Notes |
|---|---|---|
| Home | `/` | Hero with real photos, countdown, details at a glance |
| Our Story | `/story/` | Editorial layout + gallery with fullscreen lightbox (keyboard, swipe) |
| Details | `/details/` | Date, venue, schedule (editable), directions, click-to-load map, calendar download |
| Travel | `/travel/` | **Plan Your Trip**: hotel map/list, compare, trip planner, budget; airports, cars, rides, tips, guest group |
| RSVP | `/rsvp/` | Posts to an external form service (see below) |
| FAQ | `/faq/` | Answers come from `src/content/site.ts`; unknown ones show "Details coming soon" |

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

Trade-off: a static site cannot hold a private guest list or enforce invitation codes. The form lets a guest name up to 3 additional guests (`rsvp.maxAdditionalGuests`), plus an *optional* invitation code, and the couple reconciles submissions against the guest list. If a controlled guest list is needed later, move to a small backend (e.g. Supabase) and keep the static front end.

## Travel concierge: how the numbers are made

- Hotel and airport coordinates: geocoded once from street addresses (OpenStreetMap Nominatim). The venue pin comes from the couple's Apple Maps link.
- Driving distance/time and route lines: calculated from road data (OSRM on OpenStreetMap). They are **approximate, typical-conditions** figures and are labeled that way. Regenerate with `npm run geo`.
- No prices, availability, rates, or room blocks appear anywhere. "Book" buttons open each hotel's own site.
- Guest preferences are saved in the guest's own browser only (`localStorage`). They do not sync between devices and are never sent anywhere.
- Hotel photos are not included (no licensed or authorized images were available). Drop approved images in `public/hotels/` and set `photo` in `travel.ts`.
- Map tiles: OpenStreetMap standard tiles (fine for a low-traffic site; swap the URL in `MapView.tsx` for Mapbox/Stadia/MapTiler if traffic grows).

## Images

Originals live in `Photos/` and are **never modified or committed** (the repository is public). `npm run images` writes optimized AVIF/WebP/JPEG copies to `public/img/` and `src/generated/images.json`. Add a photo by adding it to the `PHOTOS` map in `scripts/optimize-images.mjs`, then to `src/lib/photos.ts`.

## Deployment (GitHub Pages) — gated

`.github/workflows/site.yml` builds, type-checks and link-checks on every push/PR. The `deploy` job runs only when **all** of these are true: Pages source is set to "GitHub Actions", repo variable `ENABLE_DEPLOY=true`, and the workflow is run manually with "deploy" ticked. Details in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

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
