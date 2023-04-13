# pull official base image
FROM node:14-alpine as development

# set working directory
WORKDIR /app

RUN apk update && \
    apk upgrade

# copy needed files
COPY package-lock.json ./
COPY package.json ./

RUN npm i

# pull official base image
FROM node:14-alpine as production

ENV NODE_ENV=production

# set working directory
WORKDIR /app


RUN apk update && \
    apk upgrade

# copy needed files
COPY package*.json ./

COPY ./src ./src

RUN mkdir -p uploads/photos 

RUN npm install --omit=dev --ignore-scripts

CMD npm run start:prod