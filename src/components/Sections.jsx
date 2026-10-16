import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

function Divider() {
  return (
    <div className="divider" aria-hidden="true"><span>✦</span></div>
  );
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
        <div key={l}><strong>{v}</strong><span>{l}</span></div>
      ))}
    </div>
  );
}

/* ---------------- gallery carousel ---------------- */
function Gallery() {
  const photos = config.gallery.photos;
  const slides = photos.length > 0 ? photos : [null, null, null];
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const touchX = useRef(null);

  const goTo = (n) => setIdx((n + slides.length) % slides.length);
  const restart = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5500);
  };
  useEffect(() => { restart(); return () => clearInterval(timer.current); }, [slides.length]);

  const placeholders = [
    { mark: <span className="slide-mono">A<span>&amp;</span>F</span>, cap: "A quiet promise" },
    { mark: <span className="slide-moon">☾</span>, cap: "Two souls, one journey" },
    { mark: <span className="slide-star">✦</span>, cap: "Moments, softly held" },
  ];

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
          {slides.map((src, i) => (
            <div className="carousel-slide" key={i}>
              {src ? (
                <img className="slide-photo" src={src} alt={`Couple photo ${i + 1}`} draggable={false} />
              ) : (
                <div className="slide-frame">
                  {placeholders[i % 3].mark}
                  <p>{placeholders[i % 3].cap}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="carousel-arrow prev" type="button" aria-label="Previous photo"
          onClick={() => { goTo(idx - 1); restart(); }}>‹</button>
        <button className="carousel-arrow next" type="button" aria-label="Next photo"
          onClick={() => { goTo(idx + 1); restart(); }}>›</button>
      </div>
      <div className="carousel-dots" role="tablist" aria-label="Gallery photos">
        {slides.map((_, i) => (
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
  return (
    <>
      <section className="cream section-pad">
        <Reveal>
          <p className="eyebrow">{welcome.eyebrow}</p>
          <h2 className="script-heading">{welcome.heading}</h2>
          <Divider />
          <p className="lede">{welcome.text}</p>
          <p className="signature">{couple.bride.name} <span>&amp;</span> {couple.groom.name}</p>
          <div className="floral-rule" aria-hidden="true" />
        </Reveal>
      </section>

      <section className="cream-deep section-pad">
        <Reveal>
          <p className="eyebrow">{dateSection.eyebrow}</p>
          <h2 className="script-heading">{dateSection.heading}</h2>
          <Divider />
          <ScratchCard />
        </Reveal>
      </section>

      <section className="countdown-band">
        <Reveal>
          <p className="eyebrow light">{dateSection.countdownEyebrow}</p>
          <h2 className="script-heading light">{dateSection.countdownHeading}</h2>
          <Divider />
          <Countdown />
        </Reveal>
      </section>

      <section className="cream section-pad">
        <Reveal>
          <p className="eyebrow">{events.eyebrow}</p>
          <h2 className="script-heading">{events.heading}</h2>
          <Divider />
          <div className="fest-grid">
            {events.list.map((ev) => (
              <article className={`fest-card${ev.highlight ? " highlight" : ""}`} key={ev.name}>
                <h3>{ev.name}</h3>
                <p className="fest-when">{ev.date.toUpperCase()} &nbsp;•&nbsp; {ev.time.toUpperCase()}</p>
                <p className="fest-where">{ev.venue}</p>
                <a className="text-btn" href={ev.mapsUrl} target="_blank" rel="noreferrer">
                  VIEW ON GOOGLE MAPS
                </a>
              </article>
            ))}
          </div>
          <p className="placeholder-note">{events.note}</p>
        </Reveal>
      </section>

      <section className="cream section-pad story-section">
        <div className="petals" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => <span key={i} />)}
        </div>
        <Reveal>
          <p className="eyebrow">{gallery.eyebrow}</p>
          <h2 className="script-heading">{gallery.heading}</h2>
          <Divider />
          <Gallery />
        </Reveal>
      </section>

      <section className="cream section-pad">
        <Reveal>
          <div className="venue-card">
            <p className="eyebrow light">{venue.eyebrow}</p>
            <h2 className="script-heading light">{venue.name}</h2>
            <p className="venue-addr">{venue.address}</p>
            <a className="outline-gold" href={venue.mapsUrl} target="_blank" rel="noreferrer">
              VIEW ON GOOGLE MAPS
            </a>
            <div className="venue-map">
              <iframe
                title={`Wedding venue map — ${venue.name}`}
                src={venue.embedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="cream section-pad">
        <Reveal>
          <p className="eyebrow">{dressCode.eyebrow}</p>
          <h2 className="script-heading">{dressCode.heading}</h2>
          <Divider />
          <p className="lede small">{dressCode.text}</p>
          <div className="palette" aria-hidden="true">
            {dressCode.palette.map((c) => <span key={c} style={{ "--c": c }} />)}
          </div>
        </Reveal>
      </section>

      <section className="cream section-pad">
        <Reveal>
          <div className="rsvp-card">
            <p className="eyebrow">{rsvp.eyebrow}</p>
            <h2 className="script-heading">{rsvp.heading}</h2>
            <p className="rsvp-intro">{rsvp.text}</p>
            <a className="gold-button wa-button" href={rsvp.whatsapp} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.7-.2.5-.9 2.1-.9 5.1s.9 3.5 1.1 3.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z" />
              </svg>
              {rsvp.buttonLabel}
            </a>
            <p className="form-note">Opens WhatsApp with a pre-filled message.</p>
          </div>
        </Reveal>
      </section>

      <section className="presence-band section-pad">
        <Reveal>
          <p className="eyebrow light">{closing.eyebrow}</p>
          <h2 className="script-heading light">{closing.heading}</h2>
          <Divider />
          <p className="presence-text">{closing.text}</p>
        </Reveal>
      </section>

      <footer className="footer cream">
        <Reveal className="footer-arch">
          <h2 className="script-heading">{footer.heading}</h2>
          <p className="signature">{couple.bride.name} <span>&amp;</span> {couple.groom.name}</p>
          <p className="footer-meta">{footer.meta}</p>
        </Reveal>
      </footer>
    </>
  );
}
