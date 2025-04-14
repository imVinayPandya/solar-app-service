FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# COPY .env.example .env

RUN npm run build

EXPOSE 3030

CMD ["node", "/app/dist/src/main.js"]