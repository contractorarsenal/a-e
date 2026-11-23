# Launch checklist

See **`WEDDING_CONTENT.md`** (what the couple must confirm) and **`RSVP_SETUP.md`** (the one account-creation step).

## Before sharing the link
- [ ] RSVP connected and tested in English and Spanish (`RSVP_SETUP.md`)
- [ ] Couple reviews `WEDDING_CONTENT.md`; fill the "unconfirmed" items as they are decided
- [ ] A native Spanish speaker (family member) reads `src/i18n/es-MX.ts` or the live `/es/` pages
- [ ] Re-check each hotel's own page for address, bookability and amenities (Hyatt at The Welk is a vacation-club resort; Best Western mentions a site redesign in 2027, so its link may change)
- [ ] Open the live site on a real phone in both languages: menu, language switch, RSVP, map, a booking link, calendar download
- [ ] Decide on `SITE_VISIBILITY` (noindex by default) and the group link (`PUBLIC_GUEST_GROUP_URL`; it is visible in the page's JavaScript, so it is a courtesy gate, not security)

## Hosting (Cloudflare Pages, already connected)
- Pushes to `main` deploy automatically to https://a-e.pages.dev/ (build `npm run build`, output `dist`, Node 22).
- Environment variables (Settings → Variables and secrets → Production) are build-time: **retry the deployment after changing one**.
- A leftover GitHub "pages-build-deployment" check may show red. It is unused; disable it in the repo's Settings → Pages.
