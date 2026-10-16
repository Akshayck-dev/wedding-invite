# Maroon & Gold Nikah Invitation (React)

A responsive React + Vite + Framer Motion wedding invitation built around the
opening animation video.

## Flow

1. Full-screen poster (first video frame) + "Tap to Open".
2. Tap → video plays once, inline, no controls; optional background music starts
   from the same gesture. Scrolling is locked.
3. On video `ended`, a crossfade reveals the invitation hero — mounted behind
   the video from the start, using the video's exact final frame as its
   background, so the handoff is seamless (never fades through black).
4. Scrolling unlocks; the invitation sections follow.

Fallbacks: playback failure → visible "Open Invitation" button;
`prefers-reduced-motion` → skip straight to the invitation.

## Structure

- `index.html` — Vite entry
- `src/main.jsx`, `src/App.jsx` — orchestration (poster → playing → entered)
- `src/config.js` — **all wedding details, links and asset paths live here**
- `src/components/Opening.jsx` — poster + video overlay
- `src/components/Hero.jsx` — final-frame hero, staggered text reveal
- `src/components/Sections.jsx` — welcome, scratch date + countdown, events,
  gallery, venue + map, dress code, WhatsApp RSVP, closing, footer
- `src/components/ScratchCard.jsx` — canvas scratch-to-reveal
- `src/components/MusicToggle.jsx` — fixed round music toggle
- `src/styles.css` — theme
- `public/assets/` — served at `/assets/...`:
  - `opening.mp4` — the opening animation video
  - `opening-poster.jpg` — exact first frame
  - `hero-final-frame.jpg` — exact final frame (hero background)
  - `music.mp3` — optional; add the file to enable background music

## Run locally

```bash
npm install
npm run build   # or npx vite --host for dev
```

Any static server can serve `dist/` (e.g. `python3 -m http.server`).

## Deploy

Vercel project `wedding-invite` (NOT Git-linked — manual `create_deployment`
from `main` with the Vite framework preset; it builds from source).

## Customize

Edit `src/config.js` — names, parents, dates, events, venues, WhatsApp link,
gallery photos, music, and asset paths. Google Fonts require internet access.
