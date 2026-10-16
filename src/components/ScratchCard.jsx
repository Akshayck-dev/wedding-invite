import { useEffect, useRef, useState } from "react";
import config from "../config";

/** Heart path in a 0..100 box (shared by the SVG clip + canvas rim). */
function traceHeart(ctx, w, h) {
  const X = (v) => (v / 100) * w;
  const Y = (v) => (v / 100) * h;
  ctx.beginPath();
  ctx.moveTo(X(50), Y(88));
  ctx.bezierCurveTo(X(30), Y(70), X(10), Y(52), X(10), Y(30));
  ctx.bezierCurveTo(X(10), Y(14), X(22), Y(6), X(34), Y(6));
  ctx.bezierCurveTo(X(42), Y(6), X(48), Y(10), X(50), Y(18));
  ctx.bezierCurveTo(X(52), Y(10), X(58), Y(6), X(66), Y(6));
  ctx.bezierCurveTo(X(78), Y(6), X(90), Y(14), X(90), Y(30));
  ctx.bezierCurveTo(X(90), Y(52), X(70), Y(70), X(50), Y(88));
  ctx.closePath();
}

/** Heart-shaped canvas scratch-to-reveal. Maroon + gold foil over the wedding date. */
export default function ScratchCard({ onReveal }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const last = useRef(null);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let done = false;

    const paintFoil = () => {
      const w = canvas.width, h = canvas.height;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#7a1626");
      g.addColorStop(0.4, "#3a0812");
      g.addColorStop(0.65, "#5c1220");
      g.addColorStop(1, "#2b060d");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // brushed diagonal sheen
      ctx.strokeStyle = "rgba(201,162,74,0.25)";
      ctx.lineWidth = Math.max(5, w * 0.018);
      for (let x = -h; x < w + h; x += w * 0.13) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h * 0.5, h); ctx.stroke();
      }
      // gold speckles
      ctx.fillStyle = "rgba(201,162,74,0.22)";
      const step = Math.max(10, w * 0.03);
      for (let yy = step / 2; yy < h; yy += step)
        for (let xx = step / 2; xx < w; xx += step) {
          ctx.beginPath(); ctx.arc(xx, yy, Math.max(1.5, w * 0.004), 0, 7); ctx.fill();
        }
      // soft top-light
      const rg = ctx.createRadialGradient(w / 2, h * 0.28, 10, w / 2, h * 0.28, w * 0.7);
      rg.addColorStop(0, "rgba(255,240,200,0.20)");
      rg.addColorStop(1, "rgba(255,240,200,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
      // gold rim along the heart edge
      traceHeart(ctx, w, h);
      const rim = ctx.createLinearGradient(0, 0, w, h);
      rim.addColorStop(0, "#e9c766");
      rim.addColorStop(0.5, "#b98a34");
      rim.addColorStop(1, "#f3e2b3");
      ctx.strokeStyle = rim;
      ctx.lineWidth = Math.max(4, w * 0.016);
      ctx.stroke();
      // hint text
      ctx.fillStyle = "rgba(243,226,179,0.95)";
      ctx.font = `600 ${Math.round(h * 0.075)}px 'Cormorant Garamond', Georgia, serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("✦  SCRATCH HERE  ✦", w / 2, h * 0.44);
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect();
      if (r.width < 10 || r.height < 10 || done) return;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      paintFoil();
    };

    const scratchAt = (clientX, clientY) => {
      const r = canvas.getBoundingClientRect();
      const dpr = canvas.width / r.width;
      const x = (clientX - r.left) * dpr;
      const y = (clientY - r.top) * dpr;
      const rad = Math.max(26, r.width * 0.085) * dpr;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      if (last.current) {
        ctx.lineWidth = rad * 2;
        ctx.lineCap = "round";
        ctx.moveTo(last.current.x, last.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.arc(x, y, rad, 0, 7);
        ctx.fill();
      }
      last.current = { x, y };
    };

    const clearedFraction = () => {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const step = 32;
      let total = 0, clear = 0;
      for (let i = 3; i < data.length; i += 4 * step) {
        total++;
        if (data[i] < 40) clear++;
      }
      return clear / total;
    };

    const finish = () => {
      done = true;
      setRevealed(true);
      if (onRevealRef.current) onRevealRef.current();
      setTimeout(() => { canvas.style.display = "none"; }, 800);
    };

    const down = (e) => {
      if (done) return;
      drawing.current = true; last.current = null;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      scratchAt(e.clientX, e.clientY);
    };
    const move = (e) => {
      if (!drawing.current || done) return;
      scratchAt(e.clientX, e.clientY);
    };
    const up = () => {
      if (!drawing.current) return;
      drawing.current = false; last.current = null;
      if (!done && clearedFraction() > 0.4) finish();
    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => canvas.addEventListener(ev, up));
    return () => {
      window.removeEventListener("resize", sizeCanvas);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => canvas.removeEventListener(ev, up));
    };
  }, []);

  const d = config.dateSection;
  return (
    <div className={`heart-stage${revealed ? " revealed" : ""}`} ref={wrapRef}>
      <svg className="heart-defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5 0.88 C0.3 0.7 0.1 0.52 0.1 0.3 C0.1 0.14 0.22 0.06 0.34 0.06 C0.42 0.06 0.48 0.1 0.5 0.18 C0.52 0.1 0.58 0.06 0.66 0.06 C0.78 0.06 0.9 0.14 0.9 0.3 C0.9 0.52 0.7 0.7 0.5 0.88 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="heart-under heart-clip">
        <p className="under-eyebrow">{d.revealTitle}</p>
        <p className="under-date">{d.revealDate}</p>
        <p className="under-day">{d.revealDay}</p>
      </div>
      <canvas
        ref={canvasRef}
        className={`heart-foil heart-clip${revealed ? " gone" : ""}`}
        aria-label="Heart scratch card — drag to reveal the wedding date"
      />
      {!revealed && (
        <span className="heart-hint" aria-hidden="true">SCRATCH TO REVEAL</span>
      )}
    </div>
  );
}
