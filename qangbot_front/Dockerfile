# Use the official Node.js runtime as the base image
FROM node:20.10.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .
ARG NEXT_PUBLIC_BACKEND_URL

# Set the environment variable based on the build argument
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

RUN echo "NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}" > .env.local


RUN npm run build

# Expose the application's port (Next.js default is 3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]