FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Create process directories
RUN mkdir -p processes

# Copy package files first (for better layer caching)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (production only)
RUN pnpm install --frozen-lockfile --prod || pnpm install --prod

# Copy built distribution files
COPY dist/ ./dist/

# Copy process files from repository root
# Note: When building, run from repository root or mount processes/ as volume
COPY processes/ ./processes/ 2>/dev/null || echo "Warning: processes/ directory not found. Mount as volume."

# Set environment variables
ENV NODE_ENV=production

# Expose port (for future HTTP transport support)
# EXPOSE 3000

# Health check (optional, for future HTTP transport)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set entrypoint to the CLI
ENTRYPOINT ["node", "dist/cli.js"]

# Default arguments (can be overridden at runtime)
CMD ["--provider", "ollama", "--endpoint", "http://localhost:11434"]
