"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { Obra } from "@/data/obras";

interface LightboxProps {
  obra: Obra | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function Lightbox({ obra, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    if (obra) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "ArrowLeft") onPrev?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [obra, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {obra && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2D2D2D]/95 backdrop-blur-md p-4 md:p-8 lg:p-12 cursor-default"
          onClick={onClose}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-8 right-8 text-white/80 hover:text-white transition-all z-[110]"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Navigation Buttons */}
          {onPrev && (
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all z-[110]"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </motion.button>
          )}

          {onNext && (
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all z-[110]"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </motion.button>
          )}

          {/* Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="relative w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div className="relative w-full h-[45vh] md:h-[80vh] flex-[1.5] group">
               <Image
                src={obra.imagen}
                alt={obra.titulo}
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Info Container */}
            <div className="flex flex-col md:w-96 gap-8 text-left">
              <div className="space-y-4">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-medium"
                >
                  Obra Seleccionada
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-serif text-4xl md:text-5xl lg:text-6xl text-white italic leading-tight"
                >
                  {obra.titulo}
                </motion.h2>
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="w-16 h-px bg-white/20 origin-left" 
                />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 gap-6 text-xs uppercase tracking-[0.25em] text-white/70"
              >
                <div className="space-y-1">
                  <span className="text-[9px] text-white/30 block">Año de creación</span>
                  <span className="font-light">{obra.anio}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-white/30 block">Técnica empleada</span>
                  <span className="font-light">{obra.tecnica}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-white/30 block">Dimensiones</span>
                  <span className="font-light">{obra.tamano}</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4"
              >
                 <button 
                  onClick={onClose}
                  className="px-8 py-3 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-white hover:text-[#2D2D2D] transition-all duration-500"
                >
                  Continuar Explorando
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
