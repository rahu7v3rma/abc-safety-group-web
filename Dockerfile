FROM node:slim

WORKDIR /web

RUN npm install -g pnpm

COPY package.json .
COPY .npmrc .
RUN pnpm install

COPY . .

RUN pnpm build

ENV PORT 3000
CMD ["pnpm", "start"]