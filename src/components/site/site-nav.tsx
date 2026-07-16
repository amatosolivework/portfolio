"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/magnetic";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth-scroll to an in-page anchor, routing home first if needed.
  function goToAnchor(hash: string) {
    setOpen(false);
    if (pathname !== "/") {
      router.push(`/${hash}`);
      return;
    }
    const target = document.querySelector(hash);
    if (target && lenis) lenis.scrollTo(target as HTMLElement, { offset: -80 });
    else target?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-hairline bg-paper/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-ink"
          aria-label="Alex Matos Olive — home"
        >
          <span aria-hidden>amo</span>
          <span className="text-brand">.</span>
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) =>
            "route" in item && item.route ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.href}
                onClick={() => goToAnchor(item.href.replace("/", ""))}
                className="rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {item.label}
              </button>
            ),
          )}
          <Magnetic strength={10} className="ml-2">
            <a
              href={site.cv}
              className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-contrast transition-opacity hover:opacity-90"
            >
              CV
            </a>
          </Magnetic>
        </div>

        {/* mobile toggle */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-5 bg-ink transition-transform duration-300",
                open && "translate-y-[6px] rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-px w-5 bg-ink transition-transform duration-300",
                open && "-translate-y-[5px] -rotate-45",
              )}
            />
          </span>
        </button>
      </nav>

      {/* mobile sheet */}
      {open && (
        <div className="border-t border-hairline bg-paper md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col px-6 py-4">
            {navItems.map((item) =>
              "route" in item && item.route ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-lg text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.href}
                  onClick={() => goToAnchor(item.href.replace("/", ""))}
                  className="py-3 text-left text-lg text-ink"
                >
                  {item.label}
                </button>
              ),
            )}
            <a
              href={site.cv}
              className="mt-2 inline-flex w-fit items-center rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-contrast"
            >
              Download CV
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
