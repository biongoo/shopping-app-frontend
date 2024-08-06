################################################################################
# Build stage.
FROM node:20.16.0-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Set build-time argument
ARG VITE_APP_TITLE
ARG VITE_BACKEND_URL

# Set environment variables
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Download dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN npm run build

################################################################################
# 2. For Nginx setup
FROM nginx:alpine

# Copy config nginx
COPY --from=build /usr/src/app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build /usr/src/app/dist .

# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]
