FROM node:20.15.0-bookworm-slim

ENV NODE_ENV development

# Set working directory
WORKDIR /app

# Set the owner of the directory
RUN chown -R node:node /app

USER node

# Copy package.json into the container 
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container 
COPY --chown=node:node . .

# Run the app when the container launches
CMD ["npm", "run", "dev"]