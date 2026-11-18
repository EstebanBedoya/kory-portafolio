/**
 * Where the site's content comes from.
 *
 * CONTENT_SOURCE=static serves the committed snapshot (src/data/content.json
 * and public/content) with no database, in any environment. That is how the
 * Dokploy deployment runs.
 *
 * Otherwise `next dev` also serves the snapshot regardless of what is in
 * .env, so a stray DATABASE_URI can never break local development; production
 * and CONTENT_SOURCE=payload go through Payload and the database.
 *
 * No imports on purpose: next.config.ts loads this file too.
 */
export const useStaticContent =
  process.env.CONTENT_SOURCE === "static" ||
  (process.env.NODE_ENV !== "production" &&
    process.env.CONTENT_SOURCE !== "payload");
