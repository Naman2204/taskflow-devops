FROM node:22-alpine


WORKDIR /app


COPY package*.json ./


RUN npm ci --only=production


COPY . .


RUN addgroup -S taskflow && \
    adduser -S taskflow -G taskflow


RUN chown -R taskflow:taskflow /app


USER taskflow


EXPOSE 8000


CMD ["node","server.js"]
