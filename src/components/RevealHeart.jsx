import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import config from "../config";

/**
 * Heart reveal — no scratch canvas, no scroll fights.
 * The foil heart melts away when scrolled into view (or on tap),
 * revealing the wedding date. Celebration fires via onReveal.
 */
export default function RevealHeart({ onReveal }) {
  const stageRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const inView = useInView(stageRef, { amount: 0.55, once: true });
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    if (onRevealRef.current) onRevealRef.current();
  }, []);

  useEffect(() => {
    if (inView) {
      const t = window.setTimeout(reveal, 500);
      return () => window.clearTimeout(t);
    }
  }, [inView, reveal]);

  const d = config.dateSection;
  const numericDate = (() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d.iso || "");
    return m ? `${parseInt(m[3], 10)} • ${parseInt(m[2], 10)} • ${m[1]}` : d.revealDate;
  })();

  return (
    <div
      ref={stageRef}
      className={`heart-stage${revealed ? " revealed" : ""}`}
      onClick={reveal}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } }}
      role="button"
      tabIndex={0}
      aria-label="Reveal our wedding date"
    >
      <svg className="heart-defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5 0.88 C0.3 0.7 0.1 0.52 0.1 0.3 C0.1 0.14 0.22 0.06 0.34 0.06 C0.42 0.06 0.48 0.1 0.5 0.18 C0.52 0.1 0.58 0.06 0.66 0.06 C0.78 0.06 0.9 0.14 0.9 0.3 C0.9 0.52 0.7 0.7 0.5 0.88 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="heart-under heart-clip">
        <span className="heart-rose-bg" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#8e1f2f" />
            <circle cx="50" cy="50" r="34" fill="#b03a48" />
            <circle cx="50" cy="50" r="22" fill="#d4697a" />
            <circle cx="50" cy="50" r="9" fill="#e9c766" />
          </svg>
        </span>
        <p className="under-eyebrow">{d.revealTitle}</p>
        <span className="heart-mini-div" aria-hidden="true"><i />✦<i /></span>
        <p className="under-date num">{numericDate}</p>
        <p className="under-day">{d.revealDay}</p>
      </div>

      <div className={`heart-foil heart-clip${revealed ? " gone" : ""}`} aria-hidden="true">
        <span className="heart-hint">TAP TO REVEAL</span>
      </div>
    </div>
  );
}
