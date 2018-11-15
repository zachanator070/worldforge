FROM node:latest

WORKDIR /home/node/app
ADD package.json package.json
ADD webpack.config.js webpack.config.js
RUN npm install