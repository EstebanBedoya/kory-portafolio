"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { TextosSitio } from "@/types/content";

interface AboutCelestialProps {
  textos: TextosSitio["acerca"];
}

export default function AboutCelestial({ textos }: AboutCelestialProps) {
  return (
    <section id="about" className="px-6 py-section md:px-12 lg:px-24">
      <div className="mx-auto max-w-reading">
        <SectionHeading eyebrow={textos.eyebrow} className="mb-16" />

        <div className="space-y-12">
          {textos.parrafos.map((parrafo, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <p className="font-sans text-body text-neutral-dark">{parrafo}</p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.6}>
          <div className="mt-16 flex gap-8 text-meta uppercase tracking-meta text-neutral-dark/70">
            <span>{textos.lugar}</span>
            <span>•</span>
            <span>{textos.anio}</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
