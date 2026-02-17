FROM node:18-alpine

WORKDIR /app

# Build arguments
ARG VITE_GROQ_API_KEY
ARG VITE_GROQ_API_URL
ARG VITE_GROQ_MODEL
ARG VITE_API_URL
ARG VITE_UPI_ID

# Set as environment variables
ENV VITE_GROQ_API_KEY=$VITE_GROQ_API_KEY
ENV VITE_GROQ_API_URL=$VITE_GROQ_API_URL
ENV VITE_GROQ_MODEL=$VITE_GROQ_MODEL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_UPI_ID=$VITE_UPI_ID

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
