# Dockerfile - frontend
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install matching esbuild before any deps
RUN npm install esbuild@0.25.0 --save-exact

# Install all deps after pinning esbuild
RUN npm install --frozen-lockfile

COPY . .

EXPOSE 3000

ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev"]
