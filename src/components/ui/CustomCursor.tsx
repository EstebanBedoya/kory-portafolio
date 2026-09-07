"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/lib/useMediaQuery";

const CURSOR_SIZE = 32;

export default function CustomCursor() {
  // Only replace a real pointer, and only when motion is welcome. The CSS
  // `cursor: none` rule is gated on the same pointer query.
  const hasFinePointer = useMediaQuery("(pointer: fine)");
  const reduceMotion = useReducedMotion();
  const isEnabled = hasFinePointer && !reduceMotion;

  const [isOverArtwork, setIsOverArtwork] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { damping: 20, stiffness: 300 });
  const cursorYSpring = useSpring(cursorY, { damping: 20, stiffness: 300 });

  useEffect(() => {
    if (!isEnabled) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - CURSOR_SIZE / 2);
      cursorY.set(e.clientY - CURSOR_SIZE / 2);
    };

    const trackTarget = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setIsOverArtwork(!!target?.closest("[data-gallery-item]"));
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", trackTarget);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", trackTarget);
    };
  }, [cursorX, cursorY, isEnabled]);

  if (!isEnabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      {isOverArtwork ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-neutral-dark/90 backdrop-blur-sm"
        >
          <span className="font-sans text-meta font-medium uppercase tracking-meta text-white">
            Ver obra
          </span>
        </motion.div>
      ) : (
        <svg width={CURSOR_SIZE} height={CURSOR_SIZE} viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="4.5" fill="var(--color-neutral-dark)" />
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="var(--color-neutral-dark)"
            strokeWidth="1.5"
            strokeDasharray="2 4"
            opacity="0.6"
          />
        </svg>
      )}
    </motion.div>
  );
}
