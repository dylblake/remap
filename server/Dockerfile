# syntax=docker/dockerfile:1

# Base image: Use Node 20.16.0 on Alpine
ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=production

# Set the working directory inside the container (container path, not local machine)
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files (from the server directory)
COPY ./package*.json ./

# Install dependencies
RUN npm install

#Install nodemon
RUN npm install -g nodemon

#Install ts-node
RUN npm install -g ts-node

# Install bash (Alpine does not include bash by default)
RUN apk add --no-cache bash

# Copy the rest of the application files
ADD . .

# Expose the port your server listens on (5001)
EXPOSE 5001

# Run the application as a non-root user
USER node

# Start the server using bash
CMD ["npm", "run", "start"]
