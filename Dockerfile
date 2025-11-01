# Multi-stage build for Vite production

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variable for build
ENV NODE_ENV production

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 viteapp

# Install serve to host the static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy serve configuration
COPY serve.json ./serve.json

# Set correct permissions
RUN chown -R viteapp:nodejs /app

USER viteapp

EXPOSE 80

ENV PORT 80
ENV HOSTNAME "0.0.0.0"

# Serve the static files on port 80 with CORS and proxy support
CMD ["serve", "-s", "dist", "-l", "80", "--no-clipboard", "--no-port-switching"]
