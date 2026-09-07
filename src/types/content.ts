/**
 * View models for the portfolio.
 *
 * These are the shapes the components render, kept deliberately separate from
 * the generated Payload types. The section components were written against
 * them and do not need to know that the data now comes from a CMS; the
 * mapping happens once, in src/lib/content.ts.
 */

export interface Obra {
  /** The artwork's slug. Stable, and what `key` and lightbox cycling use. */
  id: string;
  titulo: string;
  anio: number;
  tecnica: string;
  tamano: string;
  imagen: string;
}

export interface ProyectoParrafo {
  tipo: "parrafo" | "destacado";
  texto: string;
}

export interface ProyectoImagen {
  src: string;
  alt: string;
  /** Landscape shots span the full grid width so they are never cropped. */
  wide?: boolean;
}

export interface Proyecto {
  /** The project's slug. Also the section's anchor target, e.g. `#slug`. */
  id: string;
  titulo: string;
  anio: number;
  autor: string;
  dimensiones: string;
  tecnica: string;
  introduccion: ProyectoParrafo[];
  imagenes: ProyectoImagen[];
}

/** What the nav needs to build its links — nothing more. */
export type NavProyecto = Pick<Proyecto, "id" | "titulo">;
