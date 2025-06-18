FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV VITE_API_URL=https://wph-backend.gregdoesdev.xyz

EXPOSE 4174

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4174"]