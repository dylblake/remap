FROM node:lts-alpine
WORKDIR /opt/app

COPY package.json .
COPY yarn.lock .
RUN yarn install

RUN yarn global add nodemon
RUN yarn global add ts-node
RUN yarn global add typescript


RUN apk add --no-cache bash
ADD . .

EXPOSE 5001

CMD ["yarn", "start"]
