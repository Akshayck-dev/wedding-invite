import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowRight, CalendarDays, Clock3, MapPin, Music2,
  Volume2, VolumeX, Heart, Menu, X, Sparkles
} from "lucide-react";

/* Storyboard timings: 0.8s opening -> 2.0s curtains appear -> 3.5s curtains open
   -> 5.0s full reveal -> 7.0s names reveal -> 7.0s+ call to action */
const PHASE_TIMES = [800, 2000, 3500, 5000, 7000];

const events = [
  { time: "10:30 AM", title: "Welcome & Duas", detail: "A warm welcome with family and friends" },
  { time: "11:30 AM", title: "Nikah Ceremony", detail: "A beautiful beginning, blessed with prayers" },
  { time: "12:30 PM", title: "Celebration & Lunch", detail: "Gather, celebrate and share a meal" }
];

function Intro({ onEnter }) {
  const [phase, setPhase] = useState(0);
  const [runId, setRunId] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const timers = PHASE_TIMES.map((ms, i) => window.setTimeout(() => setPhase(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, [runId]);

  return (
    <main className={`intro phase-${phase}`}>
      <div className="scene">
        <div className="layer layer-opening" aria-hidden="true" />
        <div className="layer layer-hall" aria-hidden="true" />
        <div className="layer layer-arch" aria-hidden="true" />
        <div className="layer layer-hero" aria-hidden="true" />

        <div className="particles" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => <span key={i} />)}
        </div>
        <div className="light-burst" aria-hidden="true" />
        <div className="rays" aria-hidden="true" />
        <div className="flash" aria-hidden="true" />
        <div className="particles burst" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => <span key={i} />)}
        </div>

        <div className="curtain curtain-left" aria-hidden="true">
          <div className="fabric-folds" /><div className="curtain-trim" />
        </div>
        <div className="curtain curtain-right" aria-hidden="true">
          <div className="fabric-folds" /><div className="curtain-trim" />
        </div>
        <div className="door-medallion" aria-hidden="true"><span>✦</span></div>

        <div className="vignette" aria-hidden="true" />

        <section className="names-block">
          <span className="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <p className="eyebrow">THE WEDDING OF</p>
          <h1>
            <span className="name-line">Amina</span>
            <em>&</em>
            <span className="name-line">Fahad</span>
          </h1>
          <div className="ornament"><span>✦</span></div>
          <p className="tagline">TOGETHER IN FAITH<br />FOREVER IN LOVE</p>
          <button className="enter-button cta" onClick={onEnter}>
            OPEN INVITATION <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </section>

        <div className="intro-caption">
          <Sparkles size={13} />
          <span>A CELEBRATION OF LOVE & BLESSINGS</span>
        </div>
        <button className="skip-button" onClick={() => onEnter()}>Skip intro <ArrowRight size={13} /></button>
        <button
          className="sound-button"
          onClick={() => setSoundOn((v) => !v)}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          title="Sound is a visual toggle placeholder"
        >
          {soundOn ? <Music2 size={15} /> : <VolumeX size={15} />}
        </button>
      </div>
    </main>
  );
}

function Invitation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", attendance: "Joyfully accepts", guests: "2", message: "" });
  const [sent, setSent] = useState(false);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="site">
      <header className="site-header">
        <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); goTo("home"); }}>
          <span className="brand-mark">A<span>&</span>F</span>
          <span className="brand-label">THE WEDDING OF AMINA & FAHAD</span>
        </a>
        <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          {[["Our Story","story"],["Celebration","celebration"],["Details","details"],["RSVP","rsvp"]].map(([label,id]) =>
            <button key={id} onClick={() => goTo(id)}>{label}</button>
          )}
        </nav>
        <button className="sound-toggle" onClick={() => setSoundOn(v => !v)} aria-label={soundOn ? "Turn music off" : "Turn music on"} title="Music toggle placeholder">
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-glow" />
        <div className="hero-pattern" />
        <div className="hero-content">
          <p className="eyebrow"><span /> A NEW CHAPTER BEGINS <span /></p>
          <p className="arabic hero-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1><span>Amina</span><em>&</em><span>Fahad</span></h1>
          <p className="hero-subtitle">Together in faith, forever in love</p>
          <div className="hero-date"><CalendarDays size={16} /> SUNDAY, 15 NOVEMBER 2026</div>
          <button className="scroll-cue" onClick={() => goTo("story")} aria-label="Scroll to our story"><ArrowDown size={17} /></button>
        </div>
        <div className="hero-side-note">A DAY TO REMEMBER · 2026</div>
        <div className="hero-bottom-line" />
      </section>

      <section className="story section-pad" id="story">
        <div className="section-label">01 / OUR STORY</div>
        <div className="story-grid">
          <div className="story-art">
            <div className="story-arch">
              <div className="story-moon">☾</div>
              <div className="story-monogram">A<span>&</span>F</div>
              <p>MADE FOR EACH OTHER</p>
            </div>
            <span className="story-stamp">EST. 2026</span>
          </div>
          <div className="story-text">
            <p className="eyebrow">BISMILLAH IR-RAHMAN IR-RAHEEM</p>
            <h2>A beautiful beginning,<br /><em>blessed by love.</em></h2>
            <div className="small-ornament">✦ ───────── ✦</div>
            <p className="body-copy">With grateful hearts and the blessings of our families, we invite you to share in a day filled with faith, joy and the promise of forever.</p>
            <p className="body-copy">Your presence and prayers will make our celebration even more meaningful as we begin this new chapter together.</p>
            <div className="signature">With love, <span>Amina & Fahad</span></div>
          </div>
        </div>
      </section>

      <section className="celebration section-pad" id="celebration">
        <div className="section-label">02 / THE CELEBRATION</div>
        <div className="center-heading">
          <p className="eyebrow">A DAY FULL OF BLESSINGS</p>
          <h2>Join us for our <em>special day</em></h2>
          <p>Every moment is more beautiful when shared with you.</p>
        </div>
        <div className="event-list">
          {events.map((event, index) => (
            <article className="event-row" key={event.title}>
              <div className="event-index">0{index + 1}</div>
              <div className="event-time"><Clock3 size={15} /> {event.time}</div>
              <div className="event-main"><h3>{event.title}</h3><p>{event.detail}</p></div>
              <span className="event-star">✦</span>
            </article>
          ))}
        </div>
      </section>

      <section className="details section-pad" id="details">
        <div className="section-label">03 / THE DETAILS</div>
        <div className="details-grid">
          <div className="details-copy">
            <p className="eyebrow">SAVE THE DATE</p>
            <h2>We can't wait<br />to see <em>you.</em></h2>
            <div className="detail-item"><CalendarDays /><div><span>DATE</span><strong>Sunday, 15 November 2026</strong></div></div>
            <div className="detail-item"><Clock3 /><div><span>TIME</span><strong>10:30 AM onwards</strong></div></div>
            <div className="detail-item"><MapPin /><div><span>VENUE</span><strong>The Grand Palace</strong><small>Kozhikode, Kerala, India</small></div></div>
            <a className="text-link" href="https://maps.google.com/?q=Kozhikode+Kerala" target="_blank" rel="noreferrer">VIEW LOCATION <ArrowRight size={15} /></a>
          </div>
          <div className="venue-art">
            <div className="venue-sun" />
            <div className="venue-building"><div /><div /><div /></div>
            <div className="venue-caption"><span>THE WEDDING VENUE</span><strong>The Grand Palace</strong><small>Kozhikode · Kerala</small></div>
          </div>
        </div>
      </section>

      <section className="rsvp section-pad" id="rsvp">
        <div className="rsvp-card">
          <div className="section-label">04 / RSVP</div>
          <p className="eyebrow">KINDLY REPLY BY 01 NOVEMBER</p>
          <h2>Will you <em>join us?</em></h2>
          <p className="rsvp-intro">Please let us know if you can celebrate this special day with us.</p>
          {sent ? (
            <div className="success-message"><Heart size={25} /><h3>Thank you, {rsvp.name || "dear guest"}!</h3><p>Your RSVP has been prepared. Please send it to the couple through your preferred contact method.</p><button className="outline-button" onClick={() => setSent(false)}>Edit response</button></div>
          ) : (
            <form className="rsvp-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <label>Your name<input required value={rsvp.name} onChange={e => setRsvp({ ...rsvp, name: e.target.value })} placeholder="Full name" /></label>
              <label>Will you attend?<select value={rsvp.attendance} onChange={e => setRsvp({ ...rsvp, attendance: e.target.value })}><option>Joyfully accepts</option><option>Regretfully declines</option></select></label>
              <label>Number of guests<select value={rsvp.guests} onChange={e => setRsvp({ ...rsvp, guests: e.target.value })}><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label>
              <label>A note for the couple<textarea value={rsvp.message} onChange={e => setRsvp({ ...rsvp, message: e.target.value })} placeholder="Your wishes (optional)" rows="3" /></label>
              <button className="gold-button" type="submit">CONFIRM RSVP <ArrowRight size={15} /></button>
            </form>
          )}
          <p className="form-note">Demo form only · responses are not sent or stored.</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-motif">✦</div>
        <p className="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h2>Amina <em>&</em> Fahad</h2>
        <p>May Allah bless this union with love, peace and happiness.</p>
        <div className="footer-line" />
        <span>WITH LOVE & GRATITUDE · 15 NOVEMBER 2026</span>
        <button className="back-top" onClick={() => goTo("home")}><ArrowDown size={14} /> BACK TO TOP</button>
      </footer>
    </main>
  );
}


export default function App() {
  const [entered, setEntered] = useState(false);
  return entered ? <Invitation /> : <Intro onEnter={() => setEntered(true)} />;
}
