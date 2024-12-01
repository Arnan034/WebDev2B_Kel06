# Gunakan image resmi Node.js
FROM node:16-alpine

# Set direktori kerja di dalam container
WORKDIR /app/cinelux

# Salin file package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin seluruh kode aplikasi ke container
COPY . .

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
