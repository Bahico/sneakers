# 1. Build bosqichi — Angular SSR build
FROM node:22 AS build

# Ishchi papkani yaratamiz
WORKDIR /app

# Faqat package.json fayllarini copy qilib dependencylarni o‘rnatamiz
COPY package*.json ./

# Dependencyni o‘rnatamiz
RUN npm i --force

# Source fayllarni copy qilamiz
COPY . .

# SSR uchun build qilamiz
# Bu Angular 17/18/19/20 uchun universal build bo‘ladi
RUN npm run build:ssr

# 2. Run bosqichi — faqat kerakli fayllar bilan SSR serverni ishga tushirish
FROM node:22-alpine AS runtime

WORKDIR /app

# Faqat kerakli build fayllarni olish
COPY --from=build /app/dist ./dist
COPY package*.json ./

# SSR serverni portini ochamiz
EXPOSE 4300

# SSR serverni ishga tushiramiz
CMD ["npm", "run", "serve:ssr:sneakers"]
