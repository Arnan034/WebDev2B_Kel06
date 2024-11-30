# Gunakan image Node.js untuk build React
FROM node:16

# Tentukan direktori kerja
WORKDIR /app/cinelux

# Salin file package.json dan install dependencies
COPY package.json .
RUN npm install

# Salin seluruh kode frontend
COPY . .

# Build aplikasi React
RUN npm run build

# Ekspose port untuk frontend
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
