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
          className="w-32 h-32 rounded-full bg-brand/90 backdrop-blur-sm flex items-center justify-center"
        >
          <span className="text-xs font-sans uppercase tracking-widest text-white">
            Ver Obra
          </span>
        </motion.div>
      ) : (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="6" fill="#60A3D1" />
          <circle cx="16" cy="16" r="12" stroke="#60A3D1" strokeWidth="1" fill="none" />
        </svg>
      )}
    </motion.div>
  );
}
