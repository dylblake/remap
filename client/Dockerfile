FROM node:lts-alpine
WORKDIR /opt/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Add node_modules/.bin to the PATH to ensure Vite is accessible
ENV PATH="./node_modules/.bin:$PATH"

# Copy the rest of the application files
ADD . .

# Expose the Vite development server port
EXPOSE 5176

# Start the Vite development server
CMD ["yarn", "dev", "--host"]
