# Qurish bosqichi (Builder)
FROM node:23-alpine AS builder

# Ishchi katalogni o'rnatish
WORKDIR /usr/src/app

# Paket fayllarini nusxalash va modullarni o'rnatish
COPY package*.json ./

# Python va build vositalarini o'rnatish (bcrypt va node-gyp uchun)
RUN apk add --no-cache python3 make g++

# Paketlarni o'rnatish va bcrypt ni qayta qurish
RUN npm install --legacy-peer-deps && npm rebuild bcrypt --build-from-source && npm cache clean --force

# Kodni nusxalash va loyihani qurish
COPY . .
RUN npm run build

# Ishga tushirish bosqichi (Runner)
FROM node:23-alpine AS runner

WORKDIR /usr/src/app

# Builder bosqichidan kerakli fayllarni nusxalash
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Asosiy dastur ishga tushirilishi
CMD ["node", "dist/main"]
