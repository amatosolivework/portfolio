import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Stylized CSS iPhone frame. By default it shows a monochrome brand placeholder
 * (NOT a fabricated app screenshot). Drop a real screenshot in via `children`
 * (e.g. a next/image filling the screen) once assets are available.
 */
export function DeviceFrame({
  label,
  caption,
  children,
  className,
}: {
  label?: string;
  caption?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-[240px] rounded-[2.6rem] border border-hairline bg-ink p-2 shadow-[0_30px_60px_-20px_rgba(10,10,11,0.35)] md:w-[280px]",
        className,
      )}
    >
      {/* screen */}
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-surface">
        {children ?? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff,#ededf0)]">
            {label && (
              <span className="text-2xl font-semibold tracking-tight text-ink">
                {label}
              </span>
            )}
            {caption && (
              <span className="mt-2 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-faint">
                {caption}
              </span>
            )}
          </div>
        )}
        {/* dynamic island */}
        <div className="absolute left-1/2 top-3 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      </div>
    </div>
  );
}
