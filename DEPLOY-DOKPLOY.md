# Deploy the whole portfolio on Dokploy

Use `docker-compose.dokploy.yml` for Next.js/Payload, private PostgreSQL,
and persistent RustFS media. The original Vercel/B2 path in `DEPLOY.md` is unchanged.

## Quick path

1. Commit/push the intended source changes. Create a **Compose** service in
   Dokploy pointing at this repository and `docker-compose.dokploy.yml`.
2. Copy `.env.dokploy.example` into its **Environment** tab and fill every blank.
   Generate independent secrets with `openssl rand -hex 32`; for the access-key
   identifier use `openssl rand -hex 10`. Use hex for the
   database password (the connection URI is assembled without URL encoding).
3. Point two DNS names at the VPS. In the Compose **Domains** tab add HTTPS:

   | Domain | Service | Container port |
   |---|---|---|
   | `portfolio.example.com` | `app` | `3000` |
   | `media.example.com` | `rustfs` | `9000` |

   Keep the media hostname at the root path: S3 signatures depend on the host/path.
   `S3_ENDPOINT` is the HTTPS media origin and `S3_PUBLIC_URL` adds `/kory-media`.
   Do not use `http://rustfs:9000` for the application's endpoint: browsers upload
   to the signed URL directly. Dokploy's existing `dokploy-network` is required;
   inspect **Preview Compose** to verify both services retain the backend network.
4. Deploy. Image builds need network access for npm/fonts, **not a database or
   production secrets**. Jobs create the public-read bucket/CORS, run all tracked
   migrations, and create the first admin before the app starts. A failed job
   blocks app startup; inspect its logs rather than bypassing it.
5. Sign in at `/admin`, change the initial password, then remove
   `INITIAL_ADMIN_EMAIL`/`INITIAL_ADMIN_PASSWORD` from the deployment environment.
   Fill the site copy in **Textos** and add artwork through the CMS.

## What this changes

- CMS-backed pages render on request **only in Dokploy**. This deliberately trades
  Vercel-style prerender/ISR speed for offline image builds and a safe fresh-stack
  startup. No fake portfolio content is inserted. Existing Vercel builds keep ISR.
- A new database starts with an admin and an empty portfolio; it does **not** copy
  your local database or images. To preserve current content, restore a database
  backup and transfer the corresponding bucket objects before opening the site.
  Never use `reset:local`, `migrate:fresh`, or force-seed against production.
- The original seed is an optional one-time import of **old hardcoded content**,
  not a migration of your current CMS. Do not run it if preserving current work.
- Postgres has no host port and no Traefik route. The S3 API is public through
  HTTPS; its console is disabled. Bucket policy grants anonymous **reads only**;
  writes require authentication. RustFS credentials remain runtime-only and
  should be restricted to trusted operators (the stack uses its administrative key).
- Data lives in project-scoped named volumes. Keep the Dokploy project identity
  stable; changing it creates different volumes. Back up both volumes separately.
  Never run `docker compose down -v` on production.
- Next's public media allowlist is baked into the standalone image. If
  `S3_PUBLIC_URL` changes, **rebuild**, don't just restart. App must resolve and reach
  that public hostname; do not map it to a private container IP because the image
  optimizer blocks private addresses. Allow outgoing HTTPS/DNS from the app.
- Keep one app replica unless you add shared cache coordination. The non-root app
  user needs writable `.next` cache. Postgres/RustFS versions are pinned; upgrade
  deliberately after checking compatibility and backing up.

## Verify before sharing the URL

Security gate: run `npm audit --omit=dev` before exposing the stack. The pinned
direct Next/Payload/sharp versions remove the observed critical findings, but
transitive high/moderate advisories remain, including Payload's pinned `undici`
used for remote upload fetching. Do not downgrade or force incompatible overrides;
review upstream fixes and your exposure before treating this as security-approved.

- [ ] Both initialization jobs exited `0`; app, database, storage are healthy.
- [ ] `/api/health` returns `200` and `/admin` accepts your initial account.
- [ ] Anonymous users cannot create accounts or upload files.
- [ ] Upload an image over 5 MB in `/admin`; verify the direct HTTPS PUT succeeds.
- [ ] Its public HTTPS media URL and Next-optimized image both load.
- [ ] Edit site copy and an artwork; the public pages immediately show the change.
- [ ] Wrong hidden-gallery password returns `401`; the right one works.
- [ ] Redeploy; accounts, artwork and files survive. Restore backups in a disposable
  stack to verify them, not against the live stack.

If uploads fail, inspect the preflight `OPTIONS` response: the allowed origin must
match `NEXT_PUBLIC_SERVER_URL`. Bucket CORS permits GET/HEAD/PUT from that origin;
the RustFS listener has the same explicit origin allowlist. No wildcard origins.

References: [Dokploy Compose domains](https://docs.dokploy.com/docs/core/docker-compose/domains),
[Payload migration deployment](https://payloadcms.com/docs/database/migrations),
[RustFS CORS](https://docs.rustfs.com/en/administration/cors),
[Next connection](https://nextjs.org/docs/app/api-reference/functions/connection).
