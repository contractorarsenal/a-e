# Launch checklist

## Before the first public link
- [ ] Confirm **who is who** in photo captions/alt text if names should be attached (currently neutral: "one partner…").
- [ ] Create the RSVP form (Formspree or similar) → set repo variable `PUBLIC_RSVP_ENDPOINT`. Submit a real test RSVP and confirm the couple receives it.
- [ ] Confirm the form service's spam protection and notification email are on.
- [ ] Fill in confirmed times, dress code, parking, children policy, RSVP deadline, contact email (see `WEDDING_CONTENT.md`).
- [ ] Re-check every hotel on its own site in a normal browser (the brand sites blocked automated checks): address, that the property takes public bookings (Hyatt Welk is a vacation-club resort), amenities, booking URL. Best Western notes a site redesign in January 2027, so its URL may change.
- [ ] Spot-check the drive times in Apple/Google Maps; re-run `npm run geo` if anything changes.
- [ ] Add authorized hotel photos or leave the placeholders.
- [ ] Decide on the group chat link; set `PUBLIC_GUEST_GROUP_URL` only when approved. (The URL is visible in the site's JavaScript. It is a courtesy gate, not security.)
- [ ] Decide on privacy: keep `SITE_VISIBILITY` unset (noindex) for link-only sharing, or set `public` for search engines. GitHub Pages cannot password-protect; for that use Cloudflare Access/Netlify.
- [ ] Review the OpenStreetMap tile usage / attribution, or switch map provider.

## Publishing to GitHub Pages (needs your approval)
1. Repo **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Secrets and variables → Actions → Variables**: add `ENABLE_DEPLOY=true` and the variables from `.env.example` you want.
3. **Actions → "Build & (gated) deploy" → Run workflow**, tick **deploy**.
4. Open https://contractorarsenal.github.io/a-e/ and re-test on a phone: nav, RSVP, gallery, map, booking links, calendar download.
5. Note: `robots.txt` on a project site lives under `/a-e/`, which crawlers ignore. The `<meta name="robots" content="noindex">` tag is what keeps the site out of search results until `SITE_VISIBILITY=public`.
