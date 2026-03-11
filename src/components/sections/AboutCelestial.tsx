"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const declaracion = `Mi obra está atravesada por los archivos de la memoria, la nostalgia y el acto de recordar como construcción de identidad. Me interesa cómo el recuerdo moldea lo que somos y cómo el olvido puede convertirse en una forma de pérdida.

Desde lo plástico, trabajo con elementos como los alimentos y las frutas, que me permiten investigar la materialidad, el color y su carga simbólica. Visualmente, mi estética se mueve entre lo gótico y lo matérico, combinando sensibilidad y oscuridad.

Busco generar contemplación: que el espectador no solo observe la obra, sino que sienta que es observado por ella.`;

export default function AboutCelestial() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="mb-16">
            <span className="text-xs uppercase tracking-[0.4em] text-brand">
              Acerca de mí
            </span>
            <div className="w-16 h-px bg-brand/30 mt-4" />
          </div>
        </ScrollReveal>

        <div className="space-y-12">
          {declaracion.split("\n\n").map((parrafo, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <p className="font-sans text-lg md:text-xl leading-relaxed text-neutral-dark">
                {parrafo}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.6}>
          <div className="mt-16 flex gap-8 text-xs uppercase tracking-widest text-neutral-dark/50">
            <span>Medellín, Colombia</span>
            <span>•</span>
            <span>2003</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
