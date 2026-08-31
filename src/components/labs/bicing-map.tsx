"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { BicingPulse } from "./bicing-pulse";

// the bundler mangles maplibre's inlined worker (vector tiles never load,
// silently) — serve the library's own worker as a static asset instead.
// NB: the file in /public is copied from maplibre-gl/dist and must be
// refreshed if the dependency is upgraded.
maplibregl.setWorkerUrl("/maplibre-gl-worker-6.6.0.mjs");

export type Station = {
  id: number;
  nombre: string;
  lat: number;
  lon: number;
  cap: number;
  barrio: string;
  /** mean occupation %, [dayType][hour 0-23], ints 0-100 */
  occ: Record<string, (number | null)[]>;
  /** P(≥1 bike) %, [dayType][hour], null = not enough data */
  p: Record<string, (number | null)[]>;
};

export const DAY_TYPES = [
  { key: "laborable", label: "workday" },
  { key: "finde", label: "weekend" },
  { key: "agosto", label: "august" },
] as const;

const AMBER = "#FF7A2F";
const BLUE = "#6FA7DA";
const LIM = 12; // anomaly (occupation points) at which colour/opacity saturate

/** hourly anomaly per station, double-centered like the study's gate figure:
 * vs the station's own daily mean AND vs the citywide hourly swing, so the
 * rush-hour "bikes in transit" dip doesn't tint every dot at once.
 * Also returns the citywide occupancy curves — the pulse chart draws them. */
function computeAnomalies(stations: Station[]) {
  const anom = new Map<number, Record<string, number[]>>();
  const cityOcc: Record<string, number[]> = {};
  const cityAnom: Record<string, number[]> = {};
  for (const { key: t } of DAY_TYPES) {
    let capSum = 0;
    const cityHour = Array(24).fill(0);
    for (const s of stations) {
      capSum += s.cap;
      for (let h = 0; h < 24; h++) cityHour[h] += ((s.occ[t][h] ?? 0) * s.cap) / 100;
    }
    cityOcc[t] = cityHour.map((v) => (100 * v) / capSum);
    const cityMean = cityOcc[t].reduce((a, b) => a + b) / 24;
    cityAnom[t] = cityOcc[t].map((v) => v - cityMean);
  }
  for (const s of stations) {
    const rec: Record<string, number[]> = {};
    for (const { key: t } of DAY_TYPES) {
      const vals = s.occ[t].map((v) => v ?? 0);
      const mean = vals.reduce((a, b) => a + b) / 24;
      rec[t] = vals.map((v, h) => v - mean - cityAnom[t][h]);
    }
    anom.set(s.id, rec);
  }
  return { anom, cityOcc };
}

export function BicingMap({ stations }: { stations: Station[] }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [hour, setHour] = useState(8);
  const [dayType, setDayType] = useState<string>("laborable");
  const [playing, setPlaying] = useState(false);
  const [readout, setReadout] = useState<string | null>(null);

  const { anom: anomalies, cityOcc } = useMemo(
    () => computeAnomalies(stations),
    [stations],
  );

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: stations.map((s) => ({
        type: "Feature" as const,
        id: s.id,
        geometry: { type: "Point" as const, coordinates: [s.lon, s.lat] },
        properties: { cap: s.cap },
      })),
    }),
    [stations],
  );

  useEffect(() => {
    if (!container.current || map.current) return;
    const m = new maplibregl.Map({
      container: container.current,
      // vector basemap with no API key — Carto's free raster tiles started
      // watermarking "API KEY REQUIRED" in late aug-2026
      style: "https://tiles.openfreemap.org/styles/dark",
      bounds: [2.105, 41.343, 2.225, 41.465],
      fitBoundsOptions: { padding: 20 },
      attributionControl: {
        compact: true,
        customAttribution: "Bicing data: Open Data BCN (B:SM), CC-BY-4.0",
      },
      cooperativeGestures: true,
    });
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }));

    m.on("load", () => {
      // container sits inside an animated Reveal: re-fit once layout is real
      m.resize();
      m.fitBounds([[2.105, 41.343], [2.225, 41.465]], { padding: 20, animate: false });
      // NB: feature-state keys off the top-level GeoJSON feature id — do NOT
      // set promoteId here (it would look for properties.id, which is absent,
      // and every setFeatureState call would silently miss)
      m.addSource("stations", { type: "geojson", data: geojson });
      m.addLayer({
        id: "stations",
        type: "circle",
        source: "stations",
        paint: {
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            11, ["max", 2.5, ["*", 0.5, ["sqrt", ["get", "cap"]]]],
            14, ["max", 5, ["*", 1.15, ["sqrt", ["get", "cap"]]]],
          ],
          // color and presence are the signal: blue = bikes gone, amber =
          // bikes piling up; stations near their own normal fade out
          "circle-color": [
            "interpolate", ["linear"],
            ["coalesce", ["feature-state", "anom"], 0],
            -LIM, BLUE, 0, "#443C31", LIM, AMBER,
          ],
          "circle-opacity": [
            "interpolate", ["linear"],
            ["abs", ["coalesce", ["feature-state", "anom"], 0]],
            0, 0.45, LIM, 0.95,
          ],
          "circle-stroke-width": 0,
        },
      });
      setReady(true);
    });
    // the container lives inside an animated Reveal wrapper, so its size at
    // construction (and at "load"/"idle") can be stale. ResizeObserver's
    // callback always fires AFTER real layout — refit there, and keep
    // refitting on container resizes until the user takes over the camera.
    const refit = () => {
      const el2 = container.current;
      if (!el2 || el2.clientWidth < 100 || el2.clientHeight < 100) return;
      m.resize();
      m.fitBounds([[2.105, 41.343], [2.225, 41.465]], { padding: 20, animate: false });
    };
    const ro = new ResizeObserver(refit);
    ro.observe(container.current);
    const stopAutoFit = (ev: { originalEvent?: unknown }) => {
      if (ev.originalEvent) ro.disconnect();
    };
    m.on("zoomstart", stopAutoFit);
    m.on("dragstart", stopAutoFit);
    map.current = m;
    // Lenis listens on window and scrolls via JS — stop ⌘/Ctrl+wheel from
    // ever reaching it (maplibre's own zoom handler has already run)
    const el = container.current;
    const onWheel = (ev: WheelEvent) => {
      if (ev.metaKey || ev.ctrlKey) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      ro.disconnect();
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // push the selected hour/day-type into feature-state
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    for (const s of stations) {
      m.setFeatureState(
        { source: "stations", id: s.id },
        { anom: anomalies.get(s.id)![dayType][hour] },
      );
    }
  }, [hour, dayType, ready, stations, anomalies]);

  // autoplay: one day sweep, the breathing
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setHour((h) => (h + 1) % 24), 650);
    return () => clearInterval(t);
  }, [playing]);

  // hover readout
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    const byId = new Map(stations.map((s) => [s.id, s]));
    const onMove = (ev: maplibregl.MapMouseEvent) => {
      const f = m.queryRenderedFeatures(ev.point, { layers: ["stations"] })[0];
      if (!f) return setReadout(null);
      const s = byId.get(f.id as number);
      if (!s) return setReadout(null);
      const occ = s.occ[dayType][hour];
      setReadout(
        occ === null
          ? `${s.nombre} — no data`
          : `${s.nombre} · ${occ}% full · ~${Math.round((occ * s.cap) / 100)}/${s.cap} bikes`,
      );
      m.getCanvas().style.cursor = "crosshair";
    };
    m.on("mousemove", onMove);
    m.on("mouseout", () => setReadout(null));
    return () => {
      m.off("mousemove", onMove);
    };
  }, [ready, stations, dayType, hour]);

  const hh = `${String(hour).padStart(2, "0")}:00`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {DAY_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setDayType(key)}
            className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
              dayType === key
                ? "border-transparent bg-[#F4EDE3] text-[#17130E]"
                : "border-white/15 text-[#F4EDE3]/60 hover:border-white/40 hover:text-[#F4EDE3]"
            }`}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "pause" : "play one day"}
            className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#F4EDE3]/60 transition-colors hover:border-white/40 hover:text-[#F4EDE3]"
          >
            {playing ? "⏸ pause" : "▶ play a day"}
          </button>
          <span className="w-[5ch] text-right font-mono text-sm tabular-nums text-[#F4EDE3]">
            {hh}
          </span>
        </div>
      </div>

      {/* the pulse chart IS the time control — the story and the scrubber
          are the same object */}
      <BicingPulse
        curves={cityOcc}
        hour={hour}
        dayType={dayType}
        onSelect={(h) => {
          setPlaying(false);
          setHour(h);
        }}
      />

      {/* portrait box on purpose: Barcelona is taller than wide in Mercator,
          so a landscape map leaves the city floating between empty margins */}
      <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10">
        <div ref={container} className="h-[520px] w-full md:h-[620px]" />
        {readout && (
          <div className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%-6rem)] truncate rounded-md bg-[#F4EDE3] px-2.5 py-1.5 font-mono text-xs text-[#17130E]">
            {readout}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#F4EDE3]/50">
        <span>bikes gone</span>
        <div
          className="h-1.5 flex-1 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${BLUE}, #4A4238, ${AMBER})`,
          }}
        />
        <span>bikes pile up</span>
        <span className="ml-2 hidden text-[#F4EDE3]/35 md:inline">
          vs each station&rsquo;s own daily mean
        </span>
      </div>
    </div>
  );
}
