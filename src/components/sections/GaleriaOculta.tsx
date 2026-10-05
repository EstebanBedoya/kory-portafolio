"use client";

import { useState, type FormEvent } from "react";
import type { Obra } from "@/types/content";
import ObraGrid from "@/components/sections/ObraGrid";

type Estado = "bloqueada" | "verificando" | "abierta";

/**
 * Password-gated gallery, drawn in red to set it apart from the rest.
 *
 * The works are fetched from the server only after the password matches, so
 * they never travel in the prerendered page.
 */
export default function GaleriaOculta() {
  const [estado, setEstado] = useState<Estado>("bloqueada");
  const [obras, setObras] = useState<Obra[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      setObras(datos.obras);
      setEstado("abierta");
    } catch {
      setError("No se pudo abrir la galería. Inténtalo de nuevo.");
      setEstado("bloqueada");
    }
  }

  return (
    <section id="galeria-oculta" className="py-16">
      <h1 className="font-serif text-title text-red-700">Galería oculta</h1>

      {estado === "abierta" ? (
        <div className="mt-12 text-red-700">
          {obras.length > 0 ? (
            <ObraGrid obras={obras} />
          ) : (
            <p className="font-serif text-quote italic">Próximamente</p>
          )}
        </div>
      ) : (
        <form onSubmit={enviar} className="mt-6 flex flex-wrap items-start gap-4">
          <div>
            <label
              htmlFor="galeria-oculta-password"
              className="block text-meta uppercase tracking-meta text-red-700"
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
              className="mt-2 w-64 rounded-sm border border-red-700/50 bg-transparent px-4 py-2 text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            />
            {error && (
              <p
                id="galeria-oculta-error"
                role="alert"
                className="mt-2 text-lede text-red-700"
              >
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={estado === "verificando"}
            className="mt-6 rounded-full border border-red-700 px-6 py-2 text-meta uppercase tracking-meta text-red-700 transition-colors duration-300 hover:bg-red-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700 disabled:opacity-50"
          >
            {estado === "verificando" ? "Verificando…" : "Entrar"}
          </button>
        </form>
      )}
    </section>
  );
}
