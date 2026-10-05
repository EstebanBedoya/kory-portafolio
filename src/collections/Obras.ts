import type { CollectionConfig } from "payload";

import { slugify } from "@/lib/slugify";
import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from "@/hooks/revalidatePortafolio";

/**
 * Individual artworks, rendered as the celestial gallery grid. A work holds
 * one or more photos and belongs to one gallery (`galeria`).
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
    // The hidden gallery is password-gated on the site, so its works must not
    // be readable through the public REST/GraphQL API either. Only a logged-in
    // admin sees them here; the site reads them server-side, see
    // src/lib/content.ts.
    read: ({ req }) =>
      req.user ? true : { galeria: { not_equals: "oculta" } },
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
      name: "galeria",
      type: "select",
      required: true,
      defaultValue: "pincel-y-bocado",
      index: true,
      label: "Galería",
      options: [
        { label: "Pincel y Bocado", value: "pincel-y-bocado" },
        { label: "Galería 2", value: "galeria-2" },
        { label: "Galería 3", value: "galeria-3" },
        { label: "Galería oculta (con contraseña)", value: "oculta" },
      ],
      admin: { position: "sidebar" },
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
      name: "descripcion",
      type: "textarea",
      label: "Descripción",
      admin: {
        description:
          "Opcional. Texto sobre la obra; se muestra al abrirla. Una línea en blanco separa párrafos.",
      },
    },
    {
      name: "imagenes",
      type: "array",
      required: true,
      minRows: 1,
      label: "Fotos",
      labels: { singular: "Foto", plural: "Fotos" },
      admin: {
        description:
          "Una obra puede tener varias fotos (detalles, otros ángulos). La primera es la portada en la galería.",
      },
      fields: [
        {
          name: "imagen",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Foto",
        },
        {
          name: "alt",
          type: "text",
          label: "Texto alternativo",
          admin: {
            description:
              "Opcional. Qué se ve en esta foto; si se deja vacío se usa el título de la obra.",
          },
        },
      ],
    },
  ],
};
