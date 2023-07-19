FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm run generate

COPY . ./
RUN npm install pm2 -g

CMD ["pm2-runtime", "app.js"]
