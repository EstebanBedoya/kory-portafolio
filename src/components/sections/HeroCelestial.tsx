"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function HeroCelestial() {
  const containerRef = useRef(null);
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
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ y, scale, opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[400px] h-[600px] md:w-[500px] md:h-[750px]"
        >
          <Image
            src="/logo-silueta.png"
            alt="Silueta de Kory"
            fill
            className="object-contain opacity-90"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.77, 0, 0.175, 1] }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-neutral-dark leading-[1.1]">
          El arte de{" "}
          <span className="italic text-brand">recordar</span>
        </h1>
        <p className="mt-6 font-sans text-sm md:text-base text-neutral-dark tracking-[0.3em] uppercase">
          Donde la memoria se vuelve materia
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-dark/70">
            Estefanía Bedoya Giraldo
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-12 bg-brand/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
