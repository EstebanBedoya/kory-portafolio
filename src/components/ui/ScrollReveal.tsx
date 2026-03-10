"use client";

import { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
        animate={isInView ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" } : {}}
        transition={{ 
          duration: 0.8, 
          delay, 
          ease: [0.77, 0, 0.175, 1] 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
