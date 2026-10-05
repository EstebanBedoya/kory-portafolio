"use client";

import { useState } from "react";
import type { Obra, TextosSitio } from "@/types/content";
import SectionHeading from "@/components/ui/SectionHeading";
import ObraGrid from "@/components/sections/ObraGrid";
import { GALERIAS, type GaleriaPublica } from "@/lib/menu";

interface GaleriasProps {
  obras: Obra[];
  textos: TextosSitio["galeria"];
}

/** The three public galleries, one tab each. */
export default function Galerias({ obras, textos }: GaleriasProps) {
  const [activa, setActiva] = useState<GaleriaPublica>("pincel-y-bocado");
  const delaGaleria = obras.filter((obra) => obra.galeria === activa);

  return (
    <section id="galerias" className="px-6 py-section md:px-12 lg:px-24">
      <div className="mx-auto max-w-shell">
        <SectionHeading
          eyebrow={textos.eyebrow}
          title={textos.titulo}
          align="responsive"
          className="mb-12"
        />

        <div
          role="tablist"
          aria-label="Galerías"
          className="mb-16 flex flex-wrap justify-center gap-x-10 gap-y-4 border-b border-brand/20 md:justify-start"
        >
          {GALERIAS.map((galeria) => {
            const seleccionada = galeria.id === activa;
            return (
              <button
                key={galeria.id}
                role="tab"
                id={`tab-${galeria.id}`}
                aria-selected={seleccionada}
                aria-controls="panel-galeria"
                onClick={() => setActiva(galeria.id)}
                className={`-mb-px border-b-2 pb-3 text-eyebrow uppercase tracking-meta transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                  seleccionada
                    ? "border-brand text-brand"
                    : "border-transparent text-neutral-dark/70 hover:text-brand"
                }`}
              >
                {galeria.nombre}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="panel-galeria"
          aria-labelledby={`tab-${activa}`}
        >
          {delaGaleria.length > 0 ? (
            // Keyed so each gallery mounts fresh: the grid's reveal animation
            // and lightbox state belong to one gallery, not the whole section.
            <ObraGrid key={activa} obras={delaGaleria} />
          ) : (
            <p className="py-16 text-center font-serif text-quote italic text-neutral-dark/70">
              Próximamente
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
