FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN prisma generate client

COPY . ./
RUN npm install pm2 -g

CMD ["pm2-runtime", "app.js"]
