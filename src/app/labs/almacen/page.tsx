import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { WarehouseGate, type GateRow } from "@/components/labs/warehouse-gate";

export const metadata: Metadata = {
  title: "The warehouse that doesn't trust",
  description:
    "1,067,371 real e-commerce rows full of invisible traps — duplicated weeks, phantom orders, the postman as best seller. A dimensional warehouse (dbt + DuckDB) with 91 tests that catch every one before the dashboard, reconciled to the penny.",
};

async function getData() {
  const raw = await fs.readFile(
    path.join(process.cwd(), "public", "data", "almacen", "almacen.json"),
    "utf-8",
  );
  return JSON.parse(raw);
}

const fmtGBP = (n: number) =>
  "£" +
  n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default async function AlmacenPage() {
  const data = await getData();
  const k = data.kpis;
  const raw: GateRow[] = data.gate.raw;
  const clean: GateRow[] = data.gate.clean;
  const t = data.trampas;

  const stats = [
    {
      n: fmtGBP(k.net_revenue),
      label:
        "net revenue reconciled to the penny across all four layers — raw parquet, staging, intermediate, star schema. One test compares the four sums; a single cent of drift aborts the build",
      hot: true,
    },
    {
      n: "91",
      label:
        "tests that run on every build and fail loudly. Every tolerated exception — 3,393 warehouse adjustments, five negative bad-debt prices, one cancellation with positive quantity — is pinned by name and counted, never waved through",
    },
    {
      n: `${t.solape_filas.toLocaleString("en-GB")}`,
      label:
        "rows duplicated between the file's two sheets — the same nine days of December 2010, present twice. Concatenate naively and revenue inflates ~2%. The warehouse removes exactly these, and a test counts them",
    },
  ];

  const receipt = [
    {
      item: `${t.solape_facturas.toLocaleString("en-GB")} invoices duplicated across sheets`,
      catch: "dedup + pinned count",
    },
    {
      item: `${t.sin_cliente_pct}% of rows have no customer at all`,
      catch: "unknown member (−1)",
    },
    {
      item: `${t.pares_no_unicos.toLocaleString("en-GB")} invoice+product pairs repeat — the "obvious" key isn't one`,
      catch: "surrogate line key",
    },
    {
      item: `${t.ajustes_inventario.toLocaleString("en-GB")} negative quantities that are not cancellations ("damaged", "thrown away")`,
      catch: "flagged, £0.00 impact",
    },
    {
      item: `${t.codigos_servicio} stock codes that aren't products — postage, fees, a test row in production`,
      catch: "seed + relationship test",
    },
    {
      item: `a ${t.pedido_fantasma_uds.toLocaleString("en-GB")}-unit order bought and cancelled the same day`,
      catch: "netted to zero",
    },
  ];

  const work = [
    {
      n: "01",
      name: "Verified download",
      body: "The official UCI zip, with SHA-256 pinned for both the archive and the spreadsheet inside. A byte of drift aborts. One command rebuilds everything from the source.",
      metric: "1,067,371 rows · 29 invariants",
    },
    {
      n: "02",
      name: "Staging",
      body: "Trim, normalise product codes (85123a → 85123A), money to DECIMAL, and remove the 22,523 rows the overlapping sheets duplicate — without losing a single one of the 53,628 invoices.",
      metric: "1,044,848 rows out",
    },
    {
      n: "03",
      name: "Star schema",
      body: "Facts at invoice-line grain with a surrogate key, dimensions for date, customer and product, the invoice kept as a degenerate dimension. Every foreign key tested for orphans.",
      metric: "grain: one line, declared",
    },
    {
      n: "04",
      name: "History (SCD2)",
      body: `Product names change over time — a whole catalogue renamed SPOTTY → POLKADOT in autumn 2010. The dimension versions every name with validity ranges; ${data.scd2.spotty_transitions} renames captured, no gaps, no overlaps.`,
      metric: `${data.scd2.versions.toLocaleString("en-GB")} versions · ${data.scd2.multi_version_codes} products`,
    },
    {
      n: "05",
      name: "BI export",
      body: "KPI marts exported as static CSV and loaded into Qlik Sense Cloud. The dashboard's numbers are checked against the warehouse to the penny — and documented as a dbt exposure in the lineage.",
      metric: "verified to the penny",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
        <span>Labs · 05</span>
        <span className="text-ink-faint">Analytics engineering</span>
      </div>

      <h1
        className="mt-12 max-w-[16ch] font-semibold leading-[0.95] tracking-[-0.03em] text-ink"
        style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
      >
        Raw data lies. This warehouse checks.
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
        A million real rows from a UK online retailer, 2009–2011. Sum them as
        they come and your best-selling &ldquo;product&rdquo; is a manual
        adjustment ledger, with the postman in third place. This lab builds
        the thing that stands between that spreadsheet and anyone making a
        decision: a dimensional warehouse (dbt + DuckDB) where every known
        trap has a test that catches it, and revenue reconciles across every
        layer to the penny — {fmtGBP(k.net_revenue)}, four times over.
      </p>

      {/* the gate figure */}
      <section className="mt-16">
        <Reveal>
          <WarehouseGate raw={raw} clean={clean} />
        </Reveal>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-faint">
          Same file, same metric, two answers. Every number above is real and
          regenerated by the pipeline; the flagged rows are stock codes that
          were never products — postage, fees, adjustments — evicted by a
          61-row seed table with a test that proves each one exists in the
          data.
        </p>
      </section>

      {/* the numbers */}
      <section className="mt-24">
        <Reveal>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {stats.map(({ n, label, hot }) => (
              <div key={label} className="border-t border-ink pt-5">
                <div
                  className={`font-semibold leading-none tracking-[-0.03em] ${
                    hot ? "text-brand" : "text-ink"
                  }`}
                  style={{ fontSize: "clamp(2rem, 1.2rem + 2.2vw, 3.5rem)" }}
                >
                  {n}
                </div>
                <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-ink-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* the trap receipt */}
      <section className="mt-24">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
            <span>The trap catalogue</span>
            <span className="text-ink-faint">every line has a test</span>
          </div>
          <div className="mt-8 max-w-3xl font-mono text-[13px] leading-relaxed">
            {receipt.map((r) => (
              <div
                key={r.item}
                className="flex items-baseline justify-between gap-6 border-b border-dashed border-ink/15 py-2.5"
              >
                <span className="text-ink-muted">{r.item}</span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.1em] text-brand">
                  {r.catch}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* the work */}
      <section className="mt-24">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
            <span>The work</span>
            <span className="text-ink-faint">dbt + DuckDB · reproducible</span>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-5">
            {work.map((step) => (
              <div key={step.n}>
                <div className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                  {step.n}
                </div>
                <div className="mt-2 font-semibold tracking-tight text-ink">
                  {step.name}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
                <div className="mt-3 font-mono text-[11px] tracking-[0.1em] text-brand">
                  {step.metric}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* lineage + dashboard */}
      <section className="mt-24">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
            <span>From model to dashboard</span>
            <span className="text-ink-faint">nothing live, nothing to break</span>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-2xl border border-ink/15">
                <Image
                  src="/data/almacen/qlik-dashboard.png"
                  alt="Qlik Sense dashboard: net revenue £18,909,762.12, return rate 7.44%, customer concentration and the raw-vs-clean top products"
                  width={2940}
                  height={1560}
                  className="w-full"
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                The Qlik Sense Cloud dashboard, fed only by exported CSV
                files. Its four headline numbers were verified against the
                warehouse to the penny before this screenshot was taken.
              </p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-ink/15 bg-white/40 p-6 md:p-8">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  The full lineage, navigable
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  Every model, test, seed and the dashboard itself documented
                  in dbt&rsquo;s auto-generated docs — one static HTML file,
                  from raw parquet source to the Qlik exposure. Column by
                  column, with the reasoning in the descriptions.
                </p>
              </div>
              <a
                href="/data/almacen/dbt-docs.html"
                target="_blank"
                rel="noopener"
                className="mt-6 inline-block font-mono text-[13px] text-brand underline-offset-4 hover:underline"
              >
                Open the dbt docs →
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* honesty */}
      <section className="mt-24 max-w-2xl">
        <Reveal>
          <div className="border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
            What this is — and isn&rsquo;t
          </div>
          <div className="mt-6 space-y-4 text-ink-muted">
            <p>
              This is one company&rsquo;s data — a UK gift-ware retailer with
              a wholesale bias, 2009–2011 — so the KPIs describe that
              business, not e-commerce in general. The source captured no
              history, so the product dimension&rsquo;s versions are derived
              from the events themselves; a second implementation simulates
              25 monthly loads through dbt&rsquo;s snapshot mechanism and
              converges on the same versions, which is the point of showing
              both.
            </p>
            <p>
              Honest fine print: DuckDB here is a single-node warehouse — the
              scale conversation is theoretical, though the dbt project ports
              to a cloud warehouse without changes. The dataset carries no
              costs, so there are no margins. And the free Qlik tier expires;
              the screenshot above is the permanent artifact, which is why
              the page depends on nothing live.
            </p>
            <p className="pt-2 font-mono text-sm">
              <a
                href="https://github.com/amatosolivework/online-retail-warehouse"
                className="text-brand underline-offset-4 hover:underline"
              >
                Code on GitHub
              </a>
              <span className="mx-3 text-ink-faint">·</span>
              <a
                href="/labs/luz"
                className="text-brand underline-offset-4 hover:underline"
              >
                Labs · 04
              </a>
              <span className="mx-3 text-ink-faint">·</span>
              <a
                href="/labs/incendio"
                className="text-brand underline-offset-4 hover:underline"
              >
                Labs · 01
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
