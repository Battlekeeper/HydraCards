FROM node:18.16.1-alpine

WORKDIR /home/node/app

COPY . .

RUN npm install

ENV FRONTEND_PORT=3001
ENV BACKEND_PORT=3000
ENV NITRO_PORT=3001
ENV BASE_URL="http://localhost:3000"
ENV SERVER_URL="http://localhost:3000"
EXPOSE 3000



CMD ["npm", "start"]
