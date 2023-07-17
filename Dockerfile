FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY "${PM2_PUBLIC_KEY}"
ENV PM2_SECRET_KEY "${PM2_SECRET_KEY}"

ENV NODE_ENV "${NODE_ENV}"
ENV ENV_PORT "${ENV_PORT}"
ENV PROTOCOL "${PROTOCOL}"
ENV URL "${URL}"
ENV STEAM_URL_RETURN "${STEAM_URL_RETURN}"
ENV STEAM_API_KEY "${STEAM_API_KEY}"
ENV WEB_SERVER_TOKEN "${WEB_SERVER_TOKEN}"
ENV DB_HOST "${DB_HOST}"
ENV DB_USER "${DB_USER}"
ENV DB_PASS "${DB_PASS}"
ENV DB_NAME "${DB_NAME}"
ENV DB_PORT "${DB_PORT}"

CMD ["pm2-runtime", "app.js"]
