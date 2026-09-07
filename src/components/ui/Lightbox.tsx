"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

export interface LightboxItem {
  src: string;
  alt: string;
  titulo: string;
  meta?: { label: string; value: string }[];
}

interface LightboxProps {
  item: LightboxItem | null;
  eyebrow?: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function Lightbox({
  item,
  eyebrow = "Obra seleccionada",
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = item !== null;

  // Move focus into the dialog on open and hand it back to the trigger on
  // close, keyed on open/closed so stepping between items does not steal it.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "ArrowLeft") onPrev?.();

      // Trap focus inside the dialog while it's open: aria-modal="true" is a
      // promise the rest of the page is inert, so Tab must not leave it.
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={item.titulo}
          className="fixed inset-0 z-[100] flex cursor-default items-center justify-center bg-neutral-dark/95 p-4 backdrop-blur-md md:p-8 lg:p-12"
          onClick={onClose}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Cerrar"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-6 top-6 z-[110] rounded-full p-2 text-white/80 transition-all hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:right-7 md:top-7"
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
              aria-hidden="true"
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
              aria-label="Anterior"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 rounded-full text-white/50 transition-all hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:left-8"
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
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </motion.button>
          )}

          {onNext && (
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Siguiente"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 rounded-full text-white/50 transition-all hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:right-8"
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
                aria-hidden="true"
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
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 60vw"
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
                  className="text-meta font-medium uppercase tracking-[0.5em] text-white/60"
                >
                  {eyebrow}
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-serif text-title italic text-white"
                >
                  {item.titulo}
                </motion.h2>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="w-16 h-px bg-white/20 origin-left"
                />
              </div>

              {item.meta && item.meta.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 gap-6 text-eyebrow uppercase tracking-meta text-white/70"
                >
                  {item.meta.map((dato) => (
                    <div key={dato.label} className="space-y-1">
                      <span className="block text-meta text-white/60">
                        {dato.label}
                      </span>
                      <span className="font-light">{dato.value}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4"
              >
                <button
                  onClick={onClose}
                  className="rounded-full border border-white/10 px-8 py-3 text-meta font-medium uppercase tracking-meta text-white transition-all duration-500 hover:bg-white hover:text-neutral-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Continuar explorando
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
