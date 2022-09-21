#FROM node:16.13.0
FROM node:16.13

WORKDIR /root
COPY package.json package.json
COPY yarn.lock yarn.lock
#RUN npm install --global yarn
RUN yarn install
COPY public public
COPY src src
COPY tsconfig.json tsconfig.json
COPY dotenv .env
