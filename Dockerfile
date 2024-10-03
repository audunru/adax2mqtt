FROM node:20-alpine AS build
  COPY . .
  RUN npm ci
  RUN npm run build

FROM build
  COPY --from=build dist dist
  CMD ["node", "dist/mqtt.cjs"]