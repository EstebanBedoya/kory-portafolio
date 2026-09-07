"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { DUR, EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const HIDDEN = "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)";
const SHOWN = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, REVEAL_VIEWPORT);
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ clipPath: HIDDEN }}
        animate={isInView ? { clipPath: SHOWN } : undefined}
        transition={{ duration: DUR.slow, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    </div>
  );
}
