---
name: frontend-design
description: Use whenever building or styling any page, component, or screen for this mini cinema site (landing, film list, film detail, booking flow, dashboard, admin). Enforces the project's monochrome design direction and prevents generic AI-generated look.
---

# Frontend Design — Bioskop Mini

## Subject grounding

This is a small independent cinema. The experience should feel like walking into an actual mini bioskop: film posters, a projector beam, ticket stubs, marquee lettering, the anticipation before a screening. Every screen should be built with real film titles, real showtimes, real ticket data as content, not lorem ipsum.

## Palette — monochrome, not flat

Pure black on pure white reads flat and harsh on screen. Use warm-tinted near-black and near-white so the contrast still feels rich instead of clinical.

- Ink: #121110 (near-black, primary text and dark surfaces)
- Paper: #F6F4EF (near-white, primary background, warmer than pure white)
- Reel grey: #8A8680 (secondary text, muted UI)
- Line: #D8D5CC (borders, dividers, hairlines)
- Spotlight: #FFFFFF (used only for true highlights, e.g. an active seat or the projector-beam hero moment)

No color accent. Balance and interest come from contrast, texture (subtle film grain on dark surfaces), and layout, not from adding a second hue.

## Typography

- Display: a tall, slightly condensed serif or grotesk with real presence, used for film titles and the marquee-style hero. Avoid Inter, Roboto, Arial, and avoid the overused Bebas Neue default.
- Body: a plain, highly readable text face, clearly distinct in weight and width from the display face.
- Two families total, nothing more.
- No tracked-out ALL-CAPS eyebrow labels above headings. No middle-dot separated meta strings. No arrow (→) appended to buttons or links.

## Layout

- Avoid the centered hero + three feature cards default. The homepage hero should be poster-forward and asymmetric — one dominant "now showing" film, not a grid of equal cards.
- Film listing: grid is fine here because it's genuinely a catalog, but vary poster sizes by what's playing soon vs later, don't make every tile identical.
- Booking flow (seat select → showtime → QRIS payment → confirmation) is a real sequence, so numbered steps (01 / 02 / 03) are earned here — nowhere else.
- Ticket confirmation screen should look like a ticket stub: perforated edge treatment, not a generic success card with a checkmark icon.
- Admin dashboard can be plainer and more utilitarian than the public site — it's a backstage tool, not a marketing surface. Don't over-decorate it, but keep it in the same ink/paper palette.

## Motion

One deliberate moment only: a slow projector-beam sweep or light flicker on the homepage hero on load. No fade-and-slide-up on every section, no hover-lift on every card.

## Explicitly avoid

- Purple or blue gradient backgrounds
- Uniform rounded corners with the same soft grey card shadow everywhere
- Emoji used as icons
- Generic SaaS copy ("Unlock the future of cinema")
- A visible or guessable admin link in the main navigation — the admin route should not be discoverable from the public UI at all

## Before shipping any screen

Ask: does this look like it was designed for this specific cinema, or would this exact layout work unchanged for a SaaS dashboard, a recipe blog, and a portfolio site? If the second is true, revise before writing final code.
