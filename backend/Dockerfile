
FROM node:22-slim

WORKDIR /app

# Dependências necessárias para o Prisma
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Instala as dependências conforme o package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Copia os arquivos do backend
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

EXPOSE 3001

# Aplica as migrations antes de iniciar o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
