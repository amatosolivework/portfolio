import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Colophon — the closing credits of the issue.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-faint">
          Colophon
        </p>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
          <p className="col-span-12 max-w-xl text-2xl leading-snug tracking-tight text-ink md:col-span-7">
            Built &amp; edited by Alex Matos Olive in {site.location}. Set in
            Bricolage&nbsp;Grotesque and JetBrains&nbsp;Mono. Selected Work,
            Vol.&nbsp;1.
          </p>

          <div className="col-span-12 flex flex-col gap-2 font-mono text-eyebrow uppercase tracking-[0.12em] md:col-span-5 md:items-end">
            <a href={`mailto:${site.email}`} className="text-ink transition-colors hover:text-brand">
              {site.email} ↗
            </a>
            <Link href={site.links.linkedin} className="text-ink-muted transition-colors hover:text-brand">
              LinkedIn ↗
            </Link>
            <Link href={site.links.github} className="text-ink-muted transition-colors hover:text-brand">
              GitHub ↗
            </Link>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between border-t border-hairline pt-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
          <span>© MMXXVI</span>
          <span>alexmatosolive.com</span>
        </div>
      </div>
    </footer>
  );
}
