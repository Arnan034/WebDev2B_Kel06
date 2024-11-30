# Gunakan image Node.js versi stabil
FROM node:16

# Tentukan direktori kerja
WORKDIR /app/cinelux

# Install postgresql-client untuk psql command
RUN apt-get update && \
    apt-get install -y postgresql-client iputils-ping && \
    rm -rf /var/lib/apt/lists/*

# Copy wait script
COPY wait-for-db.sh .
RUN chmod +x wait-for-db.sh

# Copy package files
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

EXPOSE 5000

# Set environment variables yang dibutuhkan oleh wait script
ENV DB_USER=postgres \
    DB_PASSWORD=admin \
    DB_DATABASE=Film

CMD ["./wait-for-db.sh", "npm", "start"]
