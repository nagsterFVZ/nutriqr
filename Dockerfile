# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json package-lock.json ./
COPY packages/ts/package.json packages/ts/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm ci

# Copy full source and build the site
COPY . .
RUN npm run build --workspace=apps/web

# Stage 2: Production runtime
FROM node:22-alpine AS runner

WORKDIR /app

# Nuxt's Nitro node-server preset bundles server dependencies into
# .output/server/ so it runs standalone - no node_modules needed here.
COPY --from=builder /app/apps/web/.output ./.output

EXPOSE 3000

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]
