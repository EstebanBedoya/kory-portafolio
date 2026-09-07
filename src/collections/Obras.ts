import type { CollectionConfig } from "payload";

import { slugify } from "@/lib/slugify";
import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from "@/hooks/revalidatePortafolio";

/**
 * Individual artworks, rendered as the celestial gallery grid.
 *
 * Field names stay in Spanish to match the vocabulary the rest of the
 * codebase already uses for this domain.
 */
export const Obras: CollectionConfig = {
  slug: "obras",
  labels: {
    singular: "Obra",
    plural: "Obras",
  },
  // Gallery order is editorial, not chronological. Drag-and-drop in the admin
  // beats asking the artist to keep a column of numbers consistent.
  orderable: true,
  admin: {
    group: "Portafolio",
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "anio", "tecnica", "tamano"],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: "titulo",
      type: "text",
      required: true,
      label: "Título",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug",
      admin: {
        description:
          "Identificador estable de la obra. Se genera desde el título y no conviene cambiarlo.",
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === "string" && value.length > 0) return value;
            const titulo = typeof data?.titulo === "string" ? data.titulo : "";
            return titulo ? slugify(titulo) : value;
          },
        ],
      },
    },
    {
      name: "anio",
      type: "number",
      required: true,
      label: "Año",
      admin: { position: "sidebar" },
    },
    {
      name: "tecnica",
      type: "text",
      required: true,
      label: "Técnica",
    },
    {
      name: "tamano",
      type: "text",
      required: true,
      label: "Tamaño",
    },
    {
      name: "imagen",
      type: "upload",
      relationTo: "media",
      // Required so a gallery entry can never render without its artwork.
      // The read layer filters unresolved uploads as well; see src/lib/content.ts.
      required: true,
      label: "Imagen",
    },
  ],
};
