import type { ReactNode } from "react";

/**
 * Root layout for the internal QC harnesses under /lab.
 *
 * Deliberately minimal and deliberately separate from the `(frontend)`
 * layout: the lab pages read `searchParams`, which makes them dynamic. If
 * they shared a layout with the portfolio, that layout's CMS query would run
 * on every request to a lab route instead of only at build and revalidation.
 *
 * These pages style themselves inline, so the Tailwind entrypoint is not
 * loaded here either.
 */
export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
