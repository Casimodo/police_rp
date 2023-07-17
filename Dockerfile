FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY ${{ secrets.PM2_PUBLIC_KEY }}
ENV PM2_SECRET_KEY ${{ secrets.PM2_SECRET_KEY }}

ENV NODE_ENV ${{ vars.NODE_ENV }}
ENV ENV_PORT ${{ vars.ENV_PORT }}
ENV PROTOCOL ${{ vars.PROTOCOL }}
ENV URL ${{ vars.URL }}
ENV STEAM_URL_RETURN ${{ vars.STEAM_URL_RETURN }}
ENV STEAM_API_KEY ${{ secrets.STEAM_API_KEY }}
ENV WEB_SERVER_TOKEN ${{ secrets.WEB_SERVER_TOKEN }}
ENV DB_HOST ${{ secrets.DB_HOST }}
ENV DB_USER ${{ secrets.DB_USER }}
ENV DB_PASS ${{ secrets.DB_PASS }}
ENV DB_NAME ${{ vars.DB_NAME }}
ENV DB_PORT ${{ secrets.DB_PORT }}


CMD ["pm2-runtime", "app.js"]