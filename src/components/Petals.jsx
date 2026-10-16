import { useEffect, useRef } from "react";

/** Gentle falling rose petals drifting over the invitation. Respects reduced motion. */
export default function Petals({ count = 22 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    try {
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    } catch (err) {}
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;

    const COLORS = ["#b03a48", "#c65b6a", "#e8a0a8", "#c9a24a", "#8e1f2f"];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (anyY) => ({
      x: Math.random() * w,
      y: anyY ? Math.random() * h : -24 - Math.random() * 40,
      s: 5 + Math.random() * 9,
      vy: 0.35 + Math.random() * 0.75,
      phase: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.014,
      swayAmp: 0.3 + Math.random() * 0.5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.45 + Math.random() * 0.4,
    });
    const petals = Array.from({ length: count }, () => spawn(true));

    const drawPetal = (p) => {
      const s = p.s;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.55, s * 0.65, s * 0.7, 0, s);
      ctx.bezierCurveTo(-s * 0.65, s * 0.7, -s * 0.9, -s * 0.55, 0, -s);
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.phase += p.swaySpeed;
        p.y += p.vy;
        p.x += Math.sin(p.phase) * p.swayAmp;
        p.rot += p.vr;
        if (p.y > h + 30) petals[i] = spawn(false);
        drawPetal(petals[i]);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="petals-canvas" aria-hidden="true" />;
}
