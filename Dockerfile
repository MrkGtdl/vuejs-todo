FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=12809

EXPOSE 12809

RUN npm run build

CMD ["http-server", 'dist']
