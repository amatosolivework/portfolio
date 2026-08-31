"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// the bundler mangles maplibre's inlined worker (vector tiles never load,
// silently) — serve the library's own worker as a static asset instead.
// NB: the file in /public is copied from maplibre-gl/dist and must be
// refreshed if the dependency is upgraded.
maplibregl.setWorkerUrl("/maplibre-gl-worker-6.6.0.mjs");

type Layer = { key: string; date: string; role: string };
type Meta = {
  bounds: [number, number, number, number]; // w, s, e, n (lon/lat)
  val_encoding: { nodata: number; lst_min: number; lst_max: number };
  layers: Layer[];
  dnbr_legend: { label: string; color: string }[];
};

const ROLE_LABEL: Record<string, string> = {
  pre: "before",
  during: "fire",
  post: "after",
};

/** y in Web Mercator normalized space — image sources are linear in this. */
const mercY = (lat: number) =>
  Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

export function FireMap({ meta, base }: { meta: Meta; base: string }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const values = useRef<Record<string, ImageData>>({});
  const [active, setActive] = useState("during2");
  const [showDnbr, setShowDnbr] = useState(false);
  const [readout, setReadout] = useState<string | null>(null);

  const [w, s, e, n] = meta.bounds;
  const corners: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ] = [
    [w, n],
    [e, n],
    [e, s],
    [w, s],
  ];

  // decode the 8-bit value PNGs once, for the °C readout
  useEffect(() => {
    for (const { key } of meta.layers) {
      const img = new Image();
      img.onload = () => {
        const cv = document.createElement("canvas");
        cv.width = img.width;
        cv.height = img.height;
        const ctx = cv.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        values.current[key] = ctx.getImageData(0, 0, img.width, img.height);
      };
      img.src = `${base}/val_${key}.png`;
    }
  }, [meta.layers, base]);

  useEffect(() => {
    if (!container.current || map.current) return;
    const m = new maplibregl.Map({
      container: container.current,
      // vector basemap with no API key — Carto's free raster tiles started
      // watermarking "API KEY REQUIRED" in late aug-2026
      style: "https://tiles.openfreemap.org/styles/dark",
      bounds: [w, s, e, n],
      fitBoundsOptions: { padding: 24 },
      attributionControl: {
        compact: true,
        customAttribution: "Landsat 8/9 courtesy USGS/NASA",
      },
      // trackpad-friendly: page scroll passes through; ⌘/Ctrl+scroll zooms
      cooperativeGestures: true,
    });
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }));

    m.on("load", () => {
      // the container lives inside an animated Reveal wrapper: its size at
      // construction time can be wrong, which skews the initial fitBounds —
      // re-fit once the layout is real
      m.resize();
      m.fitBounds([[w, s], [e, n]], { padding: 24, animate: false });
      for (const { key } of meta.layers) {
        m.addSource(`lst-${key}`, {
          type: "image",
          url: `${base}/lst_${key}.png`,
          coordinates: corners,
        });
        m.addLayer({
          id: `lst-${key}`,
          type: "raster",
          source: `lst-${key}`,
          // per-pixel alpha is baked into the PNG (thermal z-score ramp):
          // normal terrain is transparent, only the anomaly shows
          paint: { "raster-opacity": 1, "raster-resampling": "linear" },
          layout: { visibility: key === "during2" ? "visible" : "none" },
        });
      }
      m.addSource("dnbr", {
        type: "image",
        url: `${base}/dnbr.png`,
        coordinates: corners,
      });
      m.addLayer({
        id: "dnbr",
        type: "raster",
        source: "dnbr",
        paint: { "raster-opacity": 0.85, "raster-resampling": "nearest" },
        layout: { visibility: "none" },
      });
    });
    map.current = m;
    // maplibre zooms on ⌘/Ctrl+wheel but the page still moves: the site's
    // smooth scroller (Lenis) listens on window and scrolls via JS, so
    // preventDefault alone is not enough — stop the event from ever reaching
    // it. maplibre's own handler lives deeper in the tree and has already run.
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
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // layer switching
  useEffect(() => {
    const m = map.current;
    if (!m || !m.isStyleLoaded()) return;
    for (const { key } of meta.layers) {
      m.setLayoutProperty(
        `lst-${key}`,
        "visibility",
        !showDnbr && key === active ? "visible" : "none",
      );
    }
    m.setLayoutProperty("dnbr", "visibility", showDnbr ? "visible" : "none");
  }, [active, showDnbr, meta.layers]);

  // °C readout under the cursor
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const onMove = (ev: maplibregl.MapMouseEvent) => {
      const data = values.current[active];
      if (!data || showDnbr) return setReadout(null);
      const { lng, lat } = ev.lngLat;
      const fx = (lng - w) / (e - w);
      const fy = (mercY(n) - mercY(lat)) / (mercY(n) - mercY(s));
      if (fx < 0 || fx > 1 || fy < 0 || fy > 1) return setReadout(null);
      const px = Math.floor(fx * data.width);
      const py = Math.floor(fy * data.height);
      const v = data.data[(py * data.width + px) * 4]; // grayscale → R channel
      if (v === meta.val_encoding.nodata) return setReadout(null);
      const { lst_min, lst_max } = meta.val_encoding;
      const t = lst_min + ((v - 1) / 254) * (lst_max - lst_min);
      setReadout(`${t.toFixed(1)} °C`);
    };
    m.on("mousemove", onMove);
    m.on("mouseout", () => setReadout(null));
    return () => {
      m.off("mousemove", onMove);
    };
  }, [active, showDnbr, w, s, e, n, meta.val_encoding]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {meta.layers.map(({ key, date, role }) => (
          <button
            key={key}
            onClick={() => {
              setActive(key);
              setShowDnbr(false);
            }}
            className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
              !showDnbr && active === key
                ? "border-transparent bg-[#F4EDE3] text-[#17130E]"
                : "border-white/15 text-[#F4EDE3]/60 hover:border-white/40 hover:text-[#F4EDE3]"
            }`}
          >
            {date.slice(5)} · {ROLE_LABEL[role]}
          </button>
        ))}
        <button
          onClick={() => setShowDnbr(true)}
          className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
            showDnbr
              ? "border-transparent bg-[#F4EDE3] text-[#17130E]"
              : "border-white/15 text-[#F4EDE3]/60 hover:border-white/40 hover:text-[#F4EDE3]"
          }`}
        >
          burn severity
        </button>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10">
        <div ref={container} className="h-[60vh] min-h-[380px] w-full" />
        {readout && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-[#F4EDE3] px-2.5 py-1.5 font-mono text-xs text-[#17130E]">
            {readout}
          </div>
        )}
        {showDnbr && (
          <div className="pointer-events-none absolute bottom-8 left-3 flex flex-col gap-1 rounded-md bg-black/70 p-2.5">
            {meta.dnbr_legend.map(({ label, color }) => (
              <span
                key={label}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#F4EDE3]"
              >
                <i
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: color }}
                />
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {!showDnbr && (
        <div className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#F4EDE3]/50">
          <span>35 °C</span>
          <div
            className="h-1.5 flex-1 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #ffffcc, #fed976, #fd8d3c, #e31a1c, #800026)",
            }}
          />
          <span>65 °C</span>
        </div>
      )}
    </div>
  );
}
