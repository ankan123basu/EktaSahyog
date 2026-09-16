# Multi-stage Dockerfile for EktaSahyog

# Stage 1: Build Frontend
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS production-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build-stage /app/dist ./dist
COPY server ./server

EXPOSE 5001

ENV NODE_ENV=production
CMD ["node", "server/index.js"]
