########################
# 1️⃣ Builder stage
########################
FROM node:20-slim AS builder

WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm ci           # includes dev deps

COPY src ./src
RUN npm run build    # dist/ now contains JS

########################
# 2️⃣ Runtime stage
########################
FROM node:20-slim

WORKDIR /usr/src/app

# copy only prod deps manifest & install
COPY package*.json ./
RUN npm ci --omit=dev

# copy compiled output from builder
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=development
EXPOSE 3000
CMD ["node", "dist/server.js"]
