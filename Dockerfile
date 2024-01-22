FROM node:16-alpine

WORKDIR /app

COPY package*.* ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node" ,"index.js"]