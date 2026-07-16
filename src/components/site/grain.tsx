/**
 * Site-wide print grain. A fixed, non-interactive SVG feTurbulence overlay at low
 * opacity so the whole page reads like a printed monograph page. Static (no JS,
 * no animation) — safe for reduced-motion and effectively free to render.
 */
const NOISE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)'/>
  </svg>`,
)}`;

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "140px 140px",
      }}
    />
  );
}
