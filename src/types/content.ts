/**
 * View models for the portfolio.
 *
 * These are the shapes the components render, kept deliberately separate from
 * the generated Payload types. The section components were written against
 * them and do not need to know that the data now comes from a CMS; the
 * mapping happens once, in src/lib/content.ts.
 */

export type GaleriaId = "pincel-y-bocado" | "galeria-2" | "galeria-3" | "oculta";

export interface ObraImagen {
  src: string;
  alt: string;
}

export interface Obra {
  /** The artwork's slug. Stable, and what `key` and lightbox cycling use. */
  id: string;
  titulo: string;
  galeria: GaleriaId;
  anio: number;
  tecnica: string;
  tamano: string;
  /** Optional prose about the work; paragraphs split on blank lines. */
  descripcion?: string;
  /** At least one. The first is the cover in the gallery grid. */
  imagenes: ObraImagen[];
}

/**
 * Every piece of copy on the site that is not an artwork or a project.
 *
 * Grouped by section rather than kept flat, so each component receives only
 * what it renders instead of a bag of fifteen unrelated strings.
 */
export interface TextosSitio {
  hero: {
    /** Rendered in the regular face. */
    titulo: string;
    /** Rendered italic and in the brand colour, following the title. */
    tituloDestacado: string;
    bajada: string;
    firma: string;
  };
  acerca: {
    eyebrow: string;
    /** One entry per paragraph; each gets its own staggered reveal. */
    parrafos: string[];
    lugar: string;
    anio: string;
  };
  galeria: {
    eyebrow: string;
    titulo: string;
  };
  contacto: {
    eyebrow: string;
    email: string;
    /** Handle without the `@`; the link is built from it. */
    instagram: string;
    copyright: string;
  };
  meta: {
    titulo: string;
    descripcion: string;
  };
}
