import { useEffect, useRef, useState } from "react";
import config from "../config";

/** Small round fixed music toggle. Hides itself if the music file is missing. */
export default function MusicToggle({ startSignal }) {
  const audioRef = useRef(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  // startSignal increments every time the user taps "Tap to Open".
  useEffect(() => {
    if (!startSignal) return;
    const audio = new Audio(config.assets.music);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;
    const onCanPlay = () => {
      setAvailable(true);
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    const onError = () => {
      setAvailable(false);
      audioRef.current = null;
    };
    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audio.load();
    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.pause();
      audioRef.current = null;
    };
  }, [startSignal]);

  if (!available) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <button
      className={`music-toggle${playing ? " on" : ""}`}
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause background music" : "Play background music"}
      aria-pressed={playing}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
      )}
    </button>
  );
}
