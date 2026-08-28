# Stage 1: Build frontend
FROM node:22.12.0 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production image
FROM nginx:1.28.0-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 7777
CMD ["nginx", "-g", "daemon off;"]
