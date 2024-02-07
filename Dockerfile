FROM node:21.6-bullseye-slim as builder

# Set the working directory inside the container
ENV NODE_ENV=build
WORKDIR /usr/src/app

# Copy the package.json into the container.
COPY package*.json ./
COPY backend/.env ./backend/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install the dependencies required to build the application.
RUN npm install && cd /usr/src/app/frontend && npm install && cd /usr/src/app/backend && npm install

# Copy the application source into the container.
COPY . .

# Build the application.
RUN npm run package

# Uninstall the dependencies not required to run the built application.
RUN npm prune --production && cd /usr/src/app/frontend && npm prune --production &&  cd /usr/src/app/backend && npm prune --production

# Initiate a new container to run the application in.
FROM node:21.6-bullseye-slim
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy everything required to run the built application into the new container.
COPY --from=builder /usr/src/app/backend/package*.json ./
COPY --from=builder /usr/src/app/backend/node_modules/ ./node_modules/
COPY --from=builder /usr/src/app/backend/dist/ ./dist/
COPY --from=builder /usr/src/app/backend/.env ./
COPY --from=builder /usr/src/app/backend/public/ ./dist/public/

# Expose the web server's port.
EXPOSE 3000

# Run the application.
CMD ["node", "dist/main"]
