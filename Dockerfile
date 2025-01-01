FROM node:14 AS builder

WORKDIR /app

RUN npm install -g @angular/cli@12.2.7

COPY . .

RUN npm install
RUN ng build --configuration=production

FROM nginx:1.27.2-alpine
COPY --from=builder /app/dist /content
COPY nginx/app.conf /etc/nginx/conf.d/default.conf
