FROM node:20-alpine

WORKDIR /app

# Install dependencies (use production only to keep image small)
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
