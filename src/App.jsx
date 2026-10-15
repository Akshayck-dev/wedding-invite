import { useEffect, useState } from "react";
import { ArrowRight, Music2, VolumeX, Sparkles } from "lucide-react";

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
  const [opened, setOpened] = useState(false);
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpened(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const enterInvitation = () => {
    setOpened(true);
    window.setTimeout(() => setEntered(true), 1500);
  };

  if (entered) {
    return <InvitationPage onBack={() => { setEntered(false); setOpened(false); window.setTimeout(() => setOpened(true), 100); }} />;
  }

  return (
    <main className={`intro ${opened ? "is-open" : ""}`}>
      <div className="scene">
        <div className="starfield" />
        <div className="moon">☾</div>
        <div className="distant-palace" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <div className="floor-glow" />
        <div className="lantern lantern-one"><i /><b>✧</b></div>
        <div className="lantern lantern-two"><i /><b>✧</b></div>
        <div className="lantern lantern-three"><i /><b>✧</b></div>
        <div className="rose rose-left">✿</div>
        <div className="rose rose-right">✿</div>

        <section className="arch">
          <div className="arch-border" />
          <div className="invitation-content">
            <span className="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <p className="eyebrow">THE WEDDING OF</p>
            <h1>Amina <em>&</em> Fahad</h1>
            <div className="ornament"><span>✦</span></div>
            <p className="tagline">TOGETHER IN FAITH<br />FOREVER IN LOVE</p>
            <button className="enter-button" onClick={enterInvitation}>
              OPEN INVITATION <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </section>

        <div className="curtain curtain-left"><div className="fabric-folds" /><div className="curtain-trim" /></div>
        <div className="curtain curtain-right"><div className="fabric-folds" /><div className="curtain-trim" /></div>

        <div className="intro-caption">
          <Sparkles size={13} />
          <span>A CELEBRATION OF LOVE & BLESSINGS</span>
        </div>
        <button className="skip-button" onClick={enterInvitation}>Skip intro <ArrowRight size={13} /></button>
        <button
          className="sound-button"
          onClick={() => setSoundOn(v => !v)}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          title="Sound is a visual toggle placeholder"
        >
          {soundOn ? <Music2 size={15} /> : <VolumeX size={15} />}
        </button>
      </div>
    </main>
  );
}