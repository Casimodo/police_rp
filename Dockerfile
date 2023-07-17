FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY ${{ vars.PM2_PUBLIC_KEY }}
ENV PM2_SECRET_KEY ${{ vars.PM2_SECRET_KEY }}

ENV NODE_ENV ${{ vars.NODE_ENV }}
ENV ENV_PORT ${{ vars.ENV_PORT }}
ENV PROTOCOL ${{ vars.PROTOCOL }}
ENV URL ${{ vars.URL }}
ENV STEAM_URL_RETURN ${{ vars.STEAM_URL_RETURN }}
ENV STEAM_API_KEY ${{ vars.STEAM_API_KEY }}
ENV WEB_SERVER_TOKEN ${{ vars.WEB_SERVER_TOKEN }}
ENV DB_HOST ${{ vars.DB_HOST }}
ENV DB_USER ${{ vars.DB_USER }}
ENV DB_PASS ${{ vars.DB_PASS }}
ENV DB_NAME ${{ vars.DB_NAME }}
ENV DB_PORT ${{ vars.DB_PORT }}


CMD ["pm2-runtime", "app.js"]
