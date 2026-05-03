FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy server code
COPY server.js .

# Install express (since there is no package.json yet in the boilerplate)
RUN npm init -y && npm install express

# Expose the API port
EXPOSE 3000

# Start the server
CMD [ "node", "server.js" ]
