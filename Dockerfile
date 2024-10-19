# Use the official Node.js image.
FROM node:20

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the React app for production.
RUN npm run build

# Install serve to serve the build folder.
RUN npm install -g serve

# Set the command to run the application.
CMD ["serve", "-s", "build"]

# Expose the port the app runs on.
EXPOSE 3000
