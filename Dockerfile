# builder stage
FROM node:lts-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN yarn install --silent
COPY . .
RUN yarn run build

# production stage
FROM nginx:alpine as production-stage

WORKDIR /app

COPY ./nginx /etc/nginx/

RUN rm /etc/nginx/conf.d/default.conf \
    && rm /etc/nginx/sites-enabled/dummy \
    && ln -s /etc/nginx/sites-available/client.conf /etc/nginx/sites-enabled/

COPY --from=builder /app/dist /app

EXPOSE 80