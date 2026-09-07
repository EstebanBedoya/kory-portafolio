import "server-only";

import config from "@payload-config";
import { getPayload } from "payload";

import type { Media, Obra as ObraDoc, Proyecto as ProyectoDoc } from "@/payload-types";
import type {
  NavProyecto,
  Obra,
  Proyecto,
  ProyectoImagen,
  ProyectoParrafo,
} from "@/types/content";

/**
 * Reads the portfolio content out of Payload and maps it to the view models
 * the components render.
 *
 * Runs through the Local API, so there is no HTTP hop — these are direct
 * database queries. They happen while the pages are being generated, not per
 * request, which is what keeps a self-hosted database off the critical path
 * of every visit.
 */

async function client() {
  return getPayload({ config });
}

/**
 * Resolves an upload relationship to the URL the site should serve.
 *
 * Prefers the capped `web` variant over the original: originals are archival
 * scans, and handing one to the image optimiser is both slow and billed.
 *
 * Returns null when the relationship did not resolve — the media document was
 * deleted, or the query ran too shallow to populate it. Callers must drop
 * those records rather than pass an empty string to `next/image`, which
 * throws during static generation and takes the whole build down.
 */
function mediaUrl(value: number | Media | null | undefined): string | null {
  if (!value || typeof value === "number") return null;
  return value.sizes?.web?.url ?? value.url ?? null;
}

function toObra(doc: ObraDoc): Obra | null {
  const imagen = mediaUrl(doc.imagen);
  if (!imagen) {
    console.warn(`[content] obra "${doc.slug}" has no resolvable image; skipping.`);
    return null;
  }

  return {
    id: doc.slug,
    titulo: doc.titulo,
    anio: doc.anio,
    tecnica: doc.tecnica,
    tamano: doc.tamano,
    imagen,
  };
}

function toProyecto(doc: ProyectoDoc): Proyecto | null {
  const imagenes: ProyectoImagen[] = (doc.imagenes ?? []).flatMap((row) => {
    const src = mediaUrl(row.imagen);
    if (!src) {
      console.warn(
        `[content] proyecto "${doc.slug}" has an image row with no resolvable file; skipping the row.`,
      );
      return [];
    }
    return [{ src, alt: row.alt, wide: Boolean(row.wide) }];
  });

  if (imagenes.length === 0) {
    console.warn(`[content] proyecto "${doc.slug}" has no usable images; skipping.`);
    return null;
  }

  const introduccion: ProyectoParrafo[] = (doc.introduccion ?? []).map((bloque) => ({
    tipo: bloque.tipo,
    texto: bloque.texto,
  }));

  return {
    id: doc.slug,
    titulo: doc.titulo,
    anio: doc.anio,
    autor: doc.autor,
    dimensiones: doc.dimensiones,
    tecnica: doc.tecnica,
    introduccion,
    imagenes,
  };
}

export async function getObras(): Promise<Obra[]> {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "obras",
    // The artist's drag-and-drop ordering in the admin.
    sort: "_order",
    limit: 200,
    depth: 2,
  });

  return docs.map(toObra).filter((obra): obra is Obra => obra !== null);
}

export async function getProyectos(): Promise<Proyecto[]> {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "proyectos",
    sort: "_order",
    limit: 100,
    depth: 2,
  });

  return docs
    .map(toProyecto)
    .filter((proyecto): proyecto is Proyecto => proyecto !== null);
}

/**
 * The nav only needs a title and an anchor, so this skips the depth-2
 * population that resolving every project's images would cost.
 */
export async function getNavProyectos(): Promise<NavProyecto[]> {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "proyectos",
    sort: "_order",
    limit: 100,
    depth: 0,
    select: { slug: true, titulo: true },
  });

  return docs.map((doc) => ({ id: doc.slug, titulo: doc.titulo }));
}
