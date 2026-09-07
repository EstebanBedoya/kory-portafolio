"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { DUR, EASE_IN_OUT } from "@/lib/motion";
import type { TextosSitio } from "@/types/content";

interface HeroCelestialProps {
  textos: TextosSitio["hero"];
}

export default function HeroCelestial({ textos }: HeroCelestialProps) {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <motion.div
        style={reduceMotion ? undefined : { y, scale, opacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          animate={reduceMotion ? undefined : { scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-[600px] w-[400px] md:h-[750px] md:w-[500px]"
        >
          <Image
            src="/logo-silueta.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 400px, 500px"
            className="object-contain opacity-90"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: EASE_IN_OUT }}
        className="relative z-10 max-w-3xl px-6 text-center"
      >
        <h1 className="font-serif text-display text-neutral-dark">
          {textos.titulo}{" "}
          <span className="italic text-brand">{textos.tituloDestacado}</span>
        </h1>
        <p className="mt-6 font-sans text-lede uppercase tracking-meta text-neutral-dark">
          {textos.bajada}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: DUR.slow }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-meta uppercase tracking-eyebrow text-neutral-dark/70">
            {textos.firma}
          </span>
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-12 w-px bg-brand/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
