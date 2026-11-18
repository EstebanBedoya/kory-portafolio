"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import PortadaCapas from "@/components/ui/PortadaCapas";
import { EASE_OUT } from "@/lib/motion";
import type { TextosSitio } from "@/types/content";

interface HeroCelestialProps {
  textos: TextosSitio["hero"];
}

/**
 * The cover: an engraving-style illustration that carries the brand name
 * itself, so the CMS title is kept for search and screen readers rather than
 * printed a second time on top of it.
 *
 * Three layers of light motion: it resolves out of a blur on arrival, drifts
 * and breathes slowly while idle, and parallaxes away as the page scrolls.
 */
export default function HeroCelestial({ textos }: HeroCelestialProps) {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-svh items-end justify-center overflow-hidden"
    >
      <h1 className="sr-only">
        {textos.titulo} {textos.tituloDestacado}. {textos.bajada}
      </h1>

      <motion.div
        style={reduceMotion ? undefined : { y, scale, opacity }}
        className="pointer-events-none absolute inset-0"
      >
        {/* Arrival: out of focus and slightly large, settling into place. */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 1.08, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2.2, ease: EASE_OUT }}
          className="absolute inset-0"
        >
          {/* Idle: a slow overall zoom on top of each layer's own motion. */}
          <motion.div
            animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            // The bottom fades into the page so the cover never ends on a hard
            // edge.
            className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
          >
            <PortadaCapas />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Quiet bands of paper behind the nav and the caption, so the text
          stays legible over the engraving. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-canvas/85 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-canvas via-canvas/90 to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.4, ease: EASE_OUT }}
        className="relative z-10 flex flex-col items-center gap-3 px-6 pb-10 text-center"
      >
        <p className="font-serif text-quote italic text-neutral-dark">
          {textos.bajada}
        </p>
        <span className="text-meta uppercase tracking-eyebrow text-neutral-dark/70">
          {textos.firma}
        </span>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-1 h-10 w-px bg-brand/50"
        />
      </motion.div>
    </section>
  );
}
