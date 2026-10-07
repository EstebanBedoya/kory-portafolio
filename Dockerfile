# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci

# Full dependencies/source are retained only for one-shot operational jobs.
FROM dependencies AS tools
COPY . .
ENV NODE_ENV=production
USER node

FROM tools AS builder
USER root
ARG S3_PUBLIC_URL
# These are inert build-only values, not production credentials. connection()
# prevents all CMS reads during prerender; the database need not exist yet.
RUN DEPLOYMENT_TARGET=dokploy S3_PUBLIC_URL="${S3_PUBLIC_URL}" \
    DATABASE_URI=postgres://build:build@127.0.0.1:1/build \
    PAYLOAD_SECRET=nonsecret-build-placeholder \
    S3_BUCKET=build S3_REGION=us-east-1 S3_ENDPOINT=https://storage.invalid \
    S3_ACCESS_KEY_ID=build S3_SECRET_ACCESS_KEY=build \
    npm run build -- --webpack

FROM node:22-bookworm-slim AS app
WORKDIR /app
ENV NODE_ENV=production DEPLOYMENT_TARGET=dokploy \
    NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --chown=node:node scripts/docker-runtime.mjs ./scripts/docker-runtime.mjs
USER node
EXPOSE 3000
CMD ["node", "scripts/docker-runtime.mjs"]
