import "server-only";

import config from "@payload-config";
import { getPayload, type Where } from "payload";

import type { Media, Obra as ObraDoc } from "@/payload-types";
import type {
  Obra,
  ObraImagen,
  TextosSitio,
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
  const imagenes: ObraImagen[] = (doc.imagenes ?? []).flatMap((row) => {
    const src = mediaUrl(row.imagen);
    if (!src) {
      console.warn(
        `[content] obra "${doc.slug}" has a photo row with no resolvable file; skipping the row.`,
      );
      return [];
    }
    return [{ src, alt: row.alt || doc.titulo }];
  });

  if (imagenes.length === 0) {
    console.warn(`[content] obra "${doc.slug}" has no usable photos; skipping.`);
    return null;
  }

  return {
    id: doc.slug,
    titulo: doc.titulo,
    galeria: doc.galeria,
    anio: doc.anio,
    tecnica: doc.tecnica,
    tamano: doc.tamano,
    descripcion: doc.descripcion ?? undefined,
    imagenes,
  };
}

async function findObras(where: Where): Promise<Obra[]> {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "obras",
    where,
    // Server-side reads of the hidden gallery go through here; the public API
    // access rule would filter them out.
    overrideAccess: true,
    // The artist's drag-and-drop ordering in the admin.
    sort: "_order",
    limit: 200,
    depth: 2,
  });

  return docs.map(toObra).filter((obra): obra is Obra => obra !== null);
}

/** Every public work. The hidden gallery is never part of the static page. */
export function getObras(): Promise<Obra[]> {
  return findObras({ galeria: { not_equals: "oculta" } });
}

/** Only call this after the visitor has passed the password check. */
export function getObrasOcultas(): Promise<Obra[]> {
  return findObras({ galeria: { equals: "oculta" } });
}

/**
 * The site's copy.
 *
 * The artist's statement is stored as one block of prose and split here on
 * blank lines, which is how it was written before and the most natural way to
 * type a bio. Blank runs are dropped so a stray extra newline cannot produce
 * an empty paragraph with its own animation.
 */
export async function getTextos(): Promise<TextosSitio> {
  const payload = await client();
  const doc = await payload.findGlobal({ slug: "textos", depth: 0 });

  return {
    hero: {
      titulo: doc.heroTitulo,
      tituloDestacado: doc.heroTituloDestacado,
      bajada: doc.heroBajada,
      firma: doc.heroFirma,
    },
    acerca: {
      eyebrow: doc.acercaEyebrow,
      parrafos: doc.acercaDeclaracion.split(/\n\s*\n/)
        .map((parrafo) => parrafo.trim())
        .filter(Boolean),
      lugar: doc.acercaLugar,
      anio: doc.acercaAnio,
    },
    galeria: {
      eyebrow: doc.galeriaEyebrow,
      titulo: doc.galeriaTitulo,
    },
    contacto: {
      eyebrow: doc.contactoEyebrow,
      email: doc.contactoEmail,
      instagram: doc.contactoInstagram.replace(/^@/, ""),
      copyright: doc.contactoCopyright,
    },
    meta: {
      titulo: doc.metaTitulo,
      descripcion: doc.metaDescripcion,
    },
  };
}
