# Exemple Dockerfile pour Alpine 3.18 + Puppeteer
FROM node:18-alpine

# Dépendances système requises pour Chromium
RUN apk add --no-cache \
    curl \
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
    dumb-init

RUN apk add --no-cache --virtual .build-deps \
    python3 make g++ \
    && yarn global add puppeteer \
    && apk del .build-deps

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

ENV PORT=3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:3000/ || exit 1

WORKDIR /app

COPY package*.json ./
RUN yarn install --production
COPY . .

CMD ["node", "scrapArticles.js"]
