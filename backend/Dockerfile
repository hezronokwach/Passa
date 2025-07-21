# Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../shared/package*.json ../shared/
RUN npm ci --only=production

# Development image
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3001
ENV PORT 3001
ENV NODE_ENV development

CMD ["npm", "run", "dev"]

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 connectsphere

# Copy built application
COPY --from=builder --chown=connectsphere:nodejs /app/dist ./dist
COPY --from=builder --chown=connectsphere:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=connectsphere:nodejs /app/package.json ./package.json

USER connectsphere

EXPOSE 3001
ENV PORT 3001

CMD ["npm", "start"]
