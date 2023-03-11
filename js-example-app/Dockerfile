FROM node:18-alpine

RUN npm i -g pnpm@7.29.1

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN pnpm install
COPY tsconfig.json ./
COPY src ./src
RUN ls -lah
RUN pnpm build
RUN cp /app/build/* ./

CMD ["node", "app.js"]
