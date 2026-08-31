const PAPER = "#F4EDE3";
const AMBER = "#FF7A2F";

const LABELS: Record<string, string> = {
  ridge: "small ridge regression (calendar + yesterday's shape)",
  "media-hora-tipo": "the rule — hourly average by day type",
  persistencia: "persistence (yesterday's cheap hours)",
  "mediodia-fijo": "fixed midday, 1–3 PM",
  "madrugada-fija": "fixed pre-dawn, 2–4 AM (folk wisdom)",
  "cualquier-hora": "any random hour",
};

type Row = { regret_pct: number; euros_extra_anyo: number };

/**
 * The competition, as one static SVG — no client JS. Every contender picks a
 * 2h window each evening for the next day; bars are the year's extra cost vs
 * perfect information.
 */
export function LuzCompetition({ resumen, mensual }: {
  resumen: Record<string, Row>;
  mensual: Record<string, number>;
}) {
  const rows = Object.entries(resumen)
    .filter(([k]) => k !== "optimo")
    .sort(([, a], [, b]) => a.regret_pct - b.regret_pct);

  const W = 940;
  const RH = 46;
  const T = 8;
  const H = T + rows.length * RH + 26;
  const barX = 8;
  const maxPct = Math.max(...rows.map(([, r]) => r.regret_pct));
  const barW = (p: number) => ((W - barX - 190) * p) / maxPct;

  return (
    <div className="overflow-x-auto pb-1">
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full min-w-[760px]" role="img"
      aria-label="Extra yearly cost of each strategy versus perfect information">
      {rows.map(([key, r], i) => {
        const star = key === "media-hora-tipo";
        const yTop = T + i * RH;
        return (
          <g key={key}>
            <text x={barX} y={yTop + 12} fontSize={12}
              fill={star ? AMBER : `${PAPER}99`}
              fontWeight={star ? 700 : 400}>
              {LABELS[key]}
            </text>
            <rect x={barX} y={yTop + 19} height={11}
              width={Math.max(3, barW(r.regret_pct))}
              fill={star ? AMBER : `${PAPER}38`} rx={1} />
            <text x={barX + Math.max(3, barW(r.regret_pct)) + 9} y={yTop + 29}
              fontSize={11.5} fill={star ? PAPER : `${PAPER}80`}
              fontFamily="var(--font-mono, monospace)">
              +{r.regret_pct.toFixed(0)}% · {r.euros_extra_anyo.toFixed(2)} €/yr
            </text>
          </g>
        );
      })}
      <line x1={barX} y1={T} x2={barX} y2={T + rows.length * RH - 10}
        stroke={PAPER} strokeWidth={1.2} />
      <text x={barX + 2} y={H - 8} fontSize={10.5} fill={`${PAPER}55`}
        fontFamily="var(--font-mono, monospace)">
        0% = checking the published tariff every evening · washing machine, 1
        kWh per daily 2h cycle
      </text>
      {/* the monthly failure strip lives in its own component below */}
      <MonthStrip mensual={mensual} x={W - 170} y={T + 6} />
    </svg>
    </div>
  );
}

/** tiny inset: the rule's monthly regret — winter is where it fails */
function MonthStrip({ mensual, x, y }: {
  mensual: Record<string, number>;
  x: number;
  y: number;
}) {
  const vals = Object.values(mensual);
  const w = 160;
  const h = 74;
  const max = Math.max(...vals);
  const px = (i: number) => x + (w * i) / (vals.length - 1);
  const py = (v: number) => y + 22 + (h - 34) * (1 - v / max);
  const path = vals.map((v, i) => `${i ? "L" : "M"}${px(i)},${py(v)}`).join(" ");
  const worst = vals.indexOf(max);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const worstName = MONTHS[Number(Object.keys(mensual)[worst].slice(5)) - 1];

  return (
    <g>
      <text x={x} y={y + 8} fontSize={10} fill={`${PAPER}70`}
        fontFamily="var(--font-mono, monospace)">
        THE RULE, MONTH BY MONTH
      </text>
      <path d={path} fill="none" stroke={AMBER} strokeWidth={1.6} />
      <circle cx={px(worst)} cy={py(max)} r={2.6} fill={AMBER} />
      <text x={px(worst)} y={py(max) - 6} fontSize={10} fill={PAPER}
        textAnchor="middle" fontFamily="var(--font-mono, monospace)">
        {worstName} +{max.toFixed(0)}%
      </text>
      <text x={x} y={y + h + 10} fontSize={9.5} fill={`${PAPER}55`}>
        no sun, no solar valley — winter is
      </text>
      <text x={x} y={y + h + 22} fontSize={9.5} fill={`${PAPER}55`}>
        where the rule loses its footing
      </text>
    </g>
  );
}
