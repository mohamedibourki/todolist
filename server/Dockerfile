# Multi-stage Dockerfile for NestJS Backend
# This Dockerfile uses multi-stage builds to optimize the final image size

# Stage 1: Dependencies - Install all dependencies
FROM node:20-alpine AS deps
# Use Alpine Linux for smaller image size
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install npm globally and install dependencies
RUN npm install

# Stage 2: Builder - Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production - Create the final runtime image
FROM node:20-alpine AS production
WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Switch to non-root user
USER nestjs

# Expose the port the app runs on
EXPOSE 8001

# Health check to ensure the application is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "dist/main"]