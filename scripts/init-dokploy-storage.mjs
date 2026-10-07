import {
  S3Client, HeadBucketCommand, CreateBucketCommand,
  PutBucketPolicyCommand, PutBucketCorsCommand,
} from "@aws-sdk/client-s3";

for (const key of ["S3_BUCKET", "S3_ENDPOINT", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "NEXT_PUBLIC_SERVER_URL"]) {
  if (!process.env[key]) throw new Error(`Missing required variable ${key}`);
}
const bucket = process.env.S3_BUCKET;
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});
try {
  await s3.send(new HeadBucketCommand({ Bucket: bucket }));
} catch (error) {
  if (error.$metadata?.httpStatusCode !== 404) throw error;
  await s3.send(new CreateBucketCommand({ Bucket: bucket }));
}
await s3.send(new PutBucketPolicyCommand({
  Bucket: bucket,
  Policy: JSON.stringify({ Version: "2012-10-17", Statement: [{
    Effect: "Allow", Principal: "*", Action: "s3:GetObject",
    Resource: `arn:aws:s3:::${bucket}/*`,
  }] }),
}));
await s3.send(new PutBucketCorsCommand({
  Bucket: bucket,
  CORSConfiguration: { CORSRules: [{
    AllowedOrigins: [new URL(process.env.NEXT_PUBLIC_SERVER_URL).origin],
    AllowedMethods: ["GET", "HEAD", "PUT"], AllowedHeaders: ["*"],
    ExposeHeaders: ["ETag"], MaxAgeSeconds: 3600,
  }] },
}));
console.log("Storage bucket, public reads, and upload CORS ready");
