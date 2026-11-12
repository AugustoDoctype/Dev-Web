FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Sobe o servidor de desenvolvimento do Vite liberando o host para rede interna do Docker
CMD ["npm", "run", "dev", "--", "--host"]