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
  return <div className="divider" aria-hidden="true"><span>✦</span></div>;
}

/* Small consistent icon set for the timeline */
function Icon({ name }) {
  const common = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true };
  if (name === "calendar")
    return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
  if (name === "clock")
    return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  return <svg {...common}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
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

/* ---------------- gallery carousel (only with real photos) ---------------- */
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

/* ---------------- events: featured ceremony + timeline ---------------- */
function Events() {
  const { eyebrow, heading, list, note } = config.events;
  const main = list.find((e) => e.highlight) || list[0];
  const rest = list.filter((e) => e !== main);
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="script-heading">{heading}</h2>
      <Divider />
      <article className="event-feature">
        <h3 className="ev-name">{main.name}</h3>
        <div className="ev-rows">
          <div className="ev-row"><Icon name="calendar" /><strong>{main.date}</strong></div>
          <div className="ev-row"><Icon name="clock" />{main.time}</div>
          <div className="ev-row"><Icon name="pin" />{main.venue}</div>
        </div>
        <a className="text-btn" href={main.mapsUrl} target="_blank" rel="noreferrer">
          VIEW ON GOOGLE MAPS
        </a>
      </article>
      <div className="timeline">
        {rest.map((ev) => (
          <div className="t-item" key={ev.name}>
            <h3>{ev.name}</h3>
            <div className="t-meta">
              <span><Icon name="calendar" /><strong>{ev.date}</strong></span>
              <span><Icon name="clock" />{ev.time}</span>
              <span><Icon name="pin" />{ev.venue}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="placeholder-note">{note}</p>
    </>
  );
}

/* ---------------- all scrolling sections ---------------- */
export default function Sections() {
  const { welcome, dateSection, gallery, venue, dressCode, rsvp, closing, footer, couple } = config;
  const showGallery = gallery.photos.length > 0;

  return (
    <>
      <section className="ivory section-pad">
        <Reveal>
          <p className="eyebrow">{welcome.eyebrow}</p>
          <h2 className="script-heading">{welcome.heading}</h2>
          <Divider />
          <p className="lede">{welcome.text}</p>
          <p className="signature">{couple.bride.name} <span>&amp;</span> {couple.groom.name}</p>
        </Reveal>
      </section>

      <section className="ivory-deep section-pad">
        <Reveal>
          <p className="eyebrow">{dateSection.eyebrow}</p>
          <h2 className="script-heading">{dateSection.heading}</h2>
          <Divider />
          <p className="scratch-hint">Gently scratch the foil to reveal our wedding date.</p>
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

      <section className="ivory section-pad">
        <Reveal><Events /></Reveal>
      </section>

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

      <section className="ivory-deep section-pad">
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

      <section className="ivory section-pad">
        <Reveal>
          <p className="eyebrow">{dressCode.eyebrow}</p>
          <h2 className="script-heading">{dressCode.heading}</h2>
          <Divider />
          <p className="lede">{dressCode.text}</p>
          <div className="palette" aria-label="Suggested colour palette">
            {dressCode.palette.map((s) => (
              <div className="swatch" key={s.label}>
                <i style={{ "--c": s.color }} aria-hidden="true" />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="rsvp-band">
        <Reveal>
          <p className="eyebrow light">{rsvp.eyebrow}</p>
          <h2 className="script-heading light">{rsvp.heading}</h2>
          <Divider />
          <p className="rsvp-text">{rsvp.text}</p>
          <a className="gold-button" href={rsvp.whatsapp} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.7-.2.5-.9 2.1-.9 5.1s.9 3.5 1.1 3.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z" />
            </svg>
            {rsvp.buttonLabel}
          </a>
          <p className="rsvp-heart" aria-hidden="true">♥</p>
          <p className="rsvp-note">{closing.text}</p>
        </Reveal>
      </section>

      <footer className="footer ivory">
        <Reveal>
          <div className="footer-mono" aria-hidden="true">A&F</div>
          <p className="footer-names">{couple.bride.name} &amp; {couple.groom.name}</p>
          <p className="footer-meta">{footer.meta}</p>
        </Reveal>
      </footer>
    </>
  );
}
