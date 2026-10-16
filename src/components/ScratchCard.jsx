import { useEffect, useRef, useState } from "react";
import config from "../config";

/** Canvas scratch-to-reveal card. Maroon + gold foil over the wedding date. */
export default function ScratchCard() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const last = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let done = false;

    const paintFoil = () => {
      const w = canvas.width, h = canvas.height;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#6b1020");
      g.addColorStop(0.4, "#3a0812");
      g.addColorStop(0.65, "#52101c");
      g.addColorStop(1, "#2b060d");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(201,162,74,0.28)";
      ctx.lineWidth = Math.max(5, w * 0.018);
      for (let x = -h; x < w + h; x += w * 0.13) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h * 0.5, h); ctx.stroke();
      }
      ctx.fillStyle = "rgba(201,162,74,0.22)";
      const step = Math.max(10, w * 0.03);
      for (let yy = step / 2; yy < h; yy += step)
        for (let xx = step / 2; xx < w; xx += step) {
          ctx.beginPath(); ctx.arc(xx, yy, Math.max(1.5, w * 0.004), 0, 7); ctx.fill();
        }
      ctx.fillStyle = "rgba(243,226,179,0.92)";
      ctx.font = `600 ${Math.round(h * 0.13)}px 'Cormorant Garamond', Georgia, serif`;
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
      const rad = Math.max(24, r.width * 0.07) * dpr;
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
    <div className="scratch-frame">
      <span className="corner tl" aria-hidden="true" />
      <span className="corner tr" aria-hidden="true" />
      <span className="corner bl" aria-hidden="true" />
      <span className="corner br" aria-hidden="true" />
      <div className="scratch-wrap" ref={wrapRef}>
        <div className="scratch-under">
          <p className="under-eyebrow">{d.revealTitle}</p>
          <p className="under-date">{d.revealDate}</p>
          <p className="under-day">{d.revealDay}</p>
        </div>
        <canvas
          ref={canvasRef}
          id="scratchCanvas"
          className={revealed ? "gone" : ""}
          aria-label="Scratch card — drag to reveal the wedding date"
        />
      </div>
    </div>
  );
}
