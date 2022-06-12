# Start from node base image
FROM node:14.15

# Set the current working directory inside the container
WORKDIR /build

# Copy sources to the working directory
COPY . .

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

EXPOSE ${PORT}

# Run the app
CMD node build/server.js