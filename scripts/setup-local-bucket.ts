/**
 * Prepares the local MinIO bucket so it behaves like the production one:
 * created, and readable without credentials.
 *
 *   npm run setup:bucket
 *
 * Production is Backblaze B2, where the equivalent is done in the console —
 * mark the bucket Public and add a CORS rule allowing PUT/GET/HEAD from the
 * site's origin. Browser uploads go straight to the bucket, so without that
 * CORS rule they fail with an error the browser will not explain.
 */

import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { requireEnv } from "../src/lib/env";

const bucket = requireEnv("S3_BUCKET");

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
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`· bucket "${bucket}" already exists`);
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: bucket }));
    console.log(`✓ bucket "${bucket}" created`);
  }

  await s3.send(
    new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucket}/*`],
          },
        ],
      }),
    }),
  );
  console.log("✓ public read policy applied");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
