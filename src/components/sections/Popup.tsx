"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { popup, type PopupDiapositiva } from "@/data/popup";
import { DUR, EASE_OUT } from "@/lib/motion";

const DISTANCIA = 56;

/**
 * Making-of of the pop-up card series, as a slide deck.
 *
 * Slides enter from the side they are navigated toward, on the same ease-out
 * curve and durations as the rest of the site's reveals.
 */
export default function Popup() {
  const [indice, setIndice] = useState(0);
  const [direccion, setDireccion] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion();

  const total = popup.diapositivas.length;
  const actual = popup.diapositivas[indice];

  const ir = (destino: number) => {
    const siguiente = (destino + total) % total;
    setDireccion(destino > indice ? 1 : -1);
    setIndice(siguiente);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") ir(indice + 1);
    if (e.key === "ArrowLeft") ir(indice - 1);
  };

  return (
    <section id="popup" className="px-6 py-section md:px-12 lg:px-24">
      <div className="mx-auto max-w-shell">
        <SectionHeading
          eyebrow={popup.eyebrow}
          title={popup.titulo}
          align="responsive"
          className="mb-6"
        />
        <p className="mb-12 max-w-2xl text-center text-lede text-neutral-dark/80 md:text-left">
          {popup.bajada}
        </p>

        <div
          role="group"
          aria-roledescription="carrusel"
          aria-label="Proceso de las tarjetas pop-up"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="grid gap-8 rounded-3xl border border-brand/15 bg-[color:var(--color-paper)]/50 p-4 shadow-sm backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:grid-cols-[1.4fr_1fr] md:gap-12 md:p-8"
        >
          {/* Stage */}
          <div className="relative h-[55vh] overflow-hidden rounded-2xl bg-neutral-dark/90 md:h-[70vh]">
            <AnimatePresence initial={false} mode="popLayout" custom={direccion}>
              <motion.div
                key={indice}
                custom={direccion}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: reduceMotion ? 0 : d * DISTANCIA }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: reduceMotion ? 0 : d * -DISTANCIA }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduceMotion ? 0 : DUR.slow, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                <Escena diapositiva={actual} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Caption + controls */}
          <div className="flex flex-col justify-between gap-8">
            <div aria-live="polite" className="min-h-[14rem]">
              <AnimatePresence initial={false} mode="wait" custom={direccion}>
                <motion.div
                  key={indice}
                  custom={direccion}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, y: reduceMotion ? 0 : d * 18 }),
                    center: { opacity: 1, y: 0 },
                    exit: { opacity: 0 },
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduceMotion ? 0 : DUR.base, ease: EASE_OUT }}
                  className="space-y-4"
                >
                  <p className="text-eyebrow font-medium uppercase tracking-eyebrow text-accent">
                    {actual.fase} · {actual.etiqueta}
                  </p>
                  <h3 className="font-serif text-title italic text-neutral-dark">
                    {actual.titulo}
                  </h3>
                  <div className="h-px w-16 bg-brand/30" />
                  <p className="text-lede text-neutral-dark/80">{actual.texto}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-5">
              <div
                role="group"
                aria-label="Diapositivas"
                className="flex flex-wrap items-center gap-1"
              >
                {popup.diapositivas.map((d, i) => (
                  <button
                    key={d.titulo}
                    type="button"
                    aria-label={`Ir a la diapositiva ${i + 1}: ${d.titulo}`}
                    aria-current={i === indice}
                    onClick={() => ir(i)}
                    className="flex h-6 items-center px-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <motion.span
                      animate={{ width: i === indice ? 28 : 8, opacity: i === indice ? 1 : 0.35 }}
                      transition={{ duration: reduceMotion ? 0 : DUR.base, ease: EASE_OUT }}
                      className="block h-1 rounded-full bg-brand"
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => ir(indice - 1)}
                  className="rounded-full border border-brand/30 px-6 py-2.5 text-meta font-medium uppercase tracking-meta text-brand transition-colors duration-300 hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => ir(indice + 1)}
                  className="rounded-full bg-brand px-6 py-2.5 text-meta font-medium uppercase tracking-meta text-white transition-opacity duration-300 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Siguiente
                </button>
                <span className="ml-auto whitespace-nowrap text-meta uppercase tracking-meta text-neutral-dark/70">
                  {String(indice + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** What the stage shows: a photo, a video, or a typographic slide. */
function Escena({ diapositiva }: { diapositiva: PopupDiapositiva }) {
  if (diapositiva.src) {
    return (
      <Image
        src={diapositiva.src}
        alt={diapositiva.alt ?? diapositiva.titulo}
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-contain"
      />
    );
  }

  if (diapositiva.video) {
    return (
      <video
        src={diapositiva.video}
        aria-label={diapositiva.alt ?? diapositiva.titulo}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <div className="flex h-full flex-col justify-center gap-5 overflow-y-auto p-8 md:p-12">
      <ul className="space-y-4 text-lede text-white/85">
        {(diapositiva.lista ?? []).map((linea, i) => (
          <motion.li
            key={linea}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1, duration: DUR.base, ease: EASE_OUT }}
            className="border-l border-white/25 pl-4"
          >
            {linea}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
