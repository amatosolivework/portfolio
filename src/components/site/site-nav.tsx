"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const items = [
  { label: "Work", target: "/#work" },
  { label: "About", target: "/#about" },
  { label: "Writing", target: "/blog", route: true },
  { label: "Contact", target: "/#contact" },
];

export function SiteNav() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();

  // On the home page the masthead carries its own contents; the running header
  // only appears once the cover has scrolled away. On other routes it's always on.
  useEffect(() => {
    if (pathname !== "/") {
      setShown(true);
      return;
    }
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  function go(target: string) {
    setOpen(false);
    const hash = target.startsWith("/#") ? target.slice(1) : null;
    if (hash) {
      if (pathname !== "/") {
        router.push(`/${hash}`);
        return;
      }
      const el = document.querySelector(hash);
      if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -72 });
      else el?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-all duration-500",
        shown
          ? "translate-y-0 border-hairline bg-paper/85 opacity-100 backdrop-blur-xl"
          : "-translate-y-full border-transparent opacity-0",
      )}
    >
      <nav className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="text-sm font-semibold tracking-tight text-ink">
          Alex Matos Olive<span className="text-brand">.</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {items.map((item) =>
            "route" in item && item.route ? (
              <Link
                key={item.label}
                href={item.target}
                className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => go(item.target)}
                className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-brand"
              >
                {item.label}
              </button>
            ),
          )}
          <a
            href={site.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink transition-colors hover:text-brand"
          >
            CV ↗
          </a>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span className={cn("absolute left-0 top-0 h-px w-5 bg-ink transition-transform duration-300", open && "translate-y-[6px] rotate-45")} />
            <span className={cn("absolute bottom-0 left-0 h-px w-5 bg-ink transition-transform duration-300", open && "-translate-y-[5px] -rotate-45")} />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-hairline bg-paper md:hidden">
          <div className="mx-auto flex max-w-[1400px] flex-col px-6 py-4">
            {items.map((item) =>
              "route" in item && item.route ? (
                <Link key={item.label} href={item.target} onClick={() => setOpen(false)} className="border-b border-hairline py-3 text-lg text-ink">
                  {item.label}
                </Link>
              ) : (
                <button key={item.label} onClick={() => go(item.target)} className="border-b border-hairline py-3 text-left text-lg text-ink">
                  {item.label}
                </button>
              ),
            )}
            <a
              href={site.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 text-lg text-ink"
            >
              Curriculum Vitae ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
