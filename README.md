# Maroon & Gold Wedding Invitation

A plain HTML/CSS/JS (no framework) wedding invitation. Opens with a cinematic
maroon-and-gold curtain-reveal video; tapping/clicking enters the full invitation.

## Structure

- `index.html` — opening video intro + invitation sections
- `styles.css` — maroon & gold theme, responsive
- `script.js` — intro flow, scratch-to-reveal card, nav, RSVP demo
- `assets/opening.mp4` — the opening video (tap to play, tap again for the couple photo)
- `assets/poster.jpg` — first-frame poster shown before playback
- `assets/couple.jpg` — bride & groom photo (optional; a monogram placeholder shows if missing)

## Flow

Tap to open → video plays → the moment it ends the couple's photo appears in a
gold arch frame with names & date → tap to enter the full invitation.

## Invitation sections

Hero (bride & groom names) → scratch-to-reveal save-the-date card → Our Story →
Celebration timeline → Details with embedded venue map → RSVP (demo form, not stored) → footer.

## Run locally

Any static server works:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000

## Deploy

Static hosting — no build step. The Vercel project serves the repo directly
(manual `create_deployment` from `main`, project is not Git-linked).

## Customize

- Names: search `index.html` for `Amina` / `Fahad` (currently placeholders).
- Date/venue: `index.html` (hero, scratch card, details) — 15 November 2026, The Grand Palace, Kozhikode.
- Venue map: the `iframe` src and GET DIRECTIONS link in the Details section.
- Opening video: replace `assets/opening.mp4` (+ `assets/poster.jpg`).
- Google Fonts require internet access.
