import { useRef } from "react";
import { motion } from "framer-motion";
import config from "../config";

/**
 * Full-poster opening: first frame of the video as a poster with a
 * "Tap to Open" veil. On tap, the video plays once, inline, no controls.
 * On ended -> seamless crossfade into the hero mounted behind it.
 * Playback failure or reduced-motion -> visible "Open Invitation" fallback.
 */
export default function Opening({ phase, failed, onTap, onEnded, onFailed, onSkip }) {
  const videoRef = useRef(null);

  const handleEnded = () => {
    // Cut the video instantly: the hero behind shows the exact same final
    // frame, so this is invisible — and it kills any end-of-video flash
    // before the overlay crossfade begins.
    const v = videoRef.current;
    if (v) v.style.opacity = "0";
    onEnded();
  };

  const handleTap = () => {
    const v = videoRef.current;
    if (!v) { onSkip(); return; }
    onTap();
    const p = v.play();
    if (p && p.catch) {
      p.catch(() => {
        // Autoplay/playback rejected — show the fallback instead of hanging.
        onFailed();
      });
    }
  };

  return (
    <motion.div
      className="opening"
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeOut" } }}
      aria-label="Wedding invitation opening"
      role="dialog"
    >
      <video
        ref={videoRef}
        className="opening-video"
        src={config.assets.openingVideo}
        poster={config.assets.poster}
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        onEnded={handleEnded}
        onError={onFailed}
      />
      <div className="intro-vignette" aria-hidden="true" />

      {phase === "poster" && !failed && (
        <div
          className="intro-veil"
          onClick={handleTap}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleTap();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Tap to open the invitation"
        >
          <img
            className="veil-poster"
            src={config.assets.poster}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <div className="veil-content">
            <p className="veil-eyebrow">✦ &nbsp;A CELEBRATION OF LOVE &amp; BLESSINGS&nbsp; ✦</p>
          <p className="veil-tap">TAP TO OPEN</p>
          </div>
        </div>
      )}

      {failed && (
        <div className="intro-veil">
          <img
            className="veil-poster"
            src={config.assets.poster}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <div className="veil-content">
            <p className="veil-eyebrow">✦ &nbsp;A CELEBRATION OF LOVE &amp; BLESSINGS&nbsp; ✦</p>
            <button className="gold-button" type="button" onClick={onSkip}>
              OPEN INVITATION <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
