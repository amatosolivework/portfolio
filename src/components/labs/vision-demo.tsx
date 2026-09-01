"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The whole interactive panel of /labs/vision: model loading with visible
 * weight, a drag&drop classifier that runs entirely in the browser, and a
 * live network counter armed after the model loads — the proof of the thesis.
 *
 * transformers.js is imported lazily on first interaction so the page itself
 * stays light.
 */

type LabelEmbed = { id: string; ui_es: string; prompt: string; embed: number[] };
type Ranked = { label: string; score: number };
type Status = "idle" | "loading" | "ready" | "classifying" | "error";

const MODEL_ID = "Marqo/marqo-fashionSigLIP";
const DTYPE = "q8";

/** strip "a photo of ..." down to the noun the model was actually asked about */
function promptNoun(prompt: string): string {
  return prompt.replace(/^a photo of (a pair of |an? )?/, "");
}

export function VisionDemo() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [backend, setBackend] = useState<"webgpu" | "wasm" | null>(null);
  const [loadedMB, setLoadedMB] = useState(0);
  const [totalMB, setTotalMB] = useState(0);
  const [armed, setArmed] = useState(false);
  const [requests, setRequests] = useState(0);
  const [results, setResults] = useState<Ranked[] | null>(null);
  const [inferMs, setInferMs] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const tRef = useRef<typeof import("@huggingface/transformers") | null>(null);
  const modelRef = useRef<unknown>(null);
  const processorRef = useRef<unknown>(null);
  const labelsRef = useRef<LabelEmbed[]>([]);
  const armedAtRef = useRef<number>(Infinity);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const loadModel = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      // label embeddings are precomputed by the eval harness — fetched BEFORE
      // the counter arms, so the browser never needs the text tower at all
      const embeds = await fetch("/data/vision/vocab-embeddings.json").then((r) => r.json());
      labelsRef.current = embeds.labels as LabelEmbed[];

      const T = await import("@huggingface/transformers");
      tRef.current = T;

      const progress = (p: { file?: string; loaded?: number; total?: number }) => {
        if (p.file?.endsWith(".onnx") && p.loaded && p.total) {
          setLoadedMB(p.loaded / 1e6);
          setTotalMB(p.total / 1e6);
        }
      };

      // WASM on purpose, not as a fallback: we measured WebGPU (Apple metal-3)
      // at ~1.6 s per photo for this int8 model vs ~0.7 s on WASM+SIMD — the
      // dequantize overhead loses on GPU. Universal support is a free bonus.
      processorRef.current = await T.AutoProcessor.from_pretrained(MODEL_ID, {} as never);
      modelRef.current = await T.SiglipVisionModel.from_pretrained(MODEL_ID, {
        dtype: DTYPE,
        device: "wasm",
        progress_callback: progress,
      } as never);
      setBackend("wasm");

      // arm the counter: from this moment on, every network request is counted
      armedAtRef.current = performance.now();
      const obs = new PerformanceObserver((list) => {
        const later = list.getEntries().filter((e) => e.startTime > armedAtRef.current);
        if (later.length) setRequests((c) => c + later.length);
      });
      obs.observe({ type: "resource", buffered: false });
      observerRef.current = obs;
      setArmed(true);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, []);

  const classify = useCallback(async (file: File) => {
    const T = tRef.current;
    if (!T || !modelRef.current || !processorRef.current) return;
    setStatus("classifying");
    setResults(null);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    try {
      const t0 = performance.now();
      const image = await T.RawImage.fromBlob(file);
      const inputs = await (processorRef.current as (i: unknown) => Promise<unknown>)(image);
      const out = await (
        modelRef.current as (i: unknown) => Promise<{
          image_embeds: { normalize(): { tolist(): number[][] } };
        }>
      )(inputs);
      const emb = out.image_embeds.normalize().tolist()[0];
      const labels = labelsRef.current;
      const scores = T.softmax(labels.map((l) => 100 * T.dot(emb, l.embed)));
      const ranked = labels
        .map((l, i) => ({ label: promptNoun(l.prompt), score: scores[i] }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      setInferMs(Math.round(performance.now() - t0));
      setResults(ranked);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, []);

  const onFile = useCallback(
    (f: File | undefined | null) => {
      if (f && f.type.startsWith("image/")) void classify(f);
    },
    [classify],
  );

  return (
    <div className="rounded-md border border-ink/25 bg-[#f6f4ee] p-1.5">
      {/* the stitched inner border — this panel is a garment care label */}
      <div className="rounded-[4px] border-[1.5px] border-dashed border-ink/30 p-5 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          <span>fashionSigLIP · int8 · 94 MB</span>
          <span>100% on-device · do not upload · cold wash</span>
        </div>

        {status === "idle" && (
          <div className="mt-8 flex flex-col items-start gap-4">
            <p className="max-w-xl text-base leading-relaxed text-ink-muted">
              The model downloads once into your browser&rsquo;s cache
              (94&nbsp;MB — the price of privacy, paid on the first visit
              only). After that, classification happens on your machine and
              the network counter below stays at zero.
            </p>
            <button
              onClick={() => void loadModel()}
              className="rounded-full bg-ink px-6 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-80"
            >
              Load the model
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="mt-8">
            <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
              downloading weights{" "}
              {totalMB > 0 && (
                <span className="text-ink">
                  {loadedMB.toFixed(0)} / {totalMB.toFixed(0)} MB
                </span>
              )}
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full bg-brand transition-[width] duration-300"
                style={{ width: totalMB > 0 ? `${(loadedMB / totalMB) * 100}%` : "10%" }}
              />
            </div>
          </div>
        )}

        {(status === "ready" || status === "classifying") && (
          <>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                onFile(e.dataTransfer.files?.[0]);
              }}
              className={`mt-8 rounded-[4px] border-[1.5px] border-dashed p-6 text-center transition-colors md:p-10 ${
                dragOver ? "border-brand bg-brand/5" : "border-ink/30"
              }`}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element -- blob URL from the user's disk; never leaves the page
                <img
                  src={preview}
                  alt="your photo, processed locally"
                  className="mx-auto max-h-72 rounded-sm object-contain"
                />
              ) : (
                <p className="text-base text-ink-muted">
                  Drop a photo of one garment — laid on a bed, hanging,
                  however it exists in your house.
                </p>
              )}
              <div className="mt-5">
                <label className="inline-block cursor-pointer rounded-full border border-ink px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper">
                  {preview ? "try another" : "choose a photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => onFile(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            {status === "classifying" && (
              <div className="mt-6 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
                classifying on your {backend === "webgpu" ? "GPU" : "CPU"}…
              </div>
            )}

            {results && (
              <div className="mt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  <span>top 3 of {labelsRef.current.length} labels</span>
                  <span>
                    {inferMs} ms · {backend}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {results.map((r, i) => (
                    <div key={r.label} className="flex items-center gap-4">
                      <span
                        className={`w-32 shrink-0 font-mono text-[13px] ${
                          i === 0 ? "font-bold text-ink" : "text-ink-muted"
                        }`}
                      >
                        {r.label}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                        <div
                          className={`h-full rounded-full ${i === 0 ? "bg-brand" : "bg-ink/30"}`}
                          style={{ width: `${Math.max(2, r.score * 100)}%` }}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right font-mono text-[13px] text-ink-muted">
                        {(r.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {status === "error" && (
          <div className="mt-8 max-w-xl text-base leading-relaxed text-ink-muted">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-brand">
              the model could not load
            </p>
            <p className="mt-2">
              Most likely the download was interrupted, or this browser blocks
              both WebGPU and WASM — reload the page to retry. Nothing was
              sent anywhere either way.
            </p>
            {error && (
              <p className="mt-2 font-mono text-[11px] text-ink-faint">{error}</p>
            )}
          </div>
        )}

        {/* the proof: a flatline that would spike if this page ever phoned home */}
        <div className="mt-10 border-t border-ink/15 pt-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
            <span className="text-ink-faint">network requests since the model loaded</span>
            <span
              data-testid="request-counter"
              className={requests === 0 ? "text-brand" : "font-bold text-red-700"}
            >
              {armed ? requests : "— not armed yet"}
            </span>
          </div>
          <div className="mt-3 flex h-8 items-center" aria-hidden>
            <div className={`h-[2px] w-full ${requests === 0 ? "bg-brand/70" : "bg-red-700"}`} />
          </div>
          <p className="font-mono text-[11px] leading-relaxed text-ink-faint">
            measured live with PerformanceObserver — every fetch, image or
            script this page makes after the weights arrive would count here.
            your photo stays on this line.
          </p>
        </div>
      </div>
    </div>
  );
}
