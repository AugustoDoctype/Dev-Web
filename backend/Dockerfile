FROM node:22-slim

WORKDIR /app

# Instala o OpenSSL exigido pelo Prisma no Debian
RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]