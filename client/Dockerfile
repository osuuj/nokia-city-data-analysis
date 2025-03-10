FROM node:20.15.0-bookworm-slim

ENV NODE_ENV development

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Ensure necessary directories are writable
RUN mkdir -p /app/.next /app/node_modules && \
    chown -R node:node /app/.next /app/node_modules

# Set the owner of the directory
RUN chown -R node:node /app

USER node

# Set environment variables for backend URL
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Run the app when the container launches
CMD ["npm", "run", "dev"]