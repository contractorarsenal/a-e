# Design Research: Wedding Website Patterns

Researched 2026-11-22. All observations come from text returned by WebFetch (HTML converted to markdown, then summarized by a small model). No rendered visuals, CSS, or fonts were available, so typography and photography are "not determinable from fetched content" unless stated. Summaries are second-hand; treat fine details as indicative.

## 1. Method and access limits

| # | URL | Status |
|---|-----|--------|
| 1 | https://www.avelawhite.com/our-collections | Partially. Header/nav and collection grid read; page truncated after the "Collections, brought to life" heading. |
| 2 | https://blissandbone.com/wedding-website | Partially. First 100k of 146k characters read; mostly mega-menu and product grid. |
| 3 | https://www.rileygrey.com/wedding-website-templates | Accessed fully (page text). |
| 4 | https://ashortengagement.com/products/wedding-website-template | BLOCKED. HTTP 429 on three attempts. Nothing observed. |
| 5 | https://withjoy.com/shamika-and-lionel/accommodations (real couple, Joy) | Accessed (one page only). |
| 6 | https://www.zola.com/wedding/shaylaandjake2026/faq and /travel (real couple, Zola) | Accessed (two pages). |
| 7 | https://www.zola.com/wedding/emilyandphillip26/travel (real couple, Zola) | Accessed (travel page only). |
| 8 | https://withjoy.com/rachelandalex2026/ (real couple, Joy) | Accessed (home, single-scroll page). |
| 9 | https://withjoy.com/rosie-and-hope/accommodations (real couple, Joy) | Accessed, thin content. |
| 10 | https://withjoy.com/blog/joy-wedding-website-example-chris-cali/ | Accessed; it is a blog description of a sample site, not the live site. |
| 11 | https://www.squarespace.com/blog/wedding-website-examples | Accessed; lists Squarespace templates (not real couples). Used only as secondary evidence. |
| 12 | https://www.theknot.com/us/julia-carlson-and-nicholas-malizia-jul-2026/travel | BLOCKED. HTTP 403. The Knot couple sites were only seen as search snippets (see Section 4). |

Limits: WebFetch returns no CSS, so no font names were seen anywhere. Mobile vs desktop menu behaviour is inferred only from markup labels where the summary reported them. Search-snippet material (Section 4) is lower confidence than fetched pages.

## 2. Per-site observations

### 2.1 Avela White (studio, collections page)
- Nav (5 items plus CTA): The Studio, Weddings, Professionals, Shop, "Start your project". Utility bar with cart count and a promo banner. "Skip to Content" link first.
- Nav appears twice in markup (likely desktop and mobile); toggles labelled "Open Menu" / "Close Menu".
- Page: H1, short intro paragraph, grid of 7 named collections, each with preview image, a lowercase name and a three-word mood descriptor (e.g. "minimal / serene / Japanese-inspired").
- Fonts, photo treatment: not determinable. Thumbnails are described as stationery/website mockups, no people photography seen.
- RSVP / travel / FAQ: nothing visible.

### 2.2 Bliss & Bone (template marketplace)
- Nav (6 labels): Wedding Websites, Cash Registry, Online Invitations, Printed Invitations, Logos & Monograms, Couples. Each opens a mega-menu with image tiles. Plus login/signup panel.
- Page: breadcrumb, H1 "Wedding Website Templates", trust bullets, single primary button ("Shop Designs"), feature strip (includes "Smart RSVPs"), filter links, sort control, product grid of cards (label, template name, preview, "Details").
- Describes RSVP management, guest messaging, password protection, sharing by email/text/WhatsApp as features. Travel and FAQ pages not described. Fonts: not determinable.
- Observation: heavy commerce navigation, the opposite of a minimal couple site; useful only as a contrast.

### 2.3 Riley & Grey (template marketplace)
- Nav (5 items): Websites, Invitations, Registry, RSVPs, Pricing, plus "Log in". Layout: logo left, Log in right, "Open main menu" toggle that expands the same 5 items (hamburger-style per markup labels).
- Home order: hero with title and email signup; Step 1 choose design (11 named templates); Step 2 features (custom domain, photos/video, password protection, countdown, etc.); plans; 3 testimonials; "Why do you need a wedding website" with three headed blocks; 5-question FAQ; template thumbnail grid; footer.
- Its own pitch lists what guests need centralised: venue directions, accommodation options, schedule, registry. RSVP form plus Schedule page and a "Guest Management" tab mentioned. No dedicated travel page described. Fonts: not determinable.

### 2.4 A Short Engagement
Blocked (HTTP 429). No observations. Not used as evidence.

### 2.5 Shamika & Lionel (Joy, real couple), Where to Stay page
- Nav (7 labels, in order): Welcome, Our Story, RSVP, Schedule, Where to Stay, Q&A, Registry.
- Page: couple names as H1, nav list, "Where to Stay" heading, four short paragraphs: no hotel block, a few nearby hotels (stated as about 15 minutes from the church), prices may change, closing note.
- Hotel names, addresses, buttons, maps: none seen in fetched content (links may exist but were not in the text). Prose-only approach with a travel-time anchor to the venue.

### 2.6 Shayla & Jacob (Zola, real couple), 2026
- Nav (7 plus "More"): Home, Schedule, Travel, Registry, Wedding Party, FAQs, RSVP.
- Home hero: RSVP deadline reminder line, wedding date, location, hashtag, one photo. Footer is Zola platform links.
- FAQ: 8 Q&A pairs, each with "Question"/"Answer" labels; topics: lodging, who is invited, venue location, food, unplugged ceremony, children, plus-ones. Accordion behaviour not determinable. FAQ points to Travel for lodging.
- Travel page: header with names, date, place, photo and a tagline; three entries: "House or Rental" (on-site retreat house, RV, tent; email to reserve), then two "Hotel" entries. Each hotel: category label, name heading, street address, "View" link. No price, map or transport info.

### 2.7 Emily & Phillip (Zola, real couple), San Diego
- Nav (10 plus More): Home, Schedule, Wedding Party, Travel, Registry, Gallery, FAQ's, Things To Do, RSVP.
- Travel page order: Flight (two airports with drive times), Travel Note (neighbourhood guidance: closest and priciest vs cheaper vs avoid), Hotel (6 listings), Airbnb entry, then "View similar hotels" link.
- Each hotel: name, address, one-line description, "View" button; some show phone, rate, or travel time to venue. Only the room-block hotel states a booking deadline (book by a given date). No map, no per-hotel booking code visible.

### 2.8 Rachel & Alex (Joy, real couple), Hawaii
- Single scroll page: heading, welcome line, two images, then Story, Where to Stay, Schedule, Registry, Travel, Q & A. Six labels, inferred from headings.
- No RSVP section or link in the fetched text. Above-the-fold: not determinable.

### 2.9 Hope & Rosie (Joy, real couple)
- Nav (8): Welcome, RSVP, Schedule, Registry / Honeymoon Fund, Story, Where to Stay, Q & A, Wedding Party.
- Where to Stay: a heading, one sentence, and an image. No hotels, links or map. Example of an under-filled page.

### 2.10 Secondary: Joy blog sample site (Chris & Cali), description only
- Pages: Welcome, Schedule (time, address, description, dress code, Google Maps), The Story, Moments, Travel & Lodging (room block details, shuttle timing, local favourites), The Q&A, The Registries. Pages optional and reorderable.

### 2.11 Secondary: Squarespace template examples (not real couples)
- Morena: sparse homepage that mostly directs to RSVP. Rey: single page with date, location, short bio, registry, RSVP button. Soria: full-page photo, RSVP button in header nav. Lenoix: key info on home plus large links to travel and RSVP. Malcolm: separate timeline, travel, FAQ pages.

## 3. Recurring principles

1. **Short, literal, consistent navigation.** Real sites use 6 to 8 plain-word labels, always including Schedule, Travel/Where to Stay, FAQ/Q&A, Registry, RSVP (Shamika & Lionel, Shayla & Jacob, Emily & Phillip, Hope & Rosie; Joy blog). Zola even carries a 10-item list, which is the upper limit to avoid. Marketplaces use 5 to 6 (Riley & Grey, Avela White). For A+E, aim at 5 to 6: Details, Travel, FAQ, RSVP (and Registry only if needed).
2. **RSVP is a top-level destination and is repeated on the home page.** RSVP appears as its own nav item on Zola, Joy (Shamika & Lionel, Hope & Rosie), Squarespace Soria (header button), Morena and Rey (primary button). Shayla & Jacob also puts the RSVP deadline in the hero. Rachel & Alex shows RSVP missing from the scroll, which reads as an omission. Make RSVP a distinct button style in the menu and a hero line with the deadline.
3. **Homepage is a thin invitation: names, date, place, one image, one action.** Shayla & Jacob hero is date plus place plus deadline plus one photo; Squarespace Morena and Rey are minimal pages that point to RSVP. Anything longer (story, gallery) is secondary.
4. **Separate pages by guest task, not by content type.** Schedule, Travel, FAQ, Registry each answer one question guests ask (Shayla & Jacob, Emily & Phillip, Joy sample, Squarespace Malcolm). Single-scroll pages (Rachel & Alex, Rey) work for small sites but make a long anchor-less page; if used, pair with a sticky or anchored menu.
5. **Travel page order: how to arrive, then where to sleep.** Emily & Phillip: airports with drive times, neighbourhood guidance, then hotels. Joy sample lists room block, shuttle, local favourites. Lead with the one decision guests must make (the preferred hotel / block and its deadline).
6. **A hotel is a small fixed card.** Consistent fields across Zola listings: category label, name, address, optional description, a single "View" button; the better entries add phone, rate, travel time to venue and a deadline (Emily & Phillip, Shayla & Jacob). Gaps seen: no maps and no booking codes on the fetched Zola pages. For older guests, add phone number, plain-text address, and a visible deadline; do not rely on the button alone.
7. **State the logistics rule in plain prose.** "No block, book where you like" (Shamika & Lionel), "book by [date] for the block rate" (Emily & Phillip), email-to-reserve for on-site beds (Shayla & Jacob). Honesty about what is and is not arranged reduces guest questions. Thin pages (Hope & Rosie, one sentence and an image) show what to avoid.
8. **FAQ is a flat list of plain questions answered in a sentence or two, cross-linking to the owning page.** Shayla & Jacob: 8 pairs covering lodging, invite scope, location, food, phones, children, plus-ones; the lodging answer points to Travel. Riley & Grey's own marketing uses 5. Keep 6 to 8 entries.
9. **Header: wordmark or names at left, menu collapsing behind a labelled toggle on small screens.** Riley & Grey and Avela White expose "Open/Close menu" toggles and a skip link; Zola uses a "More" overflow. For mobile, use a visible word "Menu" rather than an icon-only toggle, and keep the list short enough not to need overflow.
10. **Restraint is signalled by quiet, descriptive language and few calls to action.** Avela White gives each collection a lowercase name and three mood words; Bliss & Bone does the opposite (mega-menus, pricing, trials) and is the pattern to avoid. One primary action per page.
11. **Photography: one deliberate image per page header, not galleries.** Zola pages (Shayla & Jacob, both pages) and Joy pages (Rachel & Alex, Hope & Rosie) use one to two images; Squarespace Bleecker puts a small gallery last. Visual treatment and fonts: not determinable from fetched content, so type choices must come from the A+E brief, not from these sources.
12. **Always put venue, date and a deadline where guests land.** Shayla & Jacob hero and Emily & Phillip's block deadline show guests need dates more than prose; Joy's Schedule includes address, dress code and a map integration (Joy sample).

## 4. Search-snippet evidence (not fetched pages; lower confidence)
The Knot couple travel pages (e.g. theknot.com/us/.../travel) were blocked (403) and only seen via search summaries, which reported: per-hotel cutoff date plus group name plus booking code, a statement that guests pay for their own stay, shuttle info, "if the block is full contact us". These support principles 6 and 7 but were not verified by direct reading. Squarespace's own guidance suggests simple headings Schedule, Travel, Registry, RSVP so guests find things in one or two clicks, and finishing travel details 6 to 9 months out.

## 5. Decisions for Adrian & Emma's site (and what influenced them)

Visuals, fonts and photo treatment were not visible in any fetched source, so typography and photography decisions come from the brief and my own judgment, not from these sites. The structural decisions below are supported by the sources above; nothing was copied from any site.

| Decision | Influence |
|---|---|
| **Primary navigation cut to two links plus RSVP** (The Wedding, Travel & Stay, RSVP). Our Story and Questions live in the mobile menu, footer and inline page links. | Recurring finding: a handful of plain-word labels, RSVP as its own item. Zola's 10-item menu was treated as the upper limit to avoid; Bliss & Bone's commerce-style mega-menu as the pattern to avoid. |
| **Visible word "Menu" / "Close"** on mobile instead of an icon; menu lists 4 pages and one RSVP button; current page marked "you are here". | Avela White's "Open Menu / Close Menu" labelling; older-guest usability. |
| **Page name shown beside the monogram** (A+E / Travel & Stay); monogram always returns Home. | Predictable orientation and back-navigation without breadcrumbs or dropdowns. |
| **Thin homepage**: names, date, place, one photograph, one action, a short photo series and three wayfinding rows. | Real couple sites (Joy, Zola) keep the home page short and push logistics to task pages. |
| **Split by guest task**: The Wedding (when/where), Travel & Stay, Questions, RSVP, Our Story. | Single-scroll pages get long; separate pages per task. |
| **Travel & Stay leads with hotels**, each in a fixed format: name, type, drive distance and time, Book hotel, Directions, with extra details disclosed on demand. Airports, rentals and rides follow; map, compare, planner and budget are an optional collapsed section. | Hotel listings with a fixed card and one primary button; logistics stated in plain prose. (The research suggested arrival before hotels; the brief asked for hotels first, so the brief won.) |
| **Plain statements of what is unknown** ("Parking details to be confirmed", "Shuttle information, if any, will be posted here") instead of invented specifics. | Plain-prose logistics rules; accuracy requirement. |
| **FAQ is a flat list** with links to the page that owns the answer. | FAQ pattern on the Zola/Joy examples. |
| **Visual system**: paper-cream ground, near-black text, a single terracotta accent taken from the dress, Bodoni Moda for names/headings (high-contrast, invitation-like) with Jost for text. Photographs are shown as uncropped framed prints with plate numbers and small captions; no dark bands, arches, overlays or scroll animation. | Own judgment: the previous design leaned on dark sections, arch frames, gradients and large serif headings, which read as a template. |
