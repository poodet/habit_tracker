# Development stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --only=production; fi

COPY --from=development /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
