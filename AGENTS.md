<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Bioskop Mini — Project Notes

## What this is

A website for a small independent cinema: public film listing, online ticket booking via QRIS, and a hidden admin panel for managing films and pricing.

## Pages

- Landing / about us
- Film list (now showing, coming soon)
- Film detail (synopsis, showtimes, price)
- Booking flow: pick showtime and seat, pay via QRIS, get a digital ticket
- Dashboard: a booked user's ticket history and active tickets (QR to scan at entry)
- Admin (hidden): login, CRUD for films (title, synopsis, price, schedule, poster), booking and revenue overview

## Design

Follow the `frontend-design` skill for every screen. Monochrome palette (ink/paper), no color accents, no default SaaS patterns.

## Technical constraints to respect

- QRIS payment needs a real gateway (e.g. Midtrans, Xendit) rather than a static QR, so payment status can be confirmed via webhook instead of trusting the client.
- The admin route must be protected by real auth middleware on the server side, not just omitted from the navbar. A hidden link is not security.
- Seat/showtime booking needs a check against double-booking the same seat and showtime — a simple transaction or unique constraint is enough at this scale, no need for anything elaborate.

## Code style

- No comments that just restate what the code does.
- No emoji inside code.
- Avoid em dashes in generated copy and comments.
