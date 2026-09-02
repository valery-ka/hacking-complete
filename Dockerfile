# Stage 1: Build frontend
FROM node:22.12.0 AS builder

WORKDIR /app

# postinstall runs scripts/check-lfs.js — copy it before npm ci.
# LFS files are not in this layer yet; skip the check until COPY . .
COPY package.json package-lock.json ./
COPY scripts ./scripts
ENV SKIP_LFS_CHECK=1
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production image
FROM nginx:1.28.0-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 7777
CMD ["nginx", "-g", "daemon off;"]
