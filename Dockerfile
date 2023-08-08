FROM node:18.16.1-alpine

WORKDIR /home/node/app

COPY . .

EXPOSE 3000

RUN npm install

RUN npm run frontend:build

CMD ["npm", "start"]
