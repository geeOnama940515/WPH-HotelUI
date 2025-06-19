FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build arguments for environment variables
ARG VITE_API_URL=https://wph-backend.gregdoesdev.xyz
ARG VITE_DEV_MODE=false
ARG VITE_ENABLE_API_LOGGING=false

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DEV_MODE=$VITE_DEV_MODE
ENV VITE_ENABLE_API_LOGGING=$VITE_ENABLE_API_LOGGING

RUN npm run build

EXPOSE 4174

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4174"]