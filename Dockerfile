FROM node:25-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  ENV HUSKY=0
  RUN npm ci
  COPY . .
  RUN npm run build

FROM node:25-alpine
  WORKDIR /app
  COPY --from=build /app/dist /app/dist

  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  USER appuser

  CMD ["node", "dist/mqtt.cjs"]