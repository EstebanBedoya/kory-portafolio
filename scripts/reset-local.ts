/**
 * Empties the local database tables and the local media bucket so the seed
 * can run against a clean slate.
 *
 *   npm run reset:local
 *
 * Objects are removed through the S3 API rather than by deleting files under
 * the storage directory: MinIO keeps its own metadata, and pulling files out
 * from under a running server leaves it with a view that no longer matches
 * the disk.
 *
 * Development only. It refuses to run against a non-local endpoint.
 */

import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { Client } from "pg";

import { requireEnv } from "../src/lib/env";

const endpoint = requireEnv("S3_ENDPOINT");
if (!/localhost|127\.0\.0\.1/.test(endpoint)) {
  throw new Error(
    `Refusing to run: S3_ENDPOINT is ${endpoint}, which is not a local endpoint.`,
  );
}

const bucket = requireEnv("S3_BUCKET");
const s3 = new S3Client({
  endpoint,
  region: requireEnv("S3_REGION"),
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
  },
});

async function emptyBucket() {
  let removed = 0;
  for (;;) {
    const page = await s3.send(new ListObjectsV2Command({ Bucket: bucket }));
    const objects = (page.Contents ?? []).map((o) => ({ Key: o.Key! }));
    if (objects.length === 0) break;
    await s3.send(
      new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: objects } }),
    );
    removed += objects.length;
  }
  console.log(`✓ bucket emptied (${removed} object(s))`);
}

async function truncateTables() {
  const pg = new Client({ connectionString: requireEnv("DATABASE_URI") });
  await pg.connect();
  await pg.query(
    "TRUNCATE obras, proyectos, proyectos_imagenes, proyectos_introduccion, media, textos RESTART IDENTITY CASCADE",
  );
  await pg.end();
  console.log("✓ content tables truncated (users left alone)");
}

async function main() {
  await truncateTables();
  await emptyBucket();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
