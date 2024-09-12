FROM node:lts-alpine
WORKDIR /opt/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

ADD . .

EXPOSE 5176
CMD ["yarn", "run", "dev", "--host"]
