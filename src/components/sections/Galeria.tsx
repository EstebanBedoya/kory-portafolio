"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { obras } from "@/data/obras";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Galeria() {
  return (
    <section id="galeria" className="py-32 px-6 md:px-12 lg:px-24" data-gallery>
      <div className="mb-20">
        <span className="text-xs uppercase tracking-[0.4em] text-[#a0a0a0]">
          Galería
        </span>
        <div className="w-16 h-px bg-[#a0a0a0]/30 mt-4" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:gap-x-12 lg:gap-y-24"
      >
        {obras.map((obra, index) => (
          <motion.article
            key={obra.id}
            variants={itemVariants}
            className="gallery-item group cursor-none"
            style={{
              gridColumn: index === 0 || index === 3 ? "span 1" : "span 1",
            }}
          >
            <div className="relative overflow-hidden bg-[#0a0a0a]">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                className="relative aspect-[3/4] w-full"
              >
                <Image
                  src={obra.imagen}
                  alt={obra.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
              >
                <h3 className="font-serif text-2xl text-[#f5f5f5] mb-2">
                  {obra.titulo}
                </h3>
                <div className="flex flex-col gap-1 text-xs uppercase tracking-wider text-[#a0a0a0]">
                  <span>{obra.anio}</span>
                  <span>{obra.tecnica}</span>
                  <span>{obra.tamano}</span>
                </div>
              </motion.div>
            </div>

            <div className="mt-4 flex justify-between items-baseline opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <span className="font-serif text-lg text-[#f5f5f5]">
                {obra.titulo}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#808080]">
                {obra.anio}
              </span>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
