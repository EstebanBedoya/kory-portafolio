import type { CollectionConfig } from "payload";

/**
 * Admin accounts for the portfolio.
 *
 * `create` is closed to anonymous callers from the outset. Left open, Payload
 * exposes a public "create first user" screen at /admin on an empty table,
 * and that screen is reachable by anyone between deploy and first login.
 *
 * Closing it does not lock us out of a fresh database: the seed script
 * creates the first account through the Local API, which runs with
 * `overrideAccess: true` by default and therefore ignores this rule.
 */
export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Usuario",
    plural: "Usuarios",
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  admin: {
    group: "Ajustes",
    useAsTitle: "email",
  },
  access: {
    create: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "nombre",
      type: "text",
      label: "Nombre",
    },
  ],
};
