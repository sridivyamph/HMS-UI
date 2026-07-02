# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the React application using a lightweight web server
FROM nginx:alpine

# Copy the built React files from the previous stage to the Nginx web server's directory
COPY --from=0 /app/build /usr/share/nginx/html

# Copy custom Nginx config to proxy /config/ API requests
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]