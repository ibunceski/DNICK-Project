# Stage 1: Build Vite app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./ 
RUN npm ci

# Copy all source code
COPY . .

# Build the app
RUN npm run build   # Vite outputs to 'dist/' by default

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy Vite build output to NGINX html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
