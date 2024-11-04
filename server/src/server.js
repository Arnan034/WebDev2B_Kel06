// path: src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const pool = require('./config/db');
const countryRoutes = require('./routes/countryRoutes');
const genreRoutes = require('./routes/genreRoutes');
const awardRoutes = require('./routes/awardRoutes');
const filmRoutes = require('./routes/filmRoutes');
const commentRoutes = require('./routes/commentRoutes');
const actorRoutes = require('./routes/actorRoutes');
const authRoutes = require('./routes/authRoutes');
const filterRoutes = require('./routes/filterRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Rute
app.use('/api/countries', countryRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/film', filmRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/bookmark', bookmarkRoutes);

// Jalankan server
pool.connect()
    .then(() => {
        console.log('Koneksi ke database berhasil');
        // Menjalankan server hanya jika koneksi berhasil
        app.listen(port, () => {
            console.log(`Server berjalan di http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Gagal terhubung ke database', err);
        // Menjalankan server meskipun gagal terhubung ke database
        app.listen(port, () => {
            console.log(`Server berjalan di http://localhost:${port} meskipun gagal terhubung ke database.`);
        });
    });