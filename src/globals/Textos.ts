import type { GlobalConfig } from "payload";

import { revalidateGlobalAfterChange } from "@/hooks/revalidatePortafolio";

/**
 * Every piece of copy on the site that is not an artwork or a project.
 *
 * A single global with tabs rather than one global per section: the artist's
 * sidebar should be dominated by the things she edits often — her work — not
 * by five entries she touches a few times a year. The tabs carry the section
 * names, so nothing is harder to find.
 */
export const Textos: GlobalConfig = {
  slug: "textos",
  label: "Textos del sitio",
  admin: {
    group: "Contenido",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ---------------------------------------------------------------
        {
          label: "Portada",
          description: "Lo primero que se ve al entrar.",
          fields: [
            {
              name: "heroTitulo",
              type: "text",
              required: true,
              label: "Título",
              defaultValue: "El arte de",
              admin: {
                description:
                  "La primera parte del título, en tipografía normal.",
              },
            },
            {
              name: "heroTituloDestacado",
              type: "text",
              required: true,
              label: "Palabra destacada",
              defaultValue: "recordar",
              admin: {
                description:
                  "Se compone en itálica y en color de marca, a continuación del título. Va separada porque son dos voces tipográficas distintas, no un solo texto.",
              },
            },
            {
              name: "heroBajada",
              type: "text",
              required: true,
              label: "Bajada",
              defaultValue: "Donde la memoria se vuelve materia",
              admin: {
                description: "Se muestra en mayúsculas.",
              },
            },
            {
              name: "heroFirma",
              type: "text",
              required: true,
              label: "Firma",
              defaultValue: "Estefanía Bedoya Giraldo",
              admin: {
                description: "El nombre al pie de la portada.",
              },
            },
          ],
        },
        // ---------------------------------------------------------------
        {
          label: "Acerca de mí",
          fields: [
            {
              name: "acercaEyebrow",
              type: "text",
              required: true,
              label: "Etiqueta de sección",
              defaultValue: "Acerca de mí",
            },
            {
              name: "acercaDeclaracion",
              type: "textarea",
              required: true,
              label: "Declaración de artista",
              admin: {
                description:
                  "Separá los párrafos con una línea en blanco. Cada uno aparece con su propia animación de entrada.",
                rows: 12,
              },
            },
            {
              name: "acercaLugar",
              type: "text",
              required: true,
              label: "Lugar",
              defaultValue: "Medellín, Colombia",
            },
            {
              name: "acercaAnio",
              type: "text",
              required: true,
              label: "Año",
              defaultValue: "2003",
            },
          ],
        },
        // ---------------------------------------------------------------
        {
          label: "Galería",
          fields: [
            {
              name: "galeriaEyebrow",
              type: "text",
              required: true,
              label: "Etiqueta de sección",
              defaultValue: "Portafolio",
            },
            {
              name: "galeriaTitulo",
              type: "text",
              required: true,
              label: "Título",
              defaultValue: "Galería Celestial",
            },
          ],
        },
        // ---------------------------------------------------------------
        {
          label: "Contacto",
          fields: [
            {
              name: "contactoEyebrow",
              type: "text",
              required: true,
              label: "Etiqueta de sección",
              defaultValue: "Contacto",
            },
            {
              name: "contactoEmail",
              type: "email",
              required: true,
              label: "Email",
              admin: {
                description: "Se muestra tal cual y se enlaza como mailto.",
              },
            },
            {
              name: "contactoInstagram",
              type: "text",
              required: true,
              label: "Usuario de Instagram",
              admin: {
                description: "Sin la arroba. El enlace se arma solo.",
              },
            },
            {
              name: "contactoCopyright",
              type: "text",
              required: true,
              label: "Línea de copyright",
              defaultValue: "Estefanía Bedoya Giraldo © 2026",
            },
          ],
        },
        // ---------------------------------------------------------------
        {
          label: "Buscadores",
          description:
            "Cómo aparece el sitio en Google y al compartir el enlace.",
          fields: [
            {
              name: "metaTitulo",
              type: "text",
              required: true,
              label: "Título",
              defaultValue: "KORY",
            },
            {
              name: "metaDescripcion",
              type: "textarea",
              required: true,
              label: "Descripción",
              admin: {
                description:
                  "Un par de frases. Es lo que se lee bajo el título en los resultados de búsqueda.",
                rows: 3,
              },
            },
          ],
        },
      ],
    },
  ],
};
