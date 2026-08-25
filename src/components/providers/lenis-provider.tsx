"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Keeps GSAP ScrollTrigger in step with Lenis' smoothed scroll position, so
 * pinned sections track the scroll instead of lagging behind it.
 */
function GsapLenisSync() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    ScrollTrigger.refresh();
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  // Client-side navigation swaps the page content but Lenis keeps the scroll
  // limit measured on the previous document — scrolling then jams at the old
  // page's height. Recompute the limit (and ScrollTrigger positions) once the
  // new route has laid out.
  useEffect(() => {
    if (!lenis) return;
    const raf = requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(raf);
  }, [lenis, pathname]);

  return null;
}

/**
 * Global smooth scroll. Disabled entirely when the user prefers reduced motion —
 * we mount plain children so native scrolling (and assistive tech) is untouched.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      }}
    >
      <GsapLenisSync />
      {children}
    </ReactLenis>
  );
}
