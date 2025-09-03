FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_GRAPHQL_URI
ARG VITE_GRAPHQL_WS_URI

ENV VITE_GRAPHQL_URI=$VITE_GRAPHQL_URI
ENV VITE_GRAPHQL_WS_URI=$VITE_GRAPHQL_WS_URI

RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=build /usr/src/app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

USER nodeuser

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]