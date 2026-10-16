import { useEffect, useRef, useState } from "react";
import config from "../config";

/** Rounded-rect path helper (ctx.roundRect fallback). */
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Square canvas scratch-to-reveal card. Maroon + gold foil over the wedding date. */
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
      const rg = ctx.createRadialGradient(w / 2, h * 0.3, 10, w / 2, h * 0.3, w * 0.75);
      rg.addColorStop(0, "rgba(255,240,200,0.20)");
      rg.addColorStop(1, "rgba(255,240,200,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
      // double gold rim
      const rim = ctx.createLinearGradient(0, 0, w, h);
      rim.addColorStop(0, "#e9c766");
      rim.addColorStop(0.5, "#b98a34");
      rim.addColorStop(1, "#f3e2b3");
      rr(ctx, w * 0.03, h * 0.03, w * 0.94, h * 0.94, w * 0.05);
      ctx.strokeStyle = rim;
      ctx.lineWidth = Math.max(4, w * 0.014);
      ctx.stroke();
      rr(ctx, w * 0.055, h * 0.055, w * 0.89, h * 0.89, w * 0.04);
      ctx.strokeStyle = "rgba(233,199,102,0.45)";
      ctx.lineWidth = Math.max(2, w * 0.006);
      ctx.stroke();
      // hint text
      ctx.fillStyle = "rgba(243,226,179,0.95)";
      ctx.font = `600 ${Math.round(h * 0.06)}px 'Cormorant Garamond', Georgia, serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("✦  SCRATCH HERE  ✦", w / 2, h / 2);
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
      const rad = Math.max(28, r.width * 0.1) * dpr;
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
  const numericDate = (() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d.iso || "");
    return m ? `${parseInt(m[3], 10)} • ${parseInt(m[2], 10)} • ${m[1]}` : d.revealDate;
  })();

  return (
    <div className={`scratch-stage${revealed ? " revealed" : ""}`} ref={wrapRef}>
      <div className="scratch-under">
        <span className="scratch-rose-bg" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#8e1f2f" />
            <circle cx="50" cy="50" r="34" fill="#b03a48" />
            <circle cx="50" cy="50" r="22" fill="#d4697a" />
            <circle cx="50" cy="50" r="9" fill="#e9c766" />
          </svg>
        </span>
        <p className="under-eyebrow">{d.revealTitle}</p>
        <span className="scratch-mini-div" aria-hidden="true"><i />✦<i /></span>
        <p className="under-date num">{numericDate}</p>
        <p className="under-day">{d.revealDay}</p>
      </div>
      <canvas
        ref={canvasRef}
        className={`scratch-foil${revealed ? " gone" : ""}`}
        aria-label="Scratch card — drag to reveal the wedding date"
      />
      {!revealed && (
        <span className="scratch-hint" aria-hidden="true">SCRATCH TO REVEAL</span>
      )}
    </div>
  );
}
