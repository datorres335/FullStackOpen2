FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DEBUG=part12-containers-applications:*

EXPOSE 3000

CMD ["npm", "start"]