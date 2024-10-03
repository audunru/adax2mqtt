FROM node:20-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

FROM node:20-alpine
  WORKDIR /app
  COPY --from=build /app/dist /app/dist

  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  USER appuser

  CMD ["node", "dist/mqtt.cjs"]