// Fail before accepting traffic, including variables only used in API routes.
const required = [
  "DATABASE_URI", "PAYLOAD_SECRET", "S3_BUCKET", "S3_REGION", "S3_ENDPOINT",
  "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_PUBLIC_URL",
  "NEXT_PUBLIC_SERVER_URL", "GALERIA_OCULTA_PASSWORD",
];
for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing required variable ${name}`);
}
if (process.env.PAYLOAD_SECRET.length < 32) {
  throw new Error("PAYLOAD_SECRET must contain at least 32 characters");
}
await import("../server.js");
