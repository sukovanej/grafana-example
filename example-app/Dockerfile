FROM node:18

WORKDIR /app

COPY node_modules node_modules

COPY package.json package.json
COPY ./build .

CMD ["node", "app.js"]
