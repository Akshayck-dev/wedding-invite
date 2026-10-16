import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import config from "../config";
import ScratchCard from "./ScratchCard";

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

function Divider() {
  return <div className="divider" aria-hidden="true"><span>✦</span></div>;
}

/* ---------- gold line icons ---------- */
function EventIcon({ name }) {
  const p = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round",
    "aria-hidden": true };
  if (name === "rings") return (
    <svg {...p}><circle cx="9" cy="14" r="5.5" /><circle cx="15.5" cy="13" r="5.5" />
      <path d="M12 8.5 13.5 3l2.5 1.5" /></svg>);
  if (name === "flower") return (
    <svg {...p}><circle cx="12" cy="12" r="2.4" />
      <path d="M12 9.6C12 7 13.5 5 16 5c0 2.6-1.5 4.6-4 4.6zM12 9.6C12 7 10.5 5 8 5c0 2.6 1.5 4.6 4 4.6zM12 14.4c0 2.6 1.5 4.6 4 4.6 0-2.6-1.5-4.6-4-4.6zM12 14.4c0 2.6-1.5 4.6-4 4.6 0-2.6 1.5-4.6 4-4.6z" /></svg>);
  if (name === "music") return (
    <svg {...p}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>);
  return ( // cloche
    <svg {...p}><path d="M4 17h16" /><path d="M12 7a7 7 0 0 1 7 7H5a7 7 0 0 1 7-7z" />
      <path d="M12 7V5.5" /><circle cx="12" cy="4.5" r="1" /><path d="M10 20h4" /></svg>);
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>);
}

function LanternIcon() {
  return (
    <svg width="34" height="44" viewBox="0 0 34 44" fill="none" stroke="#b98a34"
      strokeWidth="1.6" aria-hidden="true">
      <circle cx="17" cy="4" r="2.4" />
      <path d="M12 8h10l2.5 5h-15L12 8z" />
      <path d="M9.5 13h15l-2.5 22h-10L9.5 13z" />
      <path d="M17 13v22M9.5 20h15M10.8 28h12.4" strokeWidth="1" opacity=".6" />
      <path d="M14 35h6l-1 4h-4l-1-4z" />
      <circle cx="17" cy="42" r="1" fill="#b98a34" />
    </svg>);
}

/* Dark mosque silhouette for burgundy panels */
function MosqueSilhouette() {
  return (
    <svg className="silhouette" viewBox="0 0 400 90" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="#1c0308" opacity=".55">
        <rect x="0" y="70" width="400" height="20" />
        <rect x="150" y="40" width="100" height="32" />
        <path d="M150 42c8-16 24-24 50-24s42 8 50 24c-16-6-32-8-50-8s-34 2-50 8z" />
        <rect x="196" y="8" width="8" height="12" />
        <circle cx="200" cy="7" r="3" />
        <rect x="60" y="30" width="10" height="42" />
        <path d="M60 32c2-8 5-12 10-14 5 2 8 6 10 14-3-2-6-3-10-3s-7 1-10 3z" />
        <rect x="330" y="30" width="10" height="42" />
        <path d="M330 32c2-8 5-12 10-14 5 2 8 6 10 14-3-2-6-3-10-3s-7 1-10 3z" />
        <rect x="110" y="52" width="34" height="20" />
        <path d="M110 54c4-9 12-14 22-14s18 5 22 14c-7-3-14-4-22-4s-15 1-22 4z" />
        <rect x="256" y="52" width="34" height="20" />
        <path d="M256 54c4-9 12-14 22-14s18 5 22 14c-7-3-14-4-22-4s-15 1-22 4z" />
      </g>
    </svg>);
}

/* Gold line-art mosque divider */
function MosqueLineArt() {
  return (
    <svg className="lineart" viewBox="0 0 400 70" aria-hidden="true">
      <g fill="none" stroke="#b98a34" strokeWidth="1.4" opacity=".8">
        <path d="M20 62h360" />
        <path d="M150 62V44c0-14 20-24 50-24s50 10 50 24v18" />
        <path d="M200 14v-6" /><circle cx="200" cy="6" r="2" />
        <path d="M70 62V38M90 62V38M70 38c0-8 4-12 10-14 6 2 10 6 10 14" />
        <path d="M310 62V38M330 62V38M310 38c0-8 4-12 10-14 6 2 10 6 10 14" />
        <path d="M120 62v-8M280 62v-8" />
      </g>
    </svg>);
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
        <div className="count-box" key={l}><strong>{v}</strong><span>{l}</span></div>
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
      {/* WELCOME */}
      <section className="ivory section-pad">
        <Reveal>
          <p className="eyebrow">{welcome.eyebrow}</p>
          <h2 className="script-heading">{welcome.heading}</h2>
          <Divider />
          <p className="lede">{welcome.text}</p>
          <div className="name-banner">
            <span>{couple.bride.name} &amp; {couple.groom.name}</span>
          </div>
        </Reveal>
      </section>

      {/* SCRATCH */}
      <section className="ivory-deep section-pad">
        <Reveal>
          <p className="eyebrow">A LITTLE SURPRISE</p>
          <h2 className="script-heading">{dateSection.heading}</h2>
          <Divider />
          <p className="scratch-hint">
            {showCountdown
              ? "Save the date ♥ — and count down with us below."
              : "Gently scratch the heart to reveal our wedding date."}
          </p>
          <ScratchCard onReveal={handleRevealed} />
        </Reveal>
      </section>

      {/* COUNTDOWN — appears after the heart reveal + celebration */}
      {showCountdown && (
        <motion.section
          className="countdown-band"
          initial={{ opacity: 0, y: 56, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 17 }}
        >
          <div className="band-inner">
            <p className="eyebrow light">{dateSection.countdownEyebrow}</p>
            <h2 className="script-heading light">{dateSection.countdownHeading}</h2>
            <Divider />
            <Countdown />
          </div>
          <MosqueSilhouette />
        </motion.section>
      )}

      {/* EVENTS */}
      <section className="ivory section-pad">
        <Reveal>
          <p className="eyebrow">{events.eyebrow}</p>
          <h2 className="script-heading">{events.heading}</h2>
          <Divider />
          <div className="event-cards">
            {events.list.map((ev) => (
              <a className="event-card" key={ev.name} href={ev.mapsUrl} target="_blank" rel="noreferrer">
                <span className="ev-icon"><EventIcon name={ev.icon} /></span>
                <span className="ev-body">
                  <span className="ev-name">{ev.name}</span>
                  <span className="ev-row">
                    <span className="ev-date">
                      <b>{ev.dayName}</b><strong>{ev.dayNum}</strong><b>{ev.month}</b>
                    </span>
                    <span className="ev-details">
                      <span>{ev.time}</span>
                      <span>{ev.venue}</span>
                    </span>
                  </span>
                </span>
                <span className="ev-chev" aria-hidden="true">›</span>
              </a>
            ))}
          </div>
          <p className="note-caps">{events.note}</p>
        </Reveal>
      </section>

      {/* GALLERY — hidden when no photos configured */}
      {showGallery && (
        <section className="ivory section-pad">
          <Reveal>
            <p className="eyebrow">{gallery.eyebrow}</p>
            <h2 className="script-heading">{gallery.heading}</h2>
            <Divider />
            <Gallery />
          </Reveal>
        </section>
      )}

      {/* VENUE */}
      <section className="ivory-deep section-pad">
        <Reveal>
          <h2 className="script-heading">{venue.name}</h2>
          <p className="eyebrow">{venue.eyebrow}</p>
          <Divider />
          <p className="venue-addr"><PinIcon /> {venue.address}</p>
          <div className="venue-map">
            <iframe
              title={`Wedding venue map — ${venue.name}`}
              src={venue.embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a className="burgundy-button" href={venue.mapsUrl} target="_blank" rel="noreferrer">
            <PinIcon /> VIEW ON GOOGLE MAPS <span aria-hidden="true">›</span>
          </a>
        </Reveal>
      </section>

      {/* DRESS CODE */}
      <section className="ivory section-pad">
        <Reveal>
          <p className="eyebrow">OUR THEME</p>
          <h2 className="script-heading">{dressCode.heading}</h2>
          <Divider />
          <p className="lede">{dressCode.text}</p>
          <div className="palette" aria-label="Suggested colour palette">
            {dressCode.palette.map((s) => (
              <span key={s.label} title={s.label} style={{ "--c": s.color }} />
            ))}
          </div>
          <MosqueLineArt />
        </Reveal>
      </section>

      {/* RSVP */}
      <section className="ivory section-pad">
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
            <div className="mini-divider" aria-hidden="true"><span>✦</span></div>
          </div>
        </Reveal>
      </section>

      {/* CLOSING */}
      <section className="closing-band">
        <div className="band-inner">
          <Reveal>
            <p className="eyebrow light">{closing.eyebrow}</p>
            <h2 className="script-heading light">{closing.heading}</h2>
            <Divider />
            <p className="closing-text">{closing.text}</p>
          </Reveal>
        </div>
        <MosqueSilhouette />
      </section>

      {/* FOOTER */}
      <footer className="footer ivory">
        <Reveal>
          <div className="footer-arch">
            <LanternIcon />
            <h2 className="script-heading">{footer.heading}</h2>
            <p className="footer-names">{couple.bride.name} &amp; {couple.groom.name}</p>
            <p className="footer-meta">{footer.meta}</p>
          </div>
        </Reveal>
      </footer>
    </>
  );
}
