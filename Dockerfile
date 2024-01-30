FROM node:21.6-bullseye-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json /app/

# Install the dependencies for the application
RUN npm install

# Copy the rest of the application code into the container
COPY . /app

# Expose the port that the application listens on
EXPOSE 3000

# Start the application
CMD [ "npm", "run", "start" ]