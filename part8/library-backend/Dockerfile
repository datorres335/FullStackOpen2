FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=build /usr/src/app .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

RUN chown -R nodeuser:nodejs /usr/src/app
USER nodeuser

EXPOSE 4000

CMD ["npm", "start"]