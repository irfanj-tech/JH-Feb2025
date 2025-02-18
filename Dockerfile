# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend while ignoring CI linting warnings
RUN CI=false npm run build

# Expose the frontend port
EXPOSE 3000

# Serve the build using a static file server
CMD ["npx", "serve", "-s", "build"]
