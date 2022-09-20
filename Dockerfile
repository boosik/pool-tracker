FROM node:16

MAINTAINER "boosik@a41.io"

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app/index.js"]