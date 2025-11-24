# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app

# Install system dependencies required by Prisma
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Set up pnpm via Corepack
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
ARG DATABASE_URL="file:./prisma/dev.db"
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Prisma client and database schema before the app build
RUN pnpm prisma generate
RUN pnpm prisma migrate deploy
RUN pnpm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV DATABASE_URL="file:./prisma/dev.db"

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY package.json ./package.json

EXPOSE 3000
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]
