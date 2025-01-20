FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src .

RUN npm run build

EXPOSE 3501

CMD ["num", "start"]