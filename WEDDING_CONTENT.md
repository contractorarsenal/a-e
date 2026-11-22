# Wedding content

All guest-facing content is edited in `src/content/site.ts` and `src/content/travel.ts`. `null` / empty = "Details coming soon" (or hidden).

## Confirmed (in the site now)
- Couple: **Adrian & Emma** (monogram **A + E**)
- Date: Saturday, August 28, 2027
- Venue: Ethereal Gardens, 8561 W Lilac Rd, Escondido, CA 92026
- Venue website: https://trademarkvenues.com/ethereal-gardens/
- Apple Maps place: https://maps.apple/p/pVYvAG1Jc2gwNb (venue coordinates 33.2983987, −117.1461074 come from this link)
- Tagline: "Together is our favorite place to be."
- Photos: 4 proposal photographs (alt text and captions in `src/lib/photos.ts`)

## Still needed from the couple
| Item | Where | Currently shows |
|---|---|---|
| Ceremony start time / reception timings | `schedule`, `wedding.calendarStart/End` | "Details coming soon"; calendar file is an all-day *date reminder* |
| Arrival time guidance | FAQ | "Details coming soon" |
| Dress code | FAQ | "Details coming soon" |
| Parking / valet for the wedding (confirm with the venue; the venue page only says parking is included in packages) | `venue.parkingNotes` | "Parking details coming soon" |
| Venue arrival instructions | `venue.arrivalNotes` | "Arrival instructions coming soon" |
| Children policy | FAQ | "Details coming soon" |
| RSVP deadline | `rsvp.deadline`, `rsvp.deadlineISO` | none |
| Registry | `optional.registry` | hidden |
| Contact email for guest questions | `contact.email` | "coming soon" |
| Our real story (chapters) | `story.chapters` | photos + a short factual caption only |
| Group chat invite link | `PUBLIC_GUEST_GROUP_URL` | "Group link coming soon" |
| Shuttle (only if arranged) | `shuttle` | "No shuttle has been arranged yet" |
| Weekend events, nearby places, wedding party, photo album | `optional.*` | hidden |
| Spanish content | `optional.spanish` (not built yet) | disabled |
| Hotel photos with usage rights | `public/hotels/`, `photo` in `travel.ts` | neutral placeholder |
