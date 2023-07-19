FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run generate
RUN npm install pm2 -g

CMD ["pm2-runtime", "app.js"]
