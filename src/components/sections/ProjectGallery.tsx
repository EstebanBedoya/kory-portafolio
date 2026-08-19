"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Proyecto } from "@/data/proyectos";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Lightbox from "@/components/ui/Lightbox";

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

interface ProjectGalleryProps {
  proyecto: Proyecto;
}

export default function ProjectGallery({ proyecto }: ProjectGalleryProps) {
  const { imagenes } = proyecto;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i + 1) % imagenes.length));
  }, [imagenes.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? i : (i - 1 + imagenes.length) % imagenes.length
    );
  }, [imagenes.length]);

  const activa = activeIndex === null ? null : imagenes[activeIndex];

  const ficha = [
    { label: "Año", value: String(proyecto.anio) },
    { label: "Autor", value: proyecto.autor },
    { label: "Dimensiones", value: proyecto.dimensiones },
    { label: "Técnica", value: proyecto.tecnica },
  ];

  return (
    <section id={proyecto.id} className="py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-16 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.4em] text-accent font-medium">
              Proyecto
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-neutral-dark mt-2 mb-4">
              {proyecto.titulo}
            </h2>
            <div className="w-16 h-px bg-brand/30 md:mx-0 mx-auto" />
          </div>
        </ScrollReveal>

        <div className="max-w-3xl space-y-10 mb-20">
          {proyecto.introduccion.map((bloque, index) =>
            bloque.tipo === "destacado" ? (
              <ScrollReveal key={index} delay={index * 0.15}>
                <blockquote className="border-l-2 border-brand/40 pl-6 md:pl-8">
                  <p className="font-serif italic text-2xl md:text-3xl leading-snug text-brand">
                    {bloque.texto}
                  </p>
                </blockquote>
              </ScrollReveal>
            ) : (
              <ScrollReveal key={index} delay={index * 0.15}>
                <p className="font-sans text-lg md:text-xl leading-relaxed text-neutral-dark">
                  {bloque.texto}
                </p>
              </ScrollReveal>
            )
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {imagenes.map((imagen, index) => (
            <motion.button
              key={imagen.src}
              type="button"
              variants={itemVariants}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ampliar registro ${index + 1} de ${imagenes.length}`}
              className={`group relative block w-full overflow-hidden rounded-2xl border border-white/20 bg-white/40 shadow-sm backdrop-blur-sm transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/20 ${
                imagen.wide ? "md:col-span-2" : ""
              }`}
            >
              <div
                className={`relative w-full ${
                  imagen.wide ? "aspect-[4/3]" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={imagen.src}
                  alt={imagen.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={
                    imagen.wide
                      ? "(max-width: 768px) 100vw, 1152px"
                      : "(max-width: 768px) 100vw, 576px"
                  }
                />
                <div className="absolute inset-0 bg-brand/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              </div>

              <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-brand/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                Ampliar
              </span>
            </motion.button>
          ))}
        </motion.div>

        <ScrollReveal delay={0.2}>
          <dl className="mt-20 grid grid-cols-1 gap-8 border-t border-brand/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {ficha.map((dato) => (
              <div key={dato.label} className="space-y-2">
                <dt className="text-[10px] uppercase tracking-[0.3em] text-neutral-dark/50">
                  {dato.label}
                </dt>
                <dd className="font-sans text-sm text-neutral-dark">
                  {dato.value}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </div>

      <Lightbox
        item={
          activa
            ? {
                src: activa.src,
                alt: activa.alt,
                titulo: proyecto.titulo,
                meta: ficha,
              }
            : null
        }
        eyebrow={
          activeIndex === null
            ? undefined
            : `Registro ${activeIndex + 1} / ${imagenes.length}`
        }
        onClose={() => setActiveIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
}
