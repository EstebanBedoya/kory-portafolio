import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Media } from "@/collections/Media";
import { Obras } from "@/collections/Obras";
import { Proyectos } from "@/collections/Proyectos";
import { Users } from "@/collections/Users";
import { requireEnv } from "@/lib/env";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The certificate authority that signed the database server's certificate.
 *
 * Postgres runs on a VPS and Vercel has no stable egress IP to allowlist, so
 * the port is reachable from the internet and TLS is the only thing standing
 * between the connection and an attacker. Pinning our own CA with
 * `rejectUnauthorized` gives authentication, not just encryption — without it
 * anyone able to redirect the traffic collects the credentials.
 *
 * Left unset for local development, where Postgres runs in a container on the
 * loopback interface and there is nothing to intercept.
 */
function databaseSSL() {
  const ca = process.env.DATABASE_CA_CERT_B64;
  if (!ca) return undefined;
  return {
    ca: Buffer.from(ca, "base64").toString("utf8"),
    rejectUnauthorized: true,
  };
}

/** Public base URL of the asset bucket, without a trailing slash. */
function publicAssetBase(): string {
  return requireEnv("S3_PUBLIC_URL").replace(/\/$/, "");
}

export default buildConfig({
  // Originals are archival scans and can be very large. Capping at ingest
  // keeps an oversized file a clear validation error rather than a function
  // timeout while sharp works through it.
  upload: {
    limits: { fileSize: 25 * 1024 * 1024 },
  },
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " · Kory",
    },
  },
  collections: [Obras, Proyectos, Media, Users],
  editor: lexicalEditor(),
  secret: requireEnv("PAYLOAD_SECRET"),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    // Schema changes go through versioned migrations in every environment.
    // Leaving push on for development invites drift: the local schema ends up
    // shaped by whatever the config happened to be, and the migration that
    // production runs is never exercised until it runs there.
    push: false,
    pool: {
      connectionString: requireEnv("DATABASE_URI"),
      ssl: databaseSSL(),
      // Each serverless instance opens its own pool, so node-postgres' default
      // of 10 multiplies badly against a modest VPS. The live-query surface is
      // the admin panel used by one person; it does not need headroom.
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          // Without this, media URLs point back at /api/media/file/... and
          // every image byte is proxied through a serverless function.
          disablePayloadAccessControl: true,
          // Keeps the public URL a matter of configuration, so the storage
          // provider can change without touching code.
          generateFileURL: ({ filename, prefix }) =>
            `${publicAssetBase()}/${prefix ? `${prefix}/` : ""}${filename}`,
        },
      },
      bucket: requireEnv("S3_BUCKET"),
      // Uploads go straight from the browser to the bucket. Routing them
      // through a Vercel function would cap artwork photos at its ~4.5MB
      // request body limit, which most scans exceed.
      clientUploads: true,
      config: {
        endpoint: requireEnv("S3_ENDPOINT"),
        region: requireEnv("S3_REGION"),
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
        credentials: {
          accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
          secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
        },
      },
    }),
  ],
});
