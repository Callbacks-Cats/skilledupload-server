FROM node:18-alpine

WORKDIR /app

COPY package.json tsconfig.json ecosystem.config.json ./

COPY ./src ./src

RUN ls -a

RUN npm install

RUN npm run build

CMD ["npm", "start"]
