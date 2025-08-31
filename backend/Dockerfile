FROM node:18-alpine

WORKDIR /app

# Install dockerize for waiting for dependencies
RUN apk add --no-cache wget
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-alpine-linux-amd64-v0.6.1.tar.gz

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["dockerize", "-wait", "tcp://mysql:3306", "-timeout", "30s", "npm", "start"]
