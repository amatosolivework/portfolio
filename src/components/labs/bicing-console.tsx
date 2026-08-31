"use client";

import { useCallback, useRef, useState } from "react";
import { BicingMap, type Station } from "./bicing-map";
import { BicingPredictor } from "./bicing-predictor";

type Backtest = Parameters<typeof BicingPredictor>[0]["backtest"];

/** The instrument panel: map and predictor share one selection — clicking a
 * station on the map hands it to the "will there be a bike?" widget. */
export function BicingConsole({
  stations,
  backtest,
}: {
  stations: Station[];
  backtest: Backtest;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const onStationSelect = useCallback((id: number) => {
    setSelectedId(id);
    widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-[1fr_minmax(420px,540px)]">
        <div className="md:order-2">
          <BicingMap stations={stations} onStationSelect={onStationSelect} />
        </div>
        <div className="md:order-1 md:self-center">
          <p className="max-w-md text-sm leading-relaxed text-[#F4EDE3]/45">
            Each dot is a station, sized by capacity. Colour is the deviation
            from that station&rsquo;s own daily average — blue where bikes
            have left, amber where they gather. Stations near their normal
            fade out: only the tide is drawn.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#F4EDE3]/45">
            Scrub the pulse chart, or press play and watch a whole day
            breathe: at eight the residential belt turns blue as the bikes
            pour downhill; through the evening the amber drains back up.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#F4EDE3]/45">
            Click any station to ask it the question below.
          </p>
        </div>
      </div>

      <div className="mt-10 h-px w-full bg-white/10" />

      {/* the predictor */}
      <div className="mt-8" ref={widgetRef}>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
          <span className="text-[#F4EDE3]">Will there be a bike?</span>
          <span className="text-[#F4EDE3]/50">
            click the map, or ask a year of data
          </span>
        </div>
        <BicingPredictor
          stations={stations}
          backtest={backtest}
          selectedId={selectedId}
        />
      </div>
    </>
  );
}
