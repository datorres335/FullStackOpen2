FROM node:20.9.0-bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci --only=production
COPY --chown=node:node . .
EXPOSE 3000
USER node
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]