# Stage 1: Build the React app
FROM node as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install --save-dev vite

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build files to the nginx html folder
COPY --from=build /app/dist/. /usr/share/nginx/html

# Expose the correct port
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
