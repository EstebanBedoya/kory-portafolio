"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Proyecto } from "@/types/content";
import ArtworkCard from "@/components/ui/ArtworkCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Lightbox from "@/components/ui/Lightbox";
import { containerVariants, REVEAL_VIEWPORT } from "@/lib/motion";

interface ProjectGalleryProps {
  proyecto: Proyecto;
}

export default function ProjectGallery({ proyecto }: ProjectGalleryProps) {
  const { imagenes } = proyecto;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) =>
      setActiveIndex((i) =>
        i === null ? i : (i + delta + imagenes.length) % imagenes.length
      ),
    [imagenes.length]
  );

  const activa = activeIndex === null ? null : imagenes[activeIndex];

  const ficha = [
    { label: "Año", value: String(proyecto.anio) },
    { label: "Autor", value: proyecto.autor },
    { label: "Dimensiones", value: proyecto.dimensiones },
    { label: "Técnica", value: proyecto.tecnica },
  ];

  return (
    <section id={proyecto.id} className="px-6 py-section md:px-12 lg:px-24">
      <div className="mx-auto max-w-shell">
        <SectionHeading
          eyebrow="Proyecto"
          title={proyecto.titulo}
          align="responsive"
          className="mb-16"
        />

        <div className="mb-20 max-w-reading space-y-10">
          {proyecto.introduccion.map((bloque, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              {bloque.tipo === "destacado" ? (
                <blockquote className="border-l-2 border-brand/40 pl-6 md:pl-8">
                  <p className="font-serif text-quote italic text-brand">
                    {bloque.texto}
                  </p>
                </blockquote>
              ) : (
                <p className="font-sans text-body text-neutral-dark">
                  {bloque.texto}
                </p>
              )}
            </ScrollReveal>
          ))}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
        >
          {imagenes.map((imagen, index) => (
            <ArtworkCard
              key={imagen.src}
              src={imagen.src}
              label={`Ampliar: ${imagen.alt}`}
              onSelect={() => setActiveIndex(index)}
              aspect={imagen.wide ? "landscape" : "portrait"}
              className={imagen.wide ? "md:col-span-2" : ""}
              sizes={
                imagen.wide
                  ? "(max-width: 768px) 100vw, 1152px"
                  : "(max-width: 768px) 100vw, 576px"
              }
              overlay={
                <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-brand/80 px-4 py-2 text-meta font-semibold uppercase tracking-meta text-white opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  Ampliar
                </span>
              }
            />
          ))}
        </motion.div>

        <ScrollReveal delay={0.2}>
          <dl className="mt-20 grid grid-cols-1 gap-8 border-t border-brand/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {ficha.map((dato) => (
              <div key={dato.label} className="space-y-2">
                <dt className="text-meta uppercase tracking-meta text-neutral-dark/70">
                  {dato.label}
                </dt>
                <dd className="font-sans text-lede text-neutral-dark">
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
        onNext={() => step(1)}
        onPrev={() => step(-1)}
      />
    </section>
  );
}
