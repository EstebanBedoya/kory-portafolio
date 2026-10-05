"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import GaleriaOculta from "@/components/sections/GaleriaOculta";

/** The sections that live at the foot of the page rather than in the menu. */
const SECCIONES = [
  { id: "kaoa-grabado", titulo: "Kaoa grabado" },
  { id: "k-alterno", titulo: "K Alterno" },
  { id: "ojo-de-kory", titulo: "Ojo de Kory" },
  { id: "subasta", titulo: "Subasta" },
];

export default function MasSecciones() {
  return (
    <div className="px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-shell divide-y divide-brand/20 border-y border-brand/20">
        {SECCIONES.map((seccion, index) => (
          <section key={seccion.id} id={seccion.id} className="py-16">
            <ScrollReveal delay={index * 0.1}>
              <h2 className="font-serif text-title text-neutral-dark">
                {seccion.titulo}
              </h2>
              <p className="mt-3 text-meta uppercase tracking-meta text-neutral-dark/70">
                Próximamente
              </p>
            </ScrollReveal>
          </section>
        ))}
        <GaleriaOculta />
      </div>
    </div>
  );
}
