FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=67957

EXPOSE 67957

RUN npm run build

CMD ["http-server", 'dist']
