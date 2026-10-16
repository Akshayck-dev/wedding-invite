import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import config from "../config";
import RevealHeart from "./RevealHeart";
import Petals from "./Petals";
import FloralDivider from "./FloralDivider";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

/** Heart-shaped celebration burst in wedding golds + burgundy. */
const HEART_CONFETTI_PATH =
  "M50 88 C30 70 10 52 10 30 C10 14 22 6 34 6 C42 6 48 10 50 18 C52 10 58 6 66 6 C78 6 90 14 90 30 C90 52 70 70 50 88 Z";

function celebrate() {
  try {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  } catch (err) {}
  let heart = "circle";
  try {
    heart = confetti.shapeFromPath({ path: HEART_CONFETTI_PATH });
  } catch (err) {}
  const colors = ["#c9a227", "#a67c1a", "#7a1f2b", "#fff8ec", "#e8b4b8"];
  const shapes = heart === "circle" ? ["circle"] : [heart, "circle"];
  const base = {
    colors, shapes,
    ticks: 230, gravity: 1.05, scalar: 1.05,
    disableForReducedMotion: true, zIndex: 200,
  };
  confetti({ ...base, particleCount: 90, spread: 100, origin: { y: 0.62 } });
  window.setTimeout(() => confetti({ ...base, particleCount: 55, angle: 60, spread: 60, origin: { x: 0, y: 0.72 } }), 250);
  window.setTimeout(() => confetti({ ...base, particleCount: 55, angle: 120, spread: 60, origin: { x: 1, y: 0.72 } }), 420);
  window.setTimeout(() => confetti({ ...base, particleCount: 45, spread: 130, scalar: 0.85, origin: { y: 0.5 } }), 750);
}

/* ---------------- countdown ---------------- */
function Countdown() {
  const target = new Date(config.dateSection.iso).getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((target - now) / 1000));
  const pad = (n) => String(n).padStart(2, "0");
  const units = [
    [pad(Math.floor(s / 86400)), "DAYS"],
    [pad(Math.floor((s % 86400) / 3600)), "HOURS"],
    [pad(Math.floor((s % 3600) / 60)), "MINUTES"],
    [pad(s % 60), "SECONDS"],
  ];
  return (
    <div className="count-grid">
      {units.map(([v, l]) => (
        <div className="count-cell" key={l}><strong>{v}</strong><span>{l}</span></div>
      ))}
    </div>
  );
}

/* ---------------- gallery (hidden when no photos) ---------------- */
function Gallery() {
  const photos = config.gallery.photos;
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const touchX = useRef(null);
  const goTo = (n) => setIdx((n + photos.length) % photos.length);
  const restart = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setIdx((i) => (i + 1) % photos.length), 5500);
  };
  useEffect(() => { restart(); return () => clearInterval(timer.current); }, [photos.length]);
  if (photos.length === 0) return null;
  return (
    <>
      <div className="carousel">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${idx * 100}%)` }}
          onPointerDown={(e) => { touchX.current = e.clientX; }}
          onPointerUp={(e) => {
            if (touchX.current === null) return;
            const dx = e.clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 40) { goTo(idx + (dx < 0 ? 1 : -1)); restart(); }
          }}
        >
          {photos.map((src, i) => (
            <div className="carousel-slide" key={i}>
              <img className="slide-photo" src={src} alt={`Couple photo ${i + 1}`} draggable={false} />
            </div>
          ))}
        </div>
        <button className="carousel-arrow prev" type="button" aria-label="Previous photo"
          onClick={() => { goTo(idx - 1); restart(); }}>‹</button>
        <button className="carousel-arrow next" type="button" aria-label="Next photo"
          onClick={() => { goTo(idx + 1); restart(); }}>›</button>
      </div>
      <div className="carousel-dots" role="tablist" aria-label="Gallery photos">
        {photos.map((_, i) => (
          <button key={i} type="button" role="tab" aria-label={`Go to photo ${i + 1}`}
            className={i === idx ? "active" : ""}
            onClick={() => { goTo(i); restart(); }} />
        ))}
      </div>
    </>
  );
}

/* ---------------- all scrolling sections ---------------- */
export default function Sections() {
  const { welcome, dateSection, events, gallery, venue, dressCode, rsvp, closing, footer, couple } = config;
  const showGallery = gallery.photos.length > 0;
  const [showCountdown, setShowCountdown] = useState(false);

  // Heart revealed -> celebration, then the countdown makes its entrance.
  const handleRevealed = useCallback(() => {
    celebrate();
    window.setTimeout(() => setShowCountdown(true), 1900);
  }, []);

  return (
    <>
      <Petals />

      {/* WELCOME */}
      <section className="ivory section-pad">
        <Reveal>
          <p className="eyebrow">{welcome.eyebrow}</p>
          <h2 className="script-heading">{welcome.heading}</h2>
          <p className="lede">{welcome.text}</p>
          <p className="signature-red">{welcome.signature}</p>
        </Reveal>
      </section>
      <FloralDivider />

      {/* REVEAL — heart opens on scroll into view (or tap) */}
      <section className="ivory-deep section-pad">
        <Reveal>
          <p className="eyebrow">{dateSection.eyebrow}</p>
          <h2 className="script-heading">{dateSection.heading}</h2>
          <p className="scratch-hint">
            {showCountdown
              ? "Save the date ♥ — and count down with us below."
              : "The heart opens as you arrive — or tap it."}
          </p>
          <RevealHeart onReveal={handleRevealed} />
        </Reveal>
      </section>

      {/* COUNTDOWN — blooms open smoothly after the heart reveal + celebration */}
      <AnimatePresence initial={false}>
        {showCountdown && (
          <motion.div
            key="countdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <section className="countdown-band">
              <FloralDivider className="on-dark" />
              <div className="band-inner">
                <p className="eyebrow light">UNTIL WE SAY QUBOOL HAI</p>
                <h2 className="script-heading light">{dateSection.countdownHeading}</h2>
                <Countdown />
              </div>
              <FloralDivider className="on-dark" />
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FESTIVITIES */}
      <section className="ivory section-pad">
        <Reveal>
          <p className="eyebrow">THE FESTIVITIES</p>
          <h2 className="script-heading">Days filled with joy</h2>
          <div className="fest-list">
            {events.list.map((ev, i) => (
              <div className="fest-item" key={ev.name}>
                {i > 0 && <FloralDivider className="mini" />}
                <h3 className="fest-name">{ev.name}</h3>
                <p className="fest-date">{ev.date} • {ev.time}</p>
                <p className="fest-venue">{ev.venue}</p>
                <a className="outline-button" href={ev.mapsUrl} target="_blank" rel="noreferrer">
                  VIEW ON GOOGLE MAPS
                </a>
              </div>
            ))}
          </div>
          <p className="note-caps">{events.note}</p>
        </Reveal>
      </section>
      <FloralDivider />

      {/* GALLERY — hidden when no photos configured */}
      {showGallery && (
        <section className="ivory section-pad">
          <Reveal>
            <p className="eyebrow">{gallery.eyebrow}</p>
            <h2 className="script-heading">{gallery.heading}</h2>
            <Gallery />
          </Reveal>
          <FloralDivider />
        </section>
      )}

      {/* VENUE */}
      <section className="ivory-deep section-pad">
        <Reveal>
          <div className="venue-card">
            <p className="eyebrow light">{venue.eyebrow}</p>
            <h2 className="script-heading light">{venue.name}</h2>
            <p className="venue-card-addr">{venue.address}</p>
            <a className="gold-outline-button" href={venue.mapsUrl} target="_blank" rel="noreferrer">
              VIEW ON GOOGLE MAPS
            </a>
          </div>
          <div className="venue-map">
            <iframe
              title={`Wedding venue map — ${venue.name}`}
              src={venue.embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>
      <FloralDivider />

      {/* DRESS CODE */}
      <section className="ivory section-pad">
        <Reveal>
          <p className="eyebrow">{dressCode.eyebrow}</p>
          <h2 className="script-heading">{dressCode.heading}</h2>
          <p className="lede">{dressCode.text}</p>
          <div className="palette" aria-label="Suggested colour palette">
            {dressCode.palette.map((s) => (
              <span key={s.label} title={s.label} style={{ "--c": s.color }} />
            ))}
          </div>
        </Reveal>
      </section>
      <FloralDivider />

      {/* RSVP */}
      <section className="ivory-deep section-pad">
        <Reveal>
          <div className="rsvp-card">
            <h2 className="script-heading">{rsvp.heading}</h2>
            <p className="rsvp-text">{rsvp.text}</p>
            <a className="gold-pill" href={rsvp.whatsapp} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.7-.2.5-.9 2.1-.9 5.1s.9 3.5 1.1 3.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z" />
              </svg>
              {rsvp.buttonLabel}
              <span aria-hidden="true">›</span>
            </a>
            <p className="rsvp-note">{rsvp.responseNote}</p>
          </div>
        </Reveal>
      </section>

      {/* CLOSING */}
      <section className="closing-band">
        <div className="band-inner">
          <Reveal>
            <p className="eyebrow light">{closing.eyebrow}</p>
            <h2 className="script-heading light">{closing.heading}</h2>
            <p className="closing-text">{closing.text}</p>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer ivory">
        <Reveal>
          <div className="footer-arch">
            <h2 className="script-heading">{footer.heading}</h2>
            <p className="footer-names">{couple.bride.name} &amp; {couple.groom.name}</p>
            <p className="footer-meta">
              {dateSection.revealDate.toUpperCase()} • {venue.name.toUpperCase()}
            </p>
          </div>
        </Reveal>
      </footer>
    </>
  );
}
