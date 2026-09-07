/**
 * Reads a required environment variable, failing immediately if it is absent.
 *
 * Deliberately loud. Every variable guarded by this is load-bearing: a
 * missing database URL, upload credential or public asset URL does not
 * degrade gracefully, it produces a site that builds and then breaks when
 * someone looks at it. Failing at startup keeps that discovery in the
 * terminal instead of in production.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. See .env.example for the full list.`,
    );
  }
  return value;
}
