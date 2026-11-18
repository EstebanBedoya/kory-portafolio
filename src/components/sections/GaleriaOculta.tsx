"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Obra } from "@/types/content";
import ObraGrid from "@/components/sections/ObraGrid";
import EscenaOculta, { precargarEscena } from "@/components/ui/EscenaOculta";
import { DUR, EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

type Estado = "bloqueada" | "verificando" | "abierta";

/**
 * Remembered for this page load only. A client-side visit back to the gallery
 * skips the password; reloading the page clears it, so the password is asked
 * again and the sweep plays again.
 */
let sesion: Obra[] | null = null;

/** The crimson palette for everything inside the opened gallery. */
const PALETA_ROJA = {
  "--color-brand": "#8C1D2C",
  "--color-accent": "#6A1220",
  "--color-neutral-dark": "#2B0A10",
  "--color-paper": "#F6DED7",
  "--color-canvas": "#B78A7D",
} as CSSProperties;

/**
 * Password-gated gallery.
 *
 * Locked, it is just a panel on the regular site. Once the password matches, a
 * sweep wipes across the screen and replaces the interface with the gallery's
 * own crimson illustration, where roses pulse and bats fly.
 *
 * The works are fetched from the server only after the password matches, so
 * they never travel in the prerendered page.
 */
export default function GaleriaOculta() {
  const [estado, setEstado] = useState<Estado>(sesion ? "abierta" : "bloqueada");
  const [obras, setObras] = useState<Obra[]>(sesion ?? []);
  const [error, setError] = useState<string | null>(null);

  // Warm the illustration while the visitor types the password.
  useEffect(() => {
    precargarEscena();
  }, []);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const password = new FormData(evento.currentTarget).get("password");
    setEstado("verificando");
    setError(null);

    try {
      const respuesta = await fetch("/api/galeria-oculta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!respuesta.ok) {
        setError(
          respuesta.status === 401
            ? "Contraseña incorrecta"
            : "No se pudo abrir la galería. Inténtalo de nuevo.",
        );
        setEstado("bloqueada");
        return;
      }
      const datos: { obras: Obra[] } = await respuesta.json();
      sesion = datos.obras;
      setObras(datos.obras);
      setEstado("abierta");
    } catch {
      setError("No se pudo abrir la galería. Inténtalo de nuevo.");
      setEstado("bloqueada");
    }
  }

  return (
    <section id="galeria-oculta" className="py-16">
      <h1 className="font-serif text-title text-neutral-dark">Galería oculta</h1>

      <form
        onSubmit={enviar}
        className="mt-8 max-w-md space-y-5 rounded-3xl border border-brand/20 bg-[color:var(--color-paper)]/50 p-6 shadow-sm backdrop-blur-sm md:p-8"
      >
        <div>
          <label
            htmlFor="galeria-oculta-password"
            className="block text-meta uppercase tracking-meta text-accent"
          >
            Contraseña
          </label>
          <input
            id="galeria-oculta-password"
            name="password"
            type="password"
            required
            autoComplete="off"
            aria-describedby={error ? "galeria-oculta-error" : undefined}
            className="mt-2 w-full rounded-sm border border-brand/40 bg-transparent px-4 py-2 text-neutral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          {error && (
            <p id="galeria-oculta-error" role="alert" className="mt-2 text-lede text-accent">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={estado !== "bloqueada"}
          className="rounded-full bg-brand px-6 py-2.5 text-meta font-medium uppercase tracking-meta text-white transition-opacity duration-300 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:opacity-50"
        >
          {estado === "verificando" ? "Verificando…" : "Entrar"}
        </button>
      </form>

      {estado === "abierta" && <GaleriaAbierta obras={obras} />}
    </section>
  );
}

/** The opened gallery, revealed by a sweep from left to right. */
function GaleriaAbierta({ obras }: { obras: Obra[] }) {
  const reduceMotion = useReducedMotion();
  const [barrido, setBarrido] = useState(!reduceMotion);
  const duracion = 2.6;

  return (
    <>
      <motion.div
        role="region"
        aria-label="Galería oculta"
        data-lenis-prevent
        initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: duracion, ease: EASE_IN_OUT }}
        style={PALETA_ROJA}
        className="fixed inset-0 z-[90] bg-[#B78A7D] text-neutral-dark"
      >
        <EscenaOculta />

        {/* Quiet bands of paper so the text reads over the engraving. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#B78A7D] via-[#B78A7D]/85 to-transparent"
        />

        <div className="absolute inset-0 overflow-y-auto" data-lenis-prevent>
          <div className="flex min-h-svh flex-col justify-between px-6 py-8 md:px-12 lg:px-24">
            <Link
              href="/"
              className="w-fit rounded-full border border-neutral-dark/30 bg-[#F6DED7]/50 px-5 py-2 text-meta font-medium uppercase tracking-meta text-neutral-dark backdrop-blur-sm transition-colors duration-300 hover:bg-neutral-dark hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              ← Volver
            </Link>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: duracion * 0.75, duration: DUR.slow, ease: EASE_OUT }}
              className="mx-auto flex max-w-shell flex-col items-center gap-3 pb-8 text-center"
            >
              <h2 className="font-serif text-display italic text-neutral-dark">
                Galería oculta
              </h2>
              <p className="text-meta uppercase tracking-eyebrow text-neutral-dark/80">
                Para quien conoce el camino
              </p>
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-2 h-10 w-px bg-accent/60"
              />
            </motion.div>
          </div>

          <div className="px-6 pb-section md:px-12 lg:px-24">
            <div className="mx-auto max-w-shell rounded-3xl border border-accent/20 bg-[#F6DED7]/75 p-6 shadow-xl backdrop-blur-md md:p-12">
              {obras.length > 0 ? (
                <ObraGrid obras={obras} />
              ) : (
                <p className="py-16 text-center font-serif text-quote italic text-accent">
                  Próximamente
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* The leading edge of the sweep: a glow that travels with the reveal. */}
      {barrido && (
        <motion.div
          aria-hidden
          initial={{ x: 0 }}
          animate={{ x: "100vw" }}
          transition={{ duration: duracion, ease: EASE_IN_OUT }}
          onAnimationComplete={() => setBarrido(false)}
          className="pointer-events-none fixed -left-48 bottom-0 top-0 z-[91] w-48"
          style={{
            background:
              "linear-gradient(90deg, rgba(140,29,44,0) 0%, rgba(255,226,214,0.35) 70%, rgba(138,28,43,0.95) 100%)",
          }}
        />
      )}
    </>
  );
}
