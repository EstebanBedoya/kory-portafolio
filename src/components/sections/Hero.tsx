"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 py-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="max-w-4xl text-center"
      >
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#f5f5f5] leading-[1.1] tracking-tight">
          El acto de{" "}
          <span className="italic text-[#a0a0a0]">recordar</span>
          <br />
          como construcción de{" "}
          <span className="italic text-[#a0a0a0]">identidad</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#a0a0a0]">
            Estefanía Bedoya Giraldo
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-[#a0a0a0] to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
