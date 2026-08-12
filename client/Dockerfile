# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_BASEURL
ENV VITE_BASEURL=$VITE_BASEURL

RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]
