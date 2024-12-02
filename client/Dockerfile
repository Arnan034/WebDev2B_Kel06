# Gunakan image Node.js untuk build React
FROM node:16

# Tentukan direktori kerja
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode aplikasi ke dalam image
COPY . .

# Build aplikasi React
RUN npm run build

# Gunakan server bawaan React untuk menjalankan aplikasi
CMD ["npm", "run", "serve"]
