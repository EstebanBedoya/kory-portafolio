"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import Lightbox from "@/components/ui/Lightbox";
import { DUR, EASE_IN_OUT } from "@/lib/motion";
import type { Obra } from "@/types/content";

type Vista = "carrusel" | "grilla";

const VISTAS: { id: Vista; nombre: string }[] = [
  { id: "carrusel", nombre: "Carrusel" },
  { id: "grilla", nombre: "Grilla" },
];

interface ObraLightboxProps {
  obra: Obra | null;
  onClose: () => void;
}

/**
 * Opens one work. A single photo is shown as-is; with several, the viewer
 * picks between a carousel and a grid. The choice sticks while browsing the
 * gallery, so someone who prefers the grid does not have to re-pick it.
 */
export default function ObraLightbox({ obra, onClose }: ObraLightboxProps) {
  const [vista, setVista] = useState<Vista>("carrusel");
  const [foto, setFoto] = useState(0);
  const [obraId, setObraId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  // Start every work on its first photo. Adjusting state while rendering is
  // the documented alternative to an effect for resetting on a prop change.
  if ((obra?.id ?? null) !== obraId) {
    setObraId(obra?.id ?? null);
    setFoto(0);
  }

  const total = obra?.imagenes.length ?? 0;
  const varias = total > 1;
  const enCarrusel = varias && vista === "carrusel";

  const step = useCallback(
    (delta: number) => setFoto((i) => (i + delta + total) % total),
    [total],
  );

  if (!obra) {
    return <Lightbox item={null} onClose={onClose} />;
  }

  const zoom = reduceMotion
    ? { duration: 0 }
    : { duration: DUR.base, ease: EASE_IN_OUT };

  const actual = obra.imagenes[Math.min(foto, total - 1)];

  return (
    <Lightbox
      item={{
        src: actual.src,
        alt: actual.alt,
        titulo: obra.titulo,
        descripcion: obra.descripcion,
        meta: [
          { label: "Año de creación", value: String(obra.anio) },
          { label: "Técnica empleada", value: obra.tecnica },
          { label: "Dimensiones", value: obra.tamano },
        ],
      }}
      eyebrow={
        enCarrusel ? `Foto ${foto + 1} / ${total}` : varias ? `${total} fotos` : undefined
      }
      media={
        <LayoutGroup id={`obra-${obra.id}`}>
          {varias && vista === "grilla" ? (
            <ul className="absolute inset-0 grid grid-cols-2 content-start gap-3 overflow-y-auto p-1">
              {obra.imagenes.map((imagen, index) => (
                <motion.li
                  key={imagen.src}
                  // The photo we are zooming out of must stay visible, or it
                  // would hide the shared-layout animation.
                  initial={reduceMotion || index === foto ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduceMotion ? 0 : 0.15 + index * 0.05 }}
                  className="relative aspect-[3/4]"
                >
                  {/* The shared layoutId is what turns the click into a zoom:
                      this box and the carousel's box are the same element to
                      framer-motion, which animates one into the other. */}
                  <motion.div
                    layoutId={`foto-${index}`}
                    transition={zoom}
                    className="absolute inset-0 overflow-hidden rounded-lg"
                  >
                    <button
                      type="button"
                      aria-label={`Ver foto ${index + 1} de ${total} a pantalla completa`}
                      onClick={() => {
                        setFoto(index);
                        setVista("carrusel");
                      }}
                      className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <Image
                        src={imagen.src}
                        alt={imagen.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </button>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={foto}
                layoutId={`foto-${foto}`}
                transition={zoom}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Image
                  src={actual.src}
                  alt={actual.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </LayoutGroup>
      }
      controls={
        varias ? (
          <div
            role="group"
            aria-label="Forma de ver las fotos"
            className="flex w-fit gap-1 rounded-full border border-white/10 p-1"
          >
            {VISTAS.map(({ id, nombre }) => (
              <button
                key={id}
                type="button"
                aria-pressed={vista === id}
                onClick={() => setVista(id)}
                className={`rounded-full px-5 py-2 text-meta font-medium uppercase tracking-meta transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  vista === id
                    ? "bg-white text-neutral-dark"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {nombre}
              </button>
            ))}
          </div>
        ) : undefined
      }
      onClose={onClose}
      onNext={enCarrusel ? () => step(1) : undefined}
      onPrev={enCarrusel ? () => step(-1) : undefined}
    />
  );
}
