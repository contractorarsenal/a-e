# RSVP setup (needs one action from the couple)

The RSVP page is **closed to the public** until a form service is connected. With no endpoint configured the page honestly says the form isn't open and nothing can be submitted. A success message only ever appears after the service answers with a success status.

## What to do (about 5 minutes, free plan is enough)
1. Create a free account at https://formspree.io (use an email Adrian or Emma checks; that inbox receives the replies).
2. **New form** → name it "A+E RSVP" → copy the form URL. It looks like `https://formspree.io/f/xxxxxxxx`.
3. In the Formspree form's **Settings**: turn on spam filtering, and restrict allowed domains to `a-e.pages.dev` if offered.
4. In **Cloudflare → Workers & Pages → a-e → Settings → Variables and secrets → Production**, add:

   | Name | Value |
   |---|---|
   | `PUBLIC_RSVP_ENDPOINT` | `https://formspree.io/f/xxxxxxxx` (your form URL, exactly) |

5. **Deployments → Retry deployment** (the value is baked in at build time).
6. Open https://a-e.pages.dev/en/rsvp/ and https://a-e.pages.dev/es/rsvp/, submit one real test reply in each language, and confirm it arrives. Then delete the two test entries in Formspree.

The endpoint URL is public (it ends up in the page's JavaScript) — that is normal for Formspree; the spam filter and domain restriction are what protect it. **Never commit** the Formspree dashboard login, exports, or any guest replies to GitHub.

## What the form collects
First and last name, email, attending / unable to attend, additional guests named on the invitation (max `rsvp.maxAdditionalGuests` in `src/content/site.ts`, currently 3), dietary restrictions, accessibility needs, an optional note, and the page language (`language`: `en` or `es-MX`). Replies are not displayed anywhere on the site.

## Honest limits
- Guest identities are **not verified** and party size is **not enforced**: the form says so, and the couple reconciles replies against their own guest list by hand. There are no invitation codes.
- A reply-by date is not enforced by the service. Set `rsvp.deadlineISO` in `src/content/site.ts` and the form closes itself after that day (a courtesy; people can still bypass it).
- If you decide the plus-one policy is "no additional guests", set `maxAdditionalGuests: 0` and the field is simply unused (or ask me to hide it).
