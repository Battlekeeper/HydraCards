FROM node:18.16.1-alpine

WORKDIR /home/node/app

COPY . .

RUN npm install


CMD ["npm", "start"]
