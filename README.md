# 🎥 CINELUX - WebDev3B_Kel06

### **GitHub Repository**
📂 [https://github.com/Arnan034/WebDev3B_Kel06](https://github.com/Arnan034/WebDev3B_Kel06)

---

## 📌 **Perkenalan**

Kami adalah mahasiswa semester 5 dari Politeknik Negeri Bandung yang sedang mengerjakan Tugas Besar untuk mata kuliah **Pengembangan Web**:

- **Arnanda Prasatya** (221524034)  
- **Naia Siti Az-zahra** (221524052)  

Proyek ini bertujuan untuk menerapkan konsep pengembangan web modern menggunakan teknologi frontend, backend, dan database.

---

## 📖 **Deskripsi**

CINELUX adalah sebuah aplikasi berbasis web yang dikembangkan sebagai bagian dari tugas besar. Aplikasi ini dirancang untuk memudahkan pengelolaan dan pencarian informasi terkait film, termasuk **fitur CRUD** untuk data film, aktor, genre, award, dll.

Aplikasi ini dikembangkan menggunakan:
- **Frontend**: React.js
- **Backend**: Node.js dengan Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker

---

## 🌐 **Demo**

Anda dapat melihat demo aplikasi yang berjalan di link berikut:
- Front-end: [https://web-dev3-b-kel06-arn4ns-projects.vercel.app]
- Back-end: [https://webdev3bkel06-production.up.railway.app]

---

## 🚀 **Cara Instalasi**

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan Anda.

---

### **1. Instalasi Database**
1. **Persiapan**  
   Pastikan PostgreSQL sudah terinstall di komputer Anda. Jika belum, unduh dan instal PostgreSQL dari [https://www.postgresql.org/download/](https://www.postgresql.org/download/).

2. **Import File Database**  
   - Navigasikan ke folder `WebDev3B_Kel06/server/database/`.
   - Gunakan perintah berikut untuk mengimportnya:
   ```bash
   psql -U <username> -d <database_name> -f server/database/film_backup.sql
   ```
   - Ganti `<username>` dengan nama pengguna PostgreSQL Anda.
   - Ganti `<database_name>` dengan nama database yang ingin digunakan.
3. **Konfigurasi Akses**  
   Catat detail koneksi database (host, port, username, password, database name) untuk digunakan dalam file `.env`.

---

### **2. Instalasi Frontend**
1. **Navigasikan ke folder Frontend**  
   Jalankan perintah berikut di terminal:
   ```bash
   cd client
   ```
2. **Install Dependencies**  
   Install semua dependensi yang diperlukan:
   ```
   npm install
   ```
3. **Konfigurasi Environment**  
   Copy file `.env.example` menjadi `.env`:  
   ```bash
   cp .env.example .env
   ```   
   Ubah nilai variabel `REACT_APP_API_URL` di file `.env` agar mengarah ke URL backend Anda (contoh: `http://localhost:5000`).
4. **Menjalankan Frontend**  
   Jalankan perintah berikut di terminal:
   ```bash
   npm start
   ```  
   Aplikasi frontend akan tersedia di: http://localhost:3000.

---

### **3. Instalasi Backend**
1. **Navigasikan ke folder Backend**  
   Jalankan perintah berikut di terminal:
   ```bash
   cd server
   ```
2. **Install Dependencies**  
   Install semua dependensi yang diperlukan:
   ```
   npm install
   ```
3. **Konfigurasi Environment**  
   Copy file `.env.example` menjadi `.env`:  
   ```bash
   cp .env.example .env
   ```   
   Ubah nilai variabel `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` sesuai konfigurasi PostgreSQL Anda.
4. **Menjalankan Backend**
   ```bash
   node server
   ```
   Backend akan tersedia di: http://localhost:5000.

---

### **4. Menjalankan dengan Docker**
1. **Persiapan**  
   Pastikan Docker dan Docker Compose telah terinstall di komputer Anda. Jika belum, instal dari https://www.docker.com/.
2. **Clone repository**  
   Clone repository ini:
   ```bash
   git clone https://github.com/Arnan034/WebDev3B_Kel06.git
   cd WebDev3B_Kel06
   ```
3. **Build Docker Containers**  
   Jalankan perintah berikut untuk membangun container Docker:
   ```
   docker-compose build
   ```
4. **Jalankan Aplikasi**  
   Jalankan aplikasi dengan perintah berikut:
   ```
   docker-compose up
   ```
   Aplikasi akan tersedia di:
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:5000
5. **Memeriksa Logs**  
   Untuk memeriksa logs:
   ```
   docker-compose logs -f
   ```

---

## 📬 **Kontribusi**
Jika Anda memiliki saran atau ingin melaporkan masalah, silakan buat **issue** pada repository atau hubungi kami melalui email.  
📧 arnanda.prasatya.tif422@polban.ac.id  
📧 naia.siti.tif422@polban.ac.id

---

### Terima Kasih atas Dukungan Anda!