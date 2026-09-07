import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

/**
 * Artwork is served from object storage, so `next/image` has to be told which
 * host it may optimise from.
 *
 * Derived from S3_PUBLIC_URL rather than hardcoded, which is what lets the
 * storage provider change through configuration alone. It throws when the
 * variable is missing: an empty pattern list makes every `next/image` on the
 * site fail at request time, and a build that dies here is a much cheaper
 * way to find that out.
 */
function mediaRemotePattern() {
  const publicUrl = process.env.S3_PUBLIC_URL;
  if (!publicUrl) {
    throw new Error(
      "Missing required environment variable S3_PUBLIC_URL — next/image cannot be configured without it. See .env.example.",
    );
  }

  const { protocol, hostname } = new URL(publicUrl);
  return {
    protocol: protocol.replace(":", "") as "http" | "https",
    hostname,
    pathname: "/**",
  };
}

const mediaPattern = mediaRemotePattern();

/**
 * Next 16 refuses to optimise images whose host resolves to a private IP,
 * which is the right default: it is what stops the optimiser being used to
 * probe an internal network.
 *
 * Local development serves media from MinIO on localhost, so the check has to
 * be relaxed there or every image 400s. Scoped to a local asset host, so it
 * can never be in effect against the production bucket.
 */
const assetHostIsLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(
  mediaPattern.hostname,
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [mediaPattern],
    ...(assetHostIsLocal ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default withPayload(nextConfig);
