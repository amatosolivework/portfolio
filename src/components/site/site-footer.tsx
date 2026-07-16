import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
            {site.location}
          </p>
          <p className="mt-3 max-w-sm text-lg text-ink">
            Building real product end to end — iOS, backends, and web.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm md:items-end" aria-label="Footer">
          <a href={`mailto:${site.email}`} className="text-ink-muted transition-colors hover:text-ink">
            {site.email}
          </a>
          <Link href={site.links.linkedin} className="text-ink-muted transition-colors hover:text-ink">
            LinkedIn
          </Link>
          <Link href={site.links.github} className="text-ink-muted transition-colors hover:text-ink">
            GitHub
          </Link>
        </nav>
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6">
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
            © {year} {site.name}
          </p>
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
            alexmatosolive.com
          </p>
        </div>
      </div>
    </footer>
  );
}
