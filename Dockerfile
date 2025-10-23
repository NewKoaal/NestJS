# Dockerfile
FROM node:20-alpine

#RUN apk add --no-cache python3 make g++ bash

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm i -g @nestjs/cli

COPY . .

EXPOSE 3000

# Default to dev mode with hot reload
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

CMD ["npm", "run", "start:dev"]
