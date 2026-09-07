/**
 * Lists what is actually stored in the media bucket.
 *
 * Useful when the database says one thing and the site shows another: a
 * media record whose file never made it to storage renders as a broken
 * image, and the record itself looks perfectly healthy in the admin.
 *
 *   npm run list:bucket
 */

import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

import { requireEnv } from "../src/lib/env";

const s3 = new S3Client({
  endpoint: requireEnv("S3_ENDPOINT"),
  region: requireEnv("S3_REGION"),
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
  },
});

async function main() {
  const bucket = requireEnv("S3_BUCKET");
  let token: string | undefined;
  let count = 0;

  do {
    const page = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token }),
    );
    for (const object of page.Contents ?? []) {
      console.log(`${String(object.Size).padStart(10)}  ${object.Key}`);
      count += 1;
    }
    token = page.NextContinuationToken;
  } while (token);

  console.log(`\n${count} object(s) in ${bucket}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
