# Deploying the portfolio

The site runs on Vercel. Postgres runs on your Dokploy VPS. Artwork files live
in a Backblaze B2 bucket.

Everything in code is already done. What remains is account setup that only you
can do — creating a bucket, generating certificates on your server, pasting
secrets — plus one command to move the existing content into the CMS.

## How the pieces fit

The public site is **statically generated**. The database is read while pages
are built and whenever the artist publishes a change, never on a visitor's
request. That is what makes a self-hosted database on a small VPS a reasonable
choice behind a serverless frontend: the only thing querying it live is
`/admin`, used by one person.

Uploads go **straight from the browser to the bucket**. They never pass through
a Vercel function, which would cap them at roughly 4.5MB — smaller than most of
the artwork photography.

---

## 1. Backblaze B2

Cloudflare R2 would otherwise be the obvious choice here. It is not used
because Payload issue
[#15910](https://github.com/payloadcms/payload/issues/15910) — browser uploads
silently failing against R2 — has been open since March 2026 with no fix, and
browser uploads are exactly what this depends on.

1. **Create the bucket.** B2 Cloud Storage → Buckets → Create a Bucket. Set it
   **Public**. Note the region code shown on the bucket page, e.g. `us-west-004`.
   > A first public bucket needs a verified email and a card on file. This is
   > Backblaze's anti-abuse gate, not a charge — storage here costs cents.

2. **Add CORS rules.** Bucket Settings → CORS Rules → custom rules:

   | Setting | Value |
   |---|---|
   | Allowed origins | `https://your-domain.com`, `https://*.vercel.app`, `http://localhost:3000` |
   | Allowed operations | `s3_put`, `s3_get`, `s3_head` |
   | Allowed headers | `*` |
   | Max age | `3600` |

   Skip this and uploads fail in the browser with an error that explains
   nothing. It is the single most common way this setup breaks.

3. **Create an application key.** App Keys → Add a New Application Key, scoped
   to **this bucket only**, with Read and Write.
   The `applicationKey` is shown **once**. Put it in your password manager now.

---

## 2. Postgres on the VPS

Dokploy's managed "Database" service has no TLS support
([#3620](https://github.com/Dokploy/dokploy/issues/3620),
[#92](https://github.com/Dokploy/dokploy/issues/92)). Since Vercel has no fixed
egress IP, the port cannot be restricted by address, so encryption is the only
thing protecting the connection. Deploy `docker-compose.postgres.yml` as a
Compose stack instead.

### Generate a certificate authority

On the VPS, replacing `db.your-domain.com` with the hostname Vercel will connect
to (a DNS name, or the raw IP):

```bash
mkdir -p ~/kory-ssl && cd ~/kory-ssl

# CA — ten years, so there is no renewal chore to forget
openssl req -new -x509 -days 3650 -nodes \
  -out ca.crt -keyout ca.key \
  -subj "/CN=kory-db-ca"

# Server certificate, signed by that CA
openssl req -new -nodes \
  -out server.csr -keyout server.key \
  -subj "/CN=db.your-domain.com"

openssl x509 -req -in server.csr -days 3650 \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out server.crt \
  -extfile <(printf "subjectAltName=DNS:db.your-domain.com")

# What Vercel needs — the public certificate only, never ca.key
base64 -w0 ca.crt
```

Keep `ca.key` somewhere safe and off the server if you can. Anyone holding it
can mint a certificate your site would trust.

### Deploy the stack

In Dokploy: new **Compose** service pointing at this repository, compose file
`docker-compose.postgres.yml`.

- **Advanced → Mounts**: mount `server.crt` and `server.key` at `/ssl`.
  They have to come from File Mounts — auto-deploy re-clones the repo and
  erases anything the repo tried to provide.
- **Environment**: `POSTGRES_USER`, `POSTGRES_PASSWORD` (generate a long one),
  `POSTGRES_DB`, and `POSTGRES_PORT` if you want something other than 55432.
- Open that port on the firewall. Consider fail2ban to quiet the scanning.

### Confirm TLS is real

From your laptop:

```bash
psql "postgres://USER:PASS@db.your-domain.com:55432/kory?sslmode=verify-full&sslrootcert=ca.crt" \
  -c "SHOW ssl;"
```

Expect `on`. Then check it **rejects** a wrong CA:

```bash
psql "postgres://USER:PASS@db.your-domain.com:55432/kory?sslmode=verify-full&sslrootcert=/etc/ssl/cert.pem"
```

This must fail. If it connects anyway, verification is not happening and the
encryption is decorative — stop and fix it before going further.

---

## 3. Vercel environment variables

Set these for **Production, Preview and Development**.

| Variable | Value |
|---|---|
| `DATABASE_URI` | `postgres://USER:PASS@db.your-domain.com:55432/kory?sslmode=verify-full` |
| `DATABASE_CA_CERT_B64` | the `base64 -w0 ca.crt` output |
| `PAYLOAD_SECRET` | `openssl rand -hex 32`. Rotating it logs everyone out |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-domain.com` |
| `S3_BUCKET` | your bucket name |
| `S3_REGION` | the region code, e.g. `us-west-004` — **not** `auto` |
| `S3_ENDPOINT` | `https://s3.<region>.backblazeb2.com` |
| `S3_ACCESS_KEY_ID` | the key's `keyID` |
| `S3_SECRET_ACCESS_KEY` | the key's `applicationKey` |
| `S3_FORCE_PATH_STYLE` | `true` |
| `S3_PUBLIC_URL` | `https://<bucket>.s3.<region>.backblazeb2.com` |

`SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` belong in your local `.env` only.
They are read once, by the seed.

Set the **Build Command** to `npm run ci`, which runs migrations before
building. In **Settings → Functions**, pin the region to whichever is closest
to the VPS — every admin request crosses that distance.

---

## 4. First deploy and content migration

1. Deploy. The build runs the migrations and creates the schema.
2. Point your local `.env` at production (the same `DATABASE_URI`, CA and
   bucket values), set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`, then:

   ```bash
   npm run seed
   ```

   It runs locally because it needs the original JPEGs from `public/`. It
   refuses to run twice against a populated database.

3. Log in at `https://your-domain.com/admin` and change that password.

Once production is seeded and verified, `src/data/*.ts` and `scripts/seed.ts`
have done their job and can be deleted along with `public/images/`.

---

## 5. Check it actually works

- [ ] `/admin` shows a **login form**, not a "create first user" screen. The
      latter means the seed did not run, and that screen is open to anyone.
- [ ] Six artworks and one project, in the right order.
- [ ] Upload an image **larger than 5MB** through the admin. This is the one
      test that proves browser-direct uploads are working; below that
      threshold a broken setup still appears to work.
- [ ] In devtools, image requests resolve to `S3_PUBLIC_URL`, not
      `/api/media/file/...`. The latter means every image byte is being
      proxied through a serverless function.
- [ ] Edit an artwork title and reload the site. It updates without a redeploy.
- [ ] Restore a Dokploy backup into a throwaway database. An untested backup is
      not a backup.

---

## Local development

```bash
brew install postgresql@17 minio
brew services start postgresql@17
minio server ~/.minio-data --address=:9000 --console-address=:9001   # separate terminal

cp .env.example .env        # defaults already point at both
npm install
npm run setup:bucket        # create the bucket, make it readable
npm run payload migrate
npm run seed
npm run dev
```

MinIO rather than a filesystem adapter on purpose: it exercises the same
presigned-upload path production uses, so that path is not first tested in
production.

Useful while debugging:

- `npm run list:bucket` — what storage actually holds, when the database and
  the page disagree
- `npm run reset:local` — empty the content tables and the bucket, keeping the
  admin account
