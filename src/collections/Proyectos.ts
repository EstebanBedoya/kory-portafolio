import type { CollectionConfig } from "payload";

import { slugify } from "@/lib/slugify";
import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from "@/hooks/revalidatePortafolio";

/**
 * Multi-image projects with an editorial introduction, e.g. "Entre migas y
 * recuerdos".
 *
 * `introduccion` is modelled as an array of typed blocks rather than rich
 * text. The design gives a paragraph and a pull-quote two deliberately
 * different voices (see the Two-Voice Rule in DESIGN.md), and the renderer
 * switches on exactly those two cases. A free rich-text field would let
 * markup into the page that the design has no treatment for; this shape
 * cannot express anything the design does not already handle.
 */
export const Proyectos: CollectionConfig = {
  slug: "proyectos",
  labels: {
    singular: "Proyecto",
    plural: "Proyectos",
  },
  orderable: true,
  admin: {
    group: "Portafolio",
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "anio", "autor"],
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
          "Se usa como ancla de navegación (#slug). Cambiarlo rompe los enlaces del menú y los enlaces externos.",
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
      name: "autor",
      type: "text",
      required: true,
      label: "Autor",
    },
    {
      name: "dimensiones",
      type: "text",
      required: true,
      label: "Dimensiones",
    },
    {
      name: "tecnica",
      type: "text",
      required: true,
      label: "Técnica",
    },
    {
      name: "introduccion",
      type: "array",
      required: true,
      minRows: 1,
      label: "Introducción",
      labels: { singular: "Bloque", plural: "Bloques" },
      admin: {
        description:
          "El texto del proyecto, bloque por bloque. El orden de las filas es el orden en que se leen.",
        initCollapsed: false,
      },
      fields: [
        {
          name: "tipo",
          type: "radio",
          required: true,
          defaultValue: "parrafo",
          label: "Tipo",
          options: [
            { label: "Párrafo", value: "parrafo" },
            { label: "Destacado", value: "destacado" },
          ],
          admin: {
            description:
              "«Destacado» se compone en serif y con filete lateral; reservalo para una idea por proyecto.",
            layout: "horizontal",
          },
        },
        {
          name: "texto",
          type: "textarea",
          required: true,
          label: "Texto",
        },
      ],
    },
    {
      name: "imagenes",
      type: "array",
      required: true,
      minRows: 1,
      label: "Imágenes",
      labels: { singular: "Imagen", plural: "Imágenes" },
      admin: {
        description: "El orden de las filas es el orden de la cuadrícula.",
      },
      fields: [
        {
          name: "imagen",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Imagen",
        },
        {
          name: "alt",
          type: "textarea",
          required: true,
          label: "Texto alternativo",
          admin: {
            description:
              "Qué se ve en la foto, para quien no puede verla. Describe la imagen en este proyecto, no la obra en general.",
          },
        },
        {
          name: "wide",
          type: "checkbox",
          defaultValue: false,
          label: "Apaisada",
          admin: {
            description:
              "Las tomas horizontales ocupan todo el ancho de la cuadrícula para que no se recorten.",
          },
        },
      ],
    },
  ],
};
