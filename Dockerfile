FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Expose ports
EXPOSE 5000 3000

# Start script
CMD ["sh", "-c", "cd server && node serverFirebase.js & npm run preview -- --host 0.0.0.0 --port 3000"]
