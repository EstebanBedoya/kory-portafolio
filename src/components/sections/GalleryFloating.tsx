"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Obra, TextosSitio } from "@/types/content";
import ArtworkCard from "@/components/ui/ArtworkCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Lightbox from "@/components/ui/Lightbox";
import {
  DUR,
  EASE_IN_OUT,
  containerVariants,
  REVEAL_VIEWPORT,
} from "@/lib/motion";

interface GalleryFloatingProps {
  obras: Obra[];
  textos: TextosSitio["galeria"];
}

export default function GalleryFloating({ obras, textos }: GalleryFloatingProps) {
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);

  // `obras` belongs in the dependency list now that it arrives as a prop:
  // without it this closure would keep pointing at the first render's array
  // and the lightbox arrows would step through stale data.
  const step = useCallback(
    (delta: number) => {
      setSelectedObra((current) => {
        if (!current) return current;
        const index = obras.findIndex((o) => o.id === current.id);
        return obras[(index + delta + obras.length) % obras.length];
      });
    },
    [obras],
  );

  return (
    <section id="gallery" className="px-6 py-section md:px-12 lg:px-24">
      <div className="mx-auto max-w-shell">
        <SectionHeading
          eyebrow={textos.eyebrow}
          title={textos.titulo}
          align="responsive"
          className="mb-20"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12"
        >
          {obras.map((obra) => (
            <ArtworkCard
              key={obra.id}
              src={obra.imagen}
              label={`Ver ${obra.titulo}, ${obra.anio}`}
              onSelect={() => setSelectedObra(obra)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              overlay={<ObraOverlay obra={obra} />}
              footer={
                <div className="mt-6 flex items-baseline justify-between px-2">
                  <span className="font-serif text-body italic text-neutral-dark">
                    {obra.titulo}
                  </span>
                  <span className="text-meta font-bold uppercase tracking-meta text-accent">
                    {obra.anio}
                  </span>
                </div>
              }
            />
          ))}
        </motion.div>
      </div>

      <Lightbox
        item={
          selectedObra
            ? {
                src: selectedObra.imagen,
                alt: selectedObra.titulo,
                titulo: selectedObra.titulo,
                meta: [
                  { label: "Año de creación", value: String(selectedObra.anio) },
                  { label: "Técnica empleada", value: selectedObra.tecnica },
                  { label: "Dimensiones", value: selectedObra.tamano },
                ],
              }
            : null
        }
        onClose={() => setSelectedObra(null)}
        onNext={() => step(1)}
        onPrev={() => step(-1)}
      />
    </section>
  );
}

/**
 * Hover flourish: a badge that morphs into a full-bleed detail panel.
 * Visibility is driven by the card's `group` state so it also appears on
 * keyboard focus; the expanded state stays a pointer-only enhancement,
 * since the same data is available in the lightbox the card opens.
 */
function ObraOverlay({ obra }: { obra: Obra }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:pointer-events-auto">
      <motion.div
        layout
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        transition={{
          layout: { duration: DUR.base, ease: EASE_IN_OUT },
          opacity: { duration: DUR.fast },
        }}
        style={{ borderRadius: isExpanded ? "16px" : "100%" }}
        className={`relative z-20 flex flex-col items-center justify-center text-center text-white shadow-lg ${
          isExpanded
            ? "h-full w-full bg-brand/90 p-8 backdrop-blur-md"
            : "h-28 w-28 bg-brand/80 backdrop-blur-sm"
        }`}
      >
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full w-full flex-col items-center justify-center gap-6"
          >
            <div className="space-y-4">
              <motion.h3
                layout="position"
                className="font-serif text-title italic"
              >
                {obra.titulo}
              </motion.h3>

              <div className="mx-auto h-px w-12 bg-white/40" />

              <div className="space-y-2 text-eyebrow font-light uppercase tracking-meta text-white/90">
                <p>{obra.anio}</p>
                <p>{obra.tecnica}</p>
                <p>{obra.tamano}</p>
              </div>
            </div>

            <div className="mt-4 rounded-full border border-white/30 bg-white px-6 py-2 text-meta uppercase tracking-meta text-brand">
              Ver detalles
            </div>
          </motion.div>
        ) : (
          <motion.span
            layout="position"
            className="text-meta font-semibold uppercase tracking-meta"
          >
            Ver obra
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}
