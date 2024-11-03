FROM --platform=linux/amd64 node:18-alpine

WORKDIR /usr/src

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 8000
EXPOSE 9229

CMD ["npm", "run", "start:dev"]