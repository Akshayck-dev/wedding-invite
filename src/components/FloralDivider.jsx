/** Stylized rose-garland divider strip between sections. */
export default function FloralDivider({ className = "" }) {
  const roses = [70, 190, 300, 410, 530];
  const leaves = [];
  for (let x = 24; x <= 576; x += 36) {
    if (roses.some((r) => Math.abs(r - x) < 36)) continue;
    leaves.push(x);
  }
  return (
    <div className={`floral-divider ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 60" preserveAspectRatio="xMidYMid meet">
        <path d="M0 33 Q 150 21 300 33 T 600 33" fill="none" stroke="#7a6b3f"
          strokeWidth="2" opacity="0.65" />
        {leaves.map((x, i) => (
          <g key={x} transform={`translate(${x} 33) rotate(${(i % 2 ? -1 : 1) * 34})`}>
            <line x1="0" y1="0" x2="0" y2="-19" stroke="#55632f" strokeWidth="1.4" />
            <ellipse cx="0" cy="-10" rx="6.5" ry="12" fill="#6b7a3f" opacity="0.8" />
          </g>
        ))}
        {[150, 300, 450].map((x) => (
          <g key={`b-${x}`}>
            <circle cx={x - 14} cy={26} r="2.6" fill="#c9a24a" />
            <circle cx={x + 14} cy={26} r="2.6" fill="#c9a24a" />
          </g>
        ))}
        {roses.map((x, i) => {
          const big = i === 2;
          const r1 = big ? 15 : 11, r2 = big ? 10.5 : 7.6, r3 = big ? 6 : 4.4, r4 = big ? 2.6 : 2;
          return (
            <g key={x} transform={`translate(${x} 31)`}>
              <circle r={r1} fill="#8e1f2f" />
              <circle r={r2} fill="#b03a48" />
              <circle r={r3} fill="#d4697a" />
              <circle r={r4} fill="#e9c766" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
