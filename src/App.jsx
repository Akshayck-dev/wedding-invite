import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import config from "./config";
import Opening from "./components/Opening";
import Hero from "./components/Hero";
import Sections from "./components/Sections";
import MusicToggle from "./components/MusicToggle";

export default function App() {
  const [phase, setPhase] = useState("poster"); // poster | playing | entered
  const [failed, setFailed] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [musicStartSignal, setMusicStartSignal] = useState(0);
  const reduceMotion = useReducedMotion();
  const contentTimer = useRef(null);

  useEffect(() => () => {
    if (contentTimer.current) clearTimeout(contentTimer.current);
  }, []);

  // Preload + decode the hero background (exact final video frame) before
  // playback starts, so the ended-crossfade never flashes or jumps.
  useEffect(() => {
    [config.assets.heroFinalFrame, config.assets.poster].forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) img.decode().catch(() => {});
    });
  }, []);

  // Lock scrolling until the invitation is revealed.
  useEffect(() => {
    document.body.style.overflow = phase === "entered" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  const enter = useCallback(() => {
    setPhase((p) => {
      if (p === "entered") return p;
      // Mount the heavy sections only AFTER the crossfade finishes,
      // so the video -> hero handoff (and the name reveal) stays smooth.
      contentTimer.current = setTimeout(() => setContentReady(true), 780);
      return "entered";
    });
  }, []);

  const handleTap = useCallback(() => {
    setMusicStartSignal((n) => n + 1); // same gesture starts the music
    if (reduceMotion) {
      enter(); // reduced motion: skip the video entirely
      return;
    }
    setPhase("playing");
  }, [reduceMotion, enter]);

  const handleFailed = useCallback(() => setFailed(true), []);
  const handleSkip = useCallback(() => enter(), [enter]);

  const entered = phase === "entered";

  return (
    <div className="stage">
      <div className="site">
        {/* Hero stays mounted behind the opening video for a seamless handoff */}
        <Hero started={entered} />
        {contentReady && <Sections />}
      </div>

      <AnimatePresence>
        {!entered && (
          <Opening
            key="opening"
            phase={phase}
            failed={failed}
            onTap={handleTap}
            onEnded={enter}
            onFailed={handleFailed}
            onSkip={handleSkip}
          />
        )}
      </AnimatePresence>

      <MusicToggle startSignal={musicStartSignal} />
    </div>
  );
}
