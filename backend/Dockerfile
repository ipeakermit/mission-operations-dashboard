FROM node:16.13.0

WORKDIR /root
COPY package.json package.json
RUN npm install
COPY database database
COPY schemas schemas
COPY event_handlers event_handlers
COPY package-lock.json package-lock.json
COPY util.js util.js
COPY server.js server.js
COPY dotenv .env
