# OKLA-POS — Design Brief

## The client
OKLA-POS LLC: locally owned point-of-sale and payment processing provider in Oklahoma.
- Founded 2013 by **Robbie Stephenson**: 50+ years owning and running restaurants, from quick-service spots to full-service dining rooms. Before OKLA-POS, he worked at **CRS of Oklahoma**, a POS dealer in Oklahoma City.
- Started in OKC (5825 Melton Dr). **In 2022 HQ moved to Chickasha, OK (3001 W Grand Ave).** Serves small and mid-size businesses in rural and metro Oklahoma.
- Positioning: the on-site, high-support alternative to cloud POS giants that mail a box and send you to an overseas call center.
- Pillars: "Second to None" support (17+ years in transaction technology; setup, on-site wiring, staff training, local tech dispatch) · Flexible buying (upfront purchase OR monthly subscription) · Dual focus (deep hospitality customization such as menu modifiers, multi-station kitchen printers and table maps, plus scalable payment processing; retail too).

**Do NOT invent facts.** No made-up prices, customer names, testimonials, review stars, or stats. The phone number and email are unknown: use `(405) 000-0000` and `hello@okla-pos.example` and mark them with `data-placeholder` so they are easy to find and replace.

## Concept: "The Kitchen Ticket"
The founder spent 50 years in kitchens. The visual language comes from the thing every restaurant runs on: **the printed order ticket**, the ticket rail, the thermal receipt. Add Oklahoma's **red dirt** and the hand-painted look of small-town grain elevators and water towers.
- Thermal-paper whites, carbon ink, a **red clay** accent, a **wheat** secondary color.
- Monospaced "ticket" typography for data, labels and receipts. Big condensed painted-sign display type for headlines.
- Recurring motifs: perforated/torn ticket edges, dashed tear lines, `#` order numbers, `QTY / ITEM` columns, time stamps, a ticket rail (a metal bar that tickets hang from).
- Tone of voice: plain-spoken, warm, a little dry. Talk like a restaurant owner. Short sentences. No "revolutionize", no "seamless", no "empower".

## Tokens (defined in css/base.css; USE THESE, don't invent new colors)
- `--paper` #F4EEE3 (page), `--paper-2` #EAE1D1 (alt band), `--receipt` #FFFDF8 (ticket surfaces)
- `--ink` #1D1A16 (text), `--ink-2` #4A443B (secondary), `--ink-3` #7C7366 (muted)
- `--clay` #B4432A (red dirt, primary accent), `--clay-deep` #8E2F1B, `--wheat` #D9A441, `--sage` #5E6B4E (sparingly)
- `--rule` rgba(29,26,22,.18)
- Fonts: `--f-display` "Big Shoulders Display" (900/800, uppercase, tight), `--f-body` "Instrument Sans", `--f-mono` "IBM Plex Mono".
- Spacing: `--s-1` … `--s-9` (4, 8, 12, 16, 24, 32, 48, 72, 112px). Radius: tickets are square-cornered; buttons `--r` 2px.
- Layout container `.wrap` (max 1240px, 24px gutter, 16px under 600px).
- Dark sections: `.band-ink` (ink background, paper text). Accent band: `.band-clay`.

## Shared components (in base.css, reuse them)
- `.eyebrow` mono label in small caps, e.g. `<p class="eyebrow">#04 — Hospitality</p>`
- `.display` / `.display-xl` headline classes
- `.btn` + `.btn--clay` / `.btn--ghost`
- `.ticket` receipt-paper card with a torn bottom edge (`.ticket--torn`) and `.tear` dashed perforation line
- `.mono`, `.kbd-stamp` (rotated rubber-stamp label)
- Reveal on scroll: add `data-reveal` to any element; js/core.js adds `.is-in`.

## Rules
- Mobile first. Must work at 360px with no horizontal scroll.
- Respect `prefers-reduced-motion`. Animations are short and purposeful: one memorable moment per section at most.
- Semantic HTML, alt text, visible focus states, AA contrast. Clay on paper is fine for large text and UI; use `--clay-deep` for small clay text.
- No external images. Use inline SVG and CSS only.
- Each builder writes ONLY their own files: `partials/<name>.html`, `css/<name>.css`, `js/<name>.js`. Prefix your CSS classes with your section (e.g. `.hero-…`, `.hosp-…`) so nothing collides. Do not edit base.css or other builders' files.
