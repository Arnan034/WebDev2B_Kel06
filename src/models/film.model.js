//server/src/models/film.model.js
const pool = require('../config/db');
const QueryOptimizer = require('../utils/performance/queryOptimizer.utils');
const { convertBufferToBase64 } = require('../utils/security/image.utils');

class Film {
    static async getAll(country, sort, year, availability, genre, award, status) {
        let query = `
            SELECT f.id_film AS id, f.title, f.picture, f.year, f.status, f.rate, f.views, f.date_upload AS date, ARRAY_AGG(DISTINCT g.genre) AS genres
            FROM film_show as f
            LEFT JOIN genre_film gf ON f.id_film = gf.id_film
            LEFT JOIN genre g ON gf.id_genre = g.id_genre
            LEFT JOIN award aw ON aw.id_film = f.id_film
        `;
    
        const params = [];
        const conditions = [];
    
        if (country) {
            conditions.push(`f.id_country = $${params.length + 1}`);
            params.push(country);
        }
        if (genre) {
            conditions.push(`
                f.id_film IN (
                    SELECT f2.id_film 
                    FROM film_show AS f2
                    LEFT JOIN genre_film gf2 ON f2.id_film = gf2.id_film
                    LEFT JOIN genre g2 ON gf2.id_genre = g2.id_genre
                    WHERE g2.id_genre = $${params.length + 1}
                )`);
            params.push(genre);
        }
        if (year) {
            conditions.push(`f.year = $${params.length + 1}`);
            params.push(parseInt(year, 10));  // Convert year to integer
        }
        if (availability) {
            conditions.push(`f.availability = $${params.length + 1}`);
            params.push(availability);
        }
        if (award) {
            conditions.push(`aw.institution = $${params.length + 1}`);
            params.push(award);
        }
        if (status) {
            conditions.push(`f.status = $${params.length + 1}`);
            params.push(status);
        }
    
        // Gabungkan jika ada kondisi
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
    
        query += ` GROUP BY f.id_film, f.title, f.picture, f.year, f.status, f.rate, f.views, date `;
    
        if (sort) {
            if (sort.toLowerCase() === 'asc' || sort.toLowerCase() === 'desc') {
                query += ` ORDER BY f.title ${sort};`; // Sisipkan 'ASC' atau 'DESC' langsung ke query
            } else {
                throw new Error('Sort parameter must be either "asc" or "desc".');
            }
        } else {
            query += ` ORDER BY date DESC;`;  // Default sorting jika sort tidak ada
        }

        const result = await QueryOptimizer.executeQuery(pool, query, params, 'getAll');
    
        return result.map(movie => ({
            id: movie.id,
            title: movie.title,
            picture: movie.picture ? convertBufferToBase64(movie.picture) : null,
            year: movie.year,
            status: movie.status,
            rate: movie.rate,
            views: movie.views,
            genres: movie.genres,
            date: movie.date_upload
        }));
    }
    
    static async getAllValidate(filter) {
        let query = `SELECT f.id_film, 
                f.title, 
                f.picture, 
                f.alternative_title, 
                f.year, 
                c.country_name, 
                f.sysnopsis, 
                f.link_trailer, 
                f.availability, 
                f.status, 
                f.validate, 
                f.date_upload,
                ARRAY_AGG(DISTINCT g.genre) AS genres,
                (
                    SELECT 
                        JSON_AGG(award_info)
                    FROM (
                        SELECT DISTINCT 
                            aw.year, 
                            aw.institution, 
                            aw.name
                        FROM 
                            award aw
                        WHERE 
                            aw.id_film = f.id_film
                    ) AS award_info
                ) AS awards,
                u.username 
            FROM film AS f 
            LEFT JOIN genre_film gf ON f.id_film = gf.id_film
            LEFT JOIN genre g ON gf.id_genre = g.id_genre
            LEFT JOIN "user" AS u ON u.id_user = f.posted_by
            LEFT JOIN country AS c ON c.id_country = f.id_country `;
        // Memeriksa apakah filter dengan status disediakan
        if (filter) {
            query += `WHERE f.validate = $1 `;
        }
    
        // Menambahkan pengurutan berdasarkan tanggal upload
        query += `GROUP BY f.id_film, c.country_name, u.username ORDER BY f.date_upload DESC`;
    
        // Menyiapkan nilai untuk parameter query
        const values = filter ? [filter] : [];
    
        const result = await QueryOptimizer.executeQuery(pool, query, values, 'getAllValidate');
        return result.map(movie => ({
            id: movie.id_film,
            title: movie.title,
            picture: movie.picture ? convertBufferToBase64(movie.picture) : null,
            alt_title: movie.alternative_title,
            year: movie.year,
            country: movie.country_name,
            sysnopsis: movie.sysnopsis,
            link_trailer: movie.link_trailer,
            availability: movie.availability,
            status: movie.status,
            validate: movie.validate,
            date: movie.date_upload,
            genres: movie.genres,
            awards: movie.awards,
            posted_by: movie.username
        }));
    }    

    static async getById( id ){
        const query = `
            SELECT 
                f.id_film AS id, 
                f.title, 
                f.picture, 
                f.alternative_title, 
                f.year, 
                f.sysnopsis, 
                f.rate,
                f.link_trailer AS trailer, 
                f.availability, 
                f.status, 
                ARRAY_AGG(DISTINCT g.genre) AS genres,
                (
                    SELECT 
                        JSON_AGG(award_info)
                    FROM (
                        SELECT DISTINCT 
                            aw.year, 
                            aw.institution, 
                            aw.name
                        FROM 
                            award aw
                        WHERE 
                            aw.id_film = f.id_film
                    ) AS award_info
                ) AS awards
            FROM 
            film_show f
            LEFT JOIN 
            genre_film gf ON f.id_film = gf.id_film
            LEFT JOIN 
            genre g ON gf.id_genre = g.id_genre
            WHERE 
            f.id_film = $1
            GROUP BY 
            f.id_film, f.title, f.picture, f.alternative_title, f.year, f.rate, f.sysnopsis, trailer, f.availability, f.status;
        `;

        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'getById');
        
        if (result.length === 0) {
            return null;  // Film dengan id tersebut tidak ditemukan
        }

        const film = result[0];

        return {
            id: film.id,
            title: film.title,
            picture: film.picture ? convertBufferToBase64(film.picture) : null,
            alternative_title: film.alternative_title,
            year: film.year,
            sysnopsis: film.sysnopsis,
            trailer: film.trailer,
            rating: film.rate,
            availability: film.availability,
            genres: film.genres,
            status: film.status,
            awards: film.awards
        };
    }

    static async getBySearch(search, sort, country, year, availability, genre, award, status) {
        let query = `
            SELECT f.id_film AS id, f.title, f.picture, f.year, f.status, f.rate, f.views, f.date_upload AS date, ARRAY_AGG(g.genre) AS genres, 'Film' AS type
            FROM film_show f
            LEFT JOIN genre_film gf ON f.id_film = gf.id_film
            LEFT JOIN genre g ON gf.id_genre = g.id_genre
        `;
    
        const params = [];
        const conditions = [];
    
        // Menambahkan kondisi untuk pencarian berdasarkan judul atau nama aktor
        if (search) {
            conditions.push(`(LOWER(f.title) LIKE '%' || $1 || '%' OR f.id_film IN (
                SELECT af.id_film
                FROM actor_film af
                JOIN actor a ON af.id_actor = a.id_actor
                WHERE LOWER(a.name) LIKE '%' || $1 || '%'
            ))`);
            params.push(search.toLowerCase());
        }
    
        if (country) {
            conditions.push(`f.id_country = $${params.length + 1}`);
            params.push(country);
        }
    
        // Menambahkan kondisi untuk genre
        if (genre) {
            conditions.push(`f.id_film IN (
                SELECT f2.id_film 
                FROM film_show AS f2
                LEFT JOIN genre_film gf2 ON f2.id_film = gf2.id_film
                LEFT JOIN genre g2 ON gf2.id_genre = g2.id_genre
                WHERE g2.id_genre = $${params.length + 1}
            )`);
            params.push(genre);
        }
    
        // Menambahkan kondisi untuk tahun
        if (year) {
            conditions.push(`f.year = $${params.length + 1}`);
            params.push(parseInt(year, 10));  // Convert year to integer
        }
    
        // Menambahkan kondisi untuk ketersediaan
        if (availability) {
            conditions.push(`f.availability = $${params.length + 1}`);
            params.push(availability);
        }
    
        // Menambahkan kondisi untuk penghargaan
        if (award) {
            conditions.push(`aw.institution = $${params.length + 1}`);
            params.push(award);
        }
    
        // Menambahkan kondisi untuk status
        if (status) {
            conditions.push(`f.status = $${params.length + 1}`);
            params.push(status);
        }
    
        // Gabungkan jika ada kondisi
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
    
        query += ` GROUP BY f.id_film, f.title, f.picture, f.year, f.status, f.rate, f.views, f.date_upload `;
        
        if (sort) {
            if (sort.toLowerCase() === 'asc' || sort.toLowerCase() === 'desc') {
                query += ` ORDER BY f.title ${sort};`; // Sisipkan 'ASC' atau 'DESC' langsung ke query
            } else {
                throw new Error('Sort parameter must be either "asc" or "desc".');
            }
        } else {
            query += ` ORDER BY date DESC;`;  // Default sorting jika sort tidak ada
        }
        
        // Menjalankan query dengan parameter
        const result = await QueryOptimizer.executeQuery(pool, query, params, 'getBySearch');
    
        return result.map(movie => ({
            id: movie.id,
            title: movie.title,
            picture: movie.picture ? convertBufferToBase64(movie.picture) : null,
            year: movie.year,
            status: movie.status,
            rate: movie.rate,
            views: movie.views,
            genres: movie.genres,
            date: movie.date
        }));
    }
    
    static async plusView(id){
        const query = 'CALL update_view_film($1)';
        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'plusView');
    }

    static async create( title, picture, alt_title, year, country, synopsis, link_trailer, availability, status, posted_by ){
        const query = `INSERT INTO film (title, picture, alternative_title, year, id_country, sysnopsis, link_trailer, availability, status, validate, rate, views, date_upload, posted_by) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, 0, 0, CURRENT_TIMESTAMP, $10) RETURNING *`;
        const result = await QueryOptimizer.executeQuery(pool, query, [title, picture, alt_title, year, country, synopsis, link_trailer, availability, status, posted_by], 'create');
        return result[0].id_film;
    }

    static async updateValidate(id){
        const query = `UPDATE film SET validate = $2 , date_upload = CURRENT_TIMESTAMP WHERE id_film = $1 RETURNING *;`;
        const result = await QueryOptimizer.executeQuery(pool, query, [id, "true"], 'updateValidate');
        return result[0];
    }

    static async delete(client, id){
        const query = `DELETE FROM film WHERE id_film = $1 RETURNING *;`;
        const result = await QueryOptimizer.executeQuery(client, query, [id], 'delete');
        return result[0];
    }

    static async getFilmEdit(client, id){
        const query = `
            SELECT 
                f.id_film,
                f.title,
                f.picture,
                f.alternative_title,
                f.year,
                f.id_country,
                f.sysnopsis,
                f.link_trailer,
                f.availability,
                f.status,
                f.validate,
                f.rate,
                f.views,
                f.date_upload,
                f.posted_by,
                
                -- Aggregate awards information
                COALESCE(json_agg(
                DISTINCT jsonb_build_object(
                    'id_award', a.id_award,
                    'institution', a.institution,
                    'year', a.year,
                    'name', a.name
                )
                ) FILTER (WHERE a.id_award IS NOT NULL), '[]') AS awards,
        
                -- Aggregate actors information
                COALESCE(json_agg(
                DISTINCT jsonb_build_object(
                    'id_actor', act.id_actor,
                    'name', act.name,
                    'country', act.country,
                    'birth_date', act.birth_date,
                    'picture', encode(act.picture, 'base64'), -- Convert bytea to base64
                    'cast_as', af.cast_as
                )
                ) FILTER (WHERE act.id_actor IS NOT NULL), '[]') AS actors,
        
                -- Aggregate genres information
                COALESCE(json_agg(
                DISTINCT jsonb_build_object(
                    'id_genre', g.id_genre,
                    'genre', g.genre
                )
                ) FILTER (WHERE g.id_genre IS NOT NULL), '[]') AS genres
        
            FROM 
                film f
            LEFT JOIN award a ON f.id_film = a.id_film
            LEFT JOIN actor_film af ON f.id_film = af.id_film
            LEFT JOIN actor act ON af.id_actor = act.id_actor
            LEFT JOIN genre_film gf ON f.id_film = gf.id_film
            LEFT JOIN genre g ON gf.id_genre = g.id_genre
            WHERE 
                f.id_film = $1
            GROUP BY 
                f.id_film;
        `;
        const result = await QueryOptimizer.executeQuery(client, query, [id], 'getFilmEdit');
        if (result.length > 0) {
            const film = result[0];
            // Format the film object as required for the client
            return {
                id: film.id_film,
                title: film.title,
                picture: film.picture ? convertBufferToBase64(film.picture) : null,
                alternativeTitle: film.alternative_title,
                year: film.year,
                idCountry: film.id_country,
                synopsis: film.sysnopsis,
                linkTrailer: film.link_trailer,
                availability: film.availability,
                status: film.status,
                validate: film.validate,
                rate: film.rate,
                views: film.views,
                dateUpload: film.date_upload,
                postedBy: film.posted_by,
                awards: film.awards,
                actors: film.actors,
                genres: film.genres
            };
        }
        return null;
    }

    static async updateEditFilm(client, id, title, pictureBuffer, alt_title, year, country, synopsis, link_trailer, availability, status){
        const query = `UPDATE film 
            SET 
                title = $2, 
                picture = $3, 
                alternative_title = $4, 
                year = $5, 
                id_country = $6, 
                sysnopsis = $7, 
                link_trailer = $8, 
                availability = $9, 
                status = $10  
            WHERE id_film = $1 RETURNING *`;
        const result = await QueryOptimizer.executeQuery(client, query, [id, title, pictureBuffer, alt_title, year, country, synopsis, link_trailer, availability, status], 'updateEditFilm');
        return result[0];
    }

    static async checkFilm(id){
        const query = `SELECT id_film FROM film WHERE id_film = $1;`;
        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'checkFilm');
        return result[0];
    }

    static async checkEmail(email){
        const query = `SELECT email FROM "user" WHERE email = $1;`;
        const result = await QueryOptimizer.executeQuery(pool, query, [email], 'checkEmail');
        return result[0];
    }
}

module.exports = Film;