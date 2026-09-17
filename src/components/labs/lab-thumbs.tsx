import Image from "next/image";
import luz from "../../../public/data/luz/luz.json";
import almacen from "../../../public/data/almacen/almacen.json";

/**
 * Card thumbnails for the labs index — each one drawn from the lab's own
 * published data, in the same dark/amber idiom as the exported figures.
 */

const INK = "#F4EDE3";
const AMBER = "#FF7A2F";

/* ---------------------------------- vision --------------------------------- */

const WARDROBE = [
  "11-polo-punto-negro.jpg",
  "12-zapatillas-nike-shox.jpg",
  "13-camisa-button-down-shirt.jpg",
  "20-chaqueta-biker-jacket.jpg",
  "26-jersey-sweater.jpg",
  "32-pantalon-cargo-pants.jpg",
  "39-sudadera-hoodie.jpg",
  "52-botas-timberland.jpg",
];

export function VisionMosaic() {
  return (
    <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-px bg-[#100D09]">
      {WARDROBE.map((file) => (
        <div key={file} className="relative overflow-hidden">
          <Image
            src={`/data/vision/thumbs/${file}`}
            alt=""
            fill
            sizes="120px"
            className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-95"
          />
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------- luz ----------------------------------- */

const HOURLY = (() => {
  const days = Object.values(luz.precios as Record<string, number[]>);
  const mean = Array.from({ length: 24 }, (_, h) => {
    let sum = 0;
    let n = 0;
    for (const day of days) {
      if (typeof day[h] === "number") {
        sum += day[h];
        n += 1;
      }
    }
    return sum / n;
  });
  return mean;
})();

export function LuzCurve() {
  const W = 430;
  const H = 224;
  const PAD = { top: 40, right: 28, bottom: 34, left: 28 };
  const min = Math.min(...HOURLY);
  const max = Math.max(...HOURLY);
  const x = (h: number) => PAD.left + (h / 23) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    PAD.top + (1 - (v - min) / (max - min)) * (H - PAD.top - PAD.bottom);
  const line = HOURLY.map((v, h) => `${h === 0 ? "M" : "L"}${x(h).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(23).toFixed(1)},${H - PAD.bottom} L${x(0).toFixed(1)},${H - PAD.bottom} Z`;
  const valleyHour = HOURLY.indexOf(min);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Average daily electricity price curve with the midday solar valley marked"
    >
      <text
        x={PAD.left}
        y={20}
        className="font-mono"
        fontSize={10}
        letterSpacing="0.12em"
        fill={INK}
        fillOpacity={0.45}
      >
        AVERAGE DAY, €/MWH · THE SOLAR VALLEY
      </text>
      <path d={area} fill={AMBER} opacity={0.1} />
      <path d={line} fill="none" stroke={AMBER} strokeWidth={2} />
      <circle cx={x(valleyHour)} cy={y(min)} r={4} fill={AMBER} />
      <text
        x={x(valleyHour)}
        y={H - 14}
        textAnchor="middle"
        className="font-mono"
        fontSize={10}
        letterSpacing="0.12em"
        fill={AMBER}
      >
        {String(valleyHour).padStart(2, "0")}
      </text>
      {["00", "23"].map((label) => (
        <text
          key={label}
          x={x(Number(label))}
          y={H - 14}
          textAnchor="middle"
          className="font-mono"
          fontSize={10}
          letterSpacing="0.12em"
          fill={INK}
          fillOpacity={0.35}
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

/* --------------------------------- almacen --------------------------------- */

const TOP5 = almacen.gate.raw.slice(0, 5);

export function AlmacenGate() {
  const W = 430;
  const H = 224;
  const PAD = { top: 34, right: 70, bottom: 18, left: 24 };
  const rowH = (H - PAD.top - PAD.bottom) / TOP5.length;
  const maxRev = Math.max(...TOP5.map((p) => p.revenue));
  const barW = (v: number) => (v / maxRev) * (W - PAD.left - PAD.right);
  const short = (name: string) =>
    name.length > 22 ? `${name.slice(0, 21)}…` : name;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Top five best sellers by raw revenue; service codes that are not real products are highlighted"
    >
      <text
        x={PAD.left}
        y={20}
        className="font-mono"
        fontSize={10}
        letterSpacing="0.12em"
        fill={INK}
        fillOpacity={0.45}
      >
        TOP SELLERS, RAW · AMBER = NOT A PRODUCT
      </text>
      {TOP5.map((p, i) => {
        const yTop = PAD.top + i * rowH;
        return (
          <g key={p.code}>
            <rect
              x={PAD.left}
              y={yTop + rowH * 0.42}
              width={barW(p.revenue)}
              height={rowH * 0.36}
              fill={p.service ? AMBER : INK}
              opacity={p.service ? 0.9 : 0.28}
            />
            <text
              x={PAD.left}
              y={yTop + rowH * 0.3}
              className="font-mono"
              fontSize={10}
              letterSpacing="0.08em"
              fill={INK}
              fillOpacity={p.service ? 0.85 : 0.5}
            >
              {short(p.name.toUpperCase())}
            </text>
            <text
              x={PAD.left + barW(p.revenue) + 8}
              y={yTop + rowH * 0.42 + rowH * 0.18}
              dominantBaseline="middle"
              className="font-mono"
              fontSize={10}
              fill={INK}
              fillOpacity={0.45}
            >
              £{Math.round(p.revenue / 1000)}k
            </text>
          </g>
        );
      })}
    </svg>
  );
}
