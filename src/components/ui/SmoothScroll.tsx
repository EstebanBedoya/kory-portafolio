"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      // Lenis owns the raf loop, so it is torn down with destroy().
      autoRaf: true,
      // Keeps the NavBar hash links smooth now that CSS scroll-behavior is gone.
      anchors: true,
    });

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
