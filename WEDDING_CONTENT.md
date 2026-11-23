# Wedding content: what is confirmed (for Adrian & Emma to review)

Everything guest-facing is edited in `src/content/site.ts` (facts) and `src/i18n/en.ts` + `src/i18n/es-MX.ts` (wording). Anything unknown stays `null` and the site shows "To be confirmed" / "Details coming soon". Nothing below has been invented.

## ✅ Confirmed (live now)
- [x] Adrian & Emma, together since 2013
- [x] Saturday, August 28, 2027
- [x] Ethereal Gardens, 8561 W Lilac Rd, Escondido, CA 92026 (Apple Maps link supplied by the couple)
- [x] The Our Story text ("Through it all, together.") and the engagement photographs, as supplied by the couple

## 🟡 Provided, awaiting the couple's final approval
- [ ] **Early-years line** (met at Snohomish High School, stayed together through college and university, moved to LA together). **Hidden on the live site** until `story.earlyYears.approved` is set to `true` in `src/content/site.ts`.
- [ ] Spanish wording throughout: written by Claude in natural Mexican Spanish and **not yet reviewed by a native speaker**.
- [ ] Photo captions/alt text (neutral and undated by design). Say if you want names or dates added.
- [ ] Hotel list, descriptions and drive times: my research; approximate; amenities "as reported". Hotels are not partners and no rates/availability/room blocks are claimed. Re-check each hotel's own page before launch.

## ⬜ Unconfirmed (shown as "To be confirmed" / "Details coming soon", or hidden)
| Item | Where to fill in |
|---|---|
| Ceremony start time | `schedule`, `wedding.calendarStart/End` (calendar file is an all-day reminder until set) |
| Reception schedule | `schedule` |
| Guest arrival time | `faqAnswers.arrive` |
| Dress code | `faqAnswers.dress` |
| Parking arrangements | `venue.parkingNotes` |
| RSVP deadline | `rsvp.deadlineISO` |
| Children policy | `faqAnswers.kids` |
| Plus-one policy | `faqAnswers.plusone` (and `rsvp.maxAdditionalGuests`) |
| Wedding contact email | `contact.email` (footer and RSVP show it once set) |
| Group chat invitation link | Cloudflare variable `PUBLIC_GUEST_GROUP_URL` |
| Shuttle / transportation | `shuttle` |
| Registry, wedding weekend events, nearby places, wedding party, photo album | `optional` (all off until you fill them in) |
| Arrival notes at the venue | `venue.arrivalNotes` |

## Needed to go live
- [ ] RSVP form service connected and tested: see `RSVP_SETUP.md`
- [ ] Decide search visibility: the site is `noindex` (not shown in search engines) until `SITE_VISIBILITY=public`
