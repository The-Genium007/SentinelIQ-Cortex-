# Exemple Dockerfile pour Alpine 3.18 + Puppeteer
FROM node:18-alpine

# Dépendances système requises pour Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn \
    udev \
    bash \
    dumb-init \
    && apk add --no-cache --virtual .build-deps \
    curl python3 make g++ \
    && yarn global add puppeteer \
    && apk del .build-deps

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN yarn install --production
COPY . .

CMD ["node", "scrapArticles.js"]
