FROM node:18.16.1-alpine

WORKDIR /home/node/app

COPY . .

RUN npm install

RUN npm run frontend:build

CMD ["npm", "start"]
