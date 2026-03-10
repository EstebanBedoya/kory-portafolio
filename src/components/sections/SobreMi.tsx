"use client";

import { motion } from "framer-motion";
import Section from "../ui/Section";

const declaracion = `Soy Estefanía Bedoya Giraldo, artista enfocada principalmente en el dibujo y la pintura. Trabajo con óleo pastel, lapicero, lápiz, instalaciones y medios audiovisuales como el cortometraje. Desde niña tuve afinidad con lo manual y lo creativo, pero fue al conocer a un artista plástico que comprendí que el arte podía ser un camino real. Esa revelación marcó el inicio consciente de mi práctica.

Mi obra está atravesada por los archivos de la memoria, la nostalgia y el acto de recordar como construcción de identidad. Me interesa cómo el recuerdo moldea lo que somos y cómo el olvido puede convertirse en una forma de pérdida. También exploro el cuestionamiento del ser y, desde lo plástico, trabajo con elementos como los alimentos y las frutas, que me permiten investigar la materialidad, el color y su carga simbólica. Mi proceso oscila entre lo narrativo y lo planificado, con momentos experimentales. Visualmente, mi estética se mueve entre lo gótico y lo matérico, combinando sensibilidad y oscuridad, con una presencia evidente de la técnica y la textura.

Busco generar contemplación: que el espectador no solo observe la obra, sino que sienta que es observado por ella. Sitúo mi trabajo en un contexto contemporáneo con una dimensión poética, y me interesa expandir mi práctica hacia el campo audiovisual, especialmente en dirección de arte.`;

export default function SobreMi() {
  return (
    <Section id="sobre-mi" className="py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-[#a0a0a0]">
            Sobre mí
          </span>
          <div className="w-16 h-px bg-[#a0a0a0]/30 mt-4" />
        </div>

        <div className="space-y-8">
          {declaracion.split("\n\n").map((parrafo, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="font-sans text-lg md:text-xl leading-relaxed text-[#d0d0d0]"
            >
              {parrafo}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex gap-8 text-xs uppercase tracking-widest text-[#808080]"
        >
          <span>Medellín, Colombia</span>
          <span>•</span>
          <span>2003</span>
        </motion.div>
      </div>
    </Section>
  );
}
