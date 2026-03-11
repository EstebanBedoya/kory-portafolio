"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isGallery, setIsGallery] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isGalleryItem = 
        target.closest("[data-gallery-item]") ||
        target.classList.contains("gallery-item");
      setIsGallery(!!isGalleryItem);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      {isGallery ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-full bg-[#121212]/90 backdrop-blur-sm flex items-center justify-center border border-white/20"
        >
          <span className="text-xs font-sans uppercase tracking-[0.3em] text-white font-medium">
            Ver Obra
          </span>
        </motion.div>
      ) : (
        <svg width="32" height="32" viewBox="0 0 32 32">
          {/* Inner solid dot - much darker now */}
          <circle cx="16" cy="16" r="4.5" fill="#121212" />
          {/* Outer ring - darker and slightly thicker */}
          <circle 
            cx="16" 
            cy="16" 
            r="12" 
            stroke="#121212" 
            strokeWidth="1.5" 
            strokeDasharray="2 4"
            fill="none" 
            opacity="0.6"
          />
        </svg>
      )}
    </motion.div>
  );
}
