# Use an official Node.js runtime as a parent image
FROM node:20.15.0-bookworm-slim

# Set environment variables
ENV NODE_ENV development
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Ensure necessary directories are writable and set the owner
RUN mkdir -p /app/.next /app/node_modules && \
    chown -R node:node /app/.next /app/node_modules && \
    chown -R node:node /app

# Switch to the node user
USER node

# Run the app when the container launches
CMD ["npm", "run", "dev"]