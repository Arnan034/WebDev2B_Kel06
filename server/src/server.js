// path: src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./config/db');

// public routes
const publicRoutes = express.Router();
const actorPublicRoutes = require('./routes/public/actor.route');
const authPublicRoutes = require('./routes/public/auth.route');
const awardPublicRoutes = require('./routes/public/award.route');
const commentPublicRoutes = require('./routes/public/comment.route');
const countryPublicRoutes = require('./routes/public/country.route');
const filmPublicRoutes = require('./routes/public/film.route');
const filterPublicRoutes = require('./routes/public/filter.route');
const genrePublicRoutes = require('./routes/public/genre.route');

// auth routes
const authRoutes = express.Router();
const actorAuthRoutes = require('./routes/authenticated/actor.route');
const awardAuthRoutes = require('./routes/authenticated/award.route');
const bookmarkAuthRoutes = require('./routes/authenticated/bookmark.route');
const commentAuthRoutes = require('./routes/authenticated/comment.route');
const filmAuthRoutes = require('./routes/authenticated/film.route');

// admin routes
const adminRoutes = express.Router();
const actorAdminRoutes = require('./routes/admin/actor.route');
const authAdminRoutes = require('./routes/admin/auth.route');
const awardAdminRoutes = require('./routes/admin/award.route');
const commentAdminRoutes = require('./routes/admin/comment.route');
const countryAdminRoutes = require('./routes/admin/country.route');
const filmAdminRoutes = require('./routes/admin/film.route');
const genreAdminRoutes = require('./routes/admin/genre.route');

// middleware
const sanitizeInput = require('./middlewares/security/sanitizeInput.middleware');
const performanceMiddleware = require('./middlewares/performance/performance.middleware');
const metricsMiddleware = require('./middlewares/monitoring/metrics.middleware');
const { generalLimiter } = require('./middlewares/security/rateLimiter.middleware');
const { authenticateToken, isAdmin, isAuthenticated } = require('./middlewares/security/auth.middleware');
const healthCheck = require('./middlewares/monitoring/health.middleware');

//utils
const { register } = require('./utils/monitoring/metrics.utils');

// express app
const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(sanitizeInput);
app.use(performanceMiddleware);
app.use(metricsMiddleware);

//public routes and middleware
app.use(generalLimiter);
publicRoutes.use('/actor', actorPublicRoutes);
publicRoutes.use('/auth', authPublicRoutes);
publicRoutes.use('/award', awardPublicRoutes);
publicRoutes.use('/comment', commentPublicRoutes);
publicRoutes.use('/country', countryPublicRoutes);
publicRoutes.use('/film', filmPublicRoutes);
publicRoutes.use('/filter', filterPublicRoutes);
publicRoutes.use('/genre', genrePublicRoutes);
app.use('/api', publicRoutes);

//auth routes and middleware
authRoutes.use(authenticateToken, isAuthenticated);
authRoutes.use('/actor', actorAuthRoutes);
authRoutes.use('/award', awardAuthRoutes);
authRoutes.use('/bookmark', bookmarkAuthRoutes);
authRoutes.use('/comment', commentAuthRoutes);
authRoutes.use('/film', filmAuthRoutes);
app.use('/auth', authRoutes);

//admin routes and middleware
adminRoutes.use(authenticateToken, isAdmin);
adminRoutes.use('/actor', actorAdminRoutes);
adminRoutes.use('/auth', authAdminRoutes);
adminRoutes.use('/award', awardAdminRoutes);
adminRoutes.use('/comment', commentAdminRoutes);
adminRoutes.use('/country', countryAdminRoutes);
adminRoutes.use('/film', filmAdminRoutes);
adminRoutes.use('/genre', genreAdminRoutes);
app.use('/admin', adminRoutes);

app.get('/health', healthCheck);

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// performance metrics
app.get('/performance', (req, res) => {
    const metrics = require('./utils/performance/performance.utils').getMetrics();;
    res.json(metrics);
});

// Jalankan server
if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then(() => {
        console.log('Koneksi ke database berhasil');

        app.listen(port, () => {
            console.log(`Server berjalan di http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Gagal terhubung ke database', err);
        
        app.listen(port, () => {
            console.log(`Server berjalan di http://localhost:${port} meskipun gagal terhubung ke database.`);
        });
    });
}

module.exports = app;