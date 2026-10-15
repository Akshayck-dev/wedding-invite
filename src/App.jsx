import { useEffect, useState } from "react";
import { ArrowRight, Music2, VolumeX, Sparkles } from "lucide-react";

/* Storyboard timings: 0.8s opening → 2.0s curtains appear → 3.5s curtains open
   → 5.0s full reveal → 7.0s names reveal → 7.0s+ call to action */
const PHASE_TIMES = [800, 2000, 3500, 5000, 7000];

function InvitationPage({ onBack }) {
  return (
    <main className="invitation-page">
      <div className="invitation-card">
        <span className="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
        <p className="eyebrow">WITH THE BLESSINGS OF OUR FAMILIES</p>
        <h1>Amina <em>&</em> Fahad</h1>
        <div className="ornament"><span>✦</span></div>
        <p className="invitation-copy">Joyfully invite you to celebrate<br />the beginning of their forever</p>
        <p className="date">SUNDAY · 15 NOVEMBER 2026</p>
        <p className="venue">THE GRAND PALACE · KOZHIKODE, KERALA</p>
        <button className="outline-button" onClick={onBack}>Replay the intro</button>
      </div>
    </main>
  );
}

export default function App() {
  const [phase, setPhase] = useState(0);
  const [runId, setRunId] = useState(0);
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const timers = PHASE_TIMES.map((ms, i) => window.setTimeout(() => setPhase(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, [runId]);

  const skipToEnd = () => setPhase(5);
  const replay = () => { setEntered(false); setPhase(0); setRunId((r) => r + 1); };
  const enterInvitation = () => setEntered(true);

  if (entered) {
    return <InvitationPage onBack={replay} />;
  }

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

        <div className="curtain curtain-left" aria-hidden="true">
          <div className="fabric-folds" /><div className="curtain-trim" />
        </div>
        <div className="curtain curtain-right" aria-hidden="true">
          <div className="fabric-folds" /><div className="curtain-trim" />
        </div>

        <div className="vignette" aria-hidden="true" />

        <section className="names-block">
          <span className="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <p className="eyebrow">THE WEDDING OF</p>
          <h1>
            <span className="name-line">Amina</span>
            <em>&</em>
            <span className="name-line">Fahad</span>
          </h1>
          <div className="ornament"><span>✦</span></div>
          <p className="tagline">TOGETHER IN FAITH<br />FOREVER IN LOVE</p>
          <button className="enter-button cta" onClick={enterInvitation}>
            OPEN INVITATION <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </section>

        <div className="intro-caption">
          <Sparkles size={13} />
          <span>A CELEBRATION OF LOVE & BLESSINGS</span>
        </div>
        <button className="skip-button" onClick={skipToEnd}>Skip intro <ArrowRight size={13} /></button>
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
