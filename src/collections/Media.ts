import type { CollectionConfig } from "payload";

/**
 * Uploaded artwork photography.
 *
 * No `alt` field lives here on purpose. Alt text for these images is
 * contextual — the same photograph describes itself differently in a gallery
 * card than it does inside a project narrative — so each consumer supplies
 * its own. See the `alt` field on the `imagenes` rows in Proyectos.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Biblioteca",
  },
  access: {
    // Artwork photography is the public face of the portfolio.
    read: () => true,
  },
  upload: {
    mimeTypes: ["image/*"],
    focalPoint: false,
    imageSizes: [
      {
        name: "card",
        width: 900,
        formatOptions: { format: "webp", options: { quality: 82 } },
      },
      {
        // What the site actually serves. Never point the frontend at the
        // original: a 40MP scan would be handed to the image optimizer as-is.
        name: "web",
        width: 2400,
        formatOptions: { format: "webp", options: { quality: 85 } },
      },
    ],
  },
  fields: [],
};
