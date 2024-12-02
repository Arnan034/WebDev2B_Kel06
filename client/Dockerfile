# Gunakan image Node.js untuk build React
FROM node:16 AS build

# Tentukan direktori kerja untuk build React
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode aplikasi ke dalam image
COPY . .

# Build aplikasi React
RUN npm run build

# Gunakan image Nginx untuk menyajikan aplikasi React
FROM nginx:stable-alpine

# Salin build React ke dalam direktori Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Salin file konfigurasi Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ekspose port 80 untuk Nginx
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]