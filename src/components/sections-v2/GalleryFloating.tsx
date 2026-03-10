"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { obras, Obra } from "@/data/obras";
import ScrollReveal from "@/components/ui/ScrollReveal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.77, 0, 0.175, 1] as const,
    },
  },
};

export default function GalleryFloating() {
  return (
    <section id="gallery" className="py-32 px-6 md:px-12 lg:px-24 bg-bg-primary">
      <ScrollReveal>
        <div className="mb-20 text-center md:text-left">
          <span className="text-xs uppercase tracking-[0.4em] text-accent font-medium">
            Portafolio
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-neutral-dark mt-2 mb-4">
            Galería Celestial
          </h2>
          <div className="w-16 h-px bg-brand/30 md:mx-0 mx-auto" />
        </div>
      </ScrollReveal>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
      >
        {obras.map((obra) => (
          <GalleryItem key={obra.id} obra={obra} />
        ))}
      </motion.div>
    </section>
  );
}

function GalleryItem({ obra }: { obra: Obra }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.article
      variants={itemVariants}
      className="gallery-item group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsExpanded(false);
      }}
    >
      <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-brand/20 group-hover:-translate-y-2 border border-white/20">
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[3/4] w-full"
        >
          <Image
            src={obra.imagen}
            alt={obra.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.div>

        {/* Expansible Info Trigger */}
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-transparent overflow-hidden">
          <motion.div
            layout
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            transition={{
              layout: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
              opacity: { duration: 0.3 }
            }}
            style={{
              borderRadius: isExpanded ? "16px" : "100%",
            }}
            className={`
              relative z-20 flex flex-col items-center justify-center
              ${isExpanded 
                ? "w-full h-full bg-brand/90 backdrop-blur-md p-8" 
                : "w-28 h-28 bg-brand/80 backdrop-blur-sm cursor-pointer"
              }
              shadow-lg text-white text-center
              ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90 translate-y-4"}
              transition-all duration-500
            `}
          >
            {!isExpanded ? (
              <motion.span 
                layout="position"
                className="text-[10px] uppercase tracking-[0.3em] font-semibold"
              >
                Ver Obra
              </motion.span>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col justify-center items-center gap-6"
              >
                <div className="space-y-4">
                  <motion.h3 
                    layout="position"
                    className="font-serif text-3xl md:text-4xl italic"
                  >
                    {obra.titulo}
                  </motion.h3>
                  
                  <div className="h-px w-12 bg-white/40 mx-auto" />
                  
                  <div className="space-y-2 text-xs md:text-sm uppercase tracking-[0.2em] font-light text-white/90">
                    <p>{obra.anio}</p>
                    <p>{obra.tecnica}</p>
                    <p>{obra.tamano}</p>
                  </div>
                </div>

                <button className="mt-4 px-6 py-2 border border-white/30 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-brand transition-colors duration-300">
                  Explorar Detalles
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Static Label (Visible always or just on group hover) */}
      <div className="mt-6 flex justify-between items-baseline px-2">
        <span className="font-serif text-xl text-neutral-dark italic">
          {obra.titulo}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-brand font-bold">
          {obra.anio}
        </span>
      </div>
    </motion.article>
  );
}
