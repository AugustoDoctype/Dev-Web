# Um único serviço: build estático do React + API Express.
# Este Dockerfile é destinado ao Railway. docker-compose.yml permanece para desenvolvimento.
FROM node:22-bookworm-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_API_URL=/api
RUN npm run build

FROM node:22-bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/prisma/ ./prisma/
RUN npx prisma generate
COPY backend/src/ ./src/
COPY --from=frontend-builder /app/frontend/dist/ /app/frontend/dist/

ENV NODE_ENV=production
ENV DATABASE_URL=file:/data/eciclo.db
ENV UPLOAD_DIR=/data/uploads
EXPOSE 3001

# Railway fornece PORT. O volume em /data guarda banco e imagens após redeploy.
CMD ["sh", "-c", "mkdir -p /data/uploads && npx prisma migrate deploy && node src/production.js"]
