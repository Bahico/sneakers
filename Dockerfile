FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm i --force

COPY . .

RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

EXPOSE 4300

CMD ["npm", "run", "serve:ssr:sneakers"]
