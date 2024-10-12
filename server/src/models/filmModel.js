const pool = require('../config/db');

class Film {
    static async getAll(country, year, availability, genre, award, status) {
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
            conditions.push(`aw.name = $${params.length + 1}`);
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
    
        query += ` GROUP BY f.id_film, f.title, f.picture, f.year, f.status, f.rate, f.views, date ORDER BY f.date_upload DESC;`;
    
        const temp = await pool.query(query, params);
    
        return temp.rows.map(movie => ({
            id: movie.id,
            title: movie.title,
            picture: movie.picture ? movie.picture.toString('base64') : null,
            year: movie.year,
            status: movie.status,
            rate: movie.rate,
            views: movie.views,
            genres: movie.genres,
            date: movie.date_upload
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
        f.id_film, f.title, f.picture, f.alternative_title, f.year, f.sysnopsis, trailer, f.availability, f.status;
        `;

        const result = await pool.query(query, [id]); // Menggunakan id dari URL params
        
        if (result.rows.length === 0) {
            return null;  // Film dengan id tersebut tidak ditemukan
        }

        const film = result.rows[0];

        return {
            id: film.id,
            title: film.title,
            picture: film.picture ? film.picture.toString('base64') : null,  // Cek jika picture tidak null
            alternative_title: film.alternative_title,
            year: film.year,
            sysnopsis: film.sysnopsis,
            trailer: film.trailer,
            availability: film.availability,
            genres: film.genres,
            status: film.status,
            awards: film.awards
        };
    }

    static async getBySearch(country, search) {
        let query = `
            SELECT f.id_film AS id, f.title, f.picture, f.year, f.status, f.rate, f.views, f.date_upload AS date, ARRAY_AGG(g.genre) AS genres, 'Film' AS type
            FROM film_show f
            LEFT JOIN genre_film gf ON f.id_film = gf.id_film
            LEFT JOIN genre g ON gf.id_genre = g.id_genre
        `;
    
        const params = [];
    
        if (country || search) {
            query += ` WHERE `;
    
            if (country && search) {
                query += `f.id_country = $1 AND (LOWER(f.title) LIKE '%' || $2 || '%' OR f.id_film IN (
                    SELECT af.id_film
                    FROM actor_film af
                    JOIN actor a ON af.id_actor = a.id_actor
                    WHERE LOWER(a.name) LIKE '%' || $3 || '%'
                ))`;
                params.push(country, search.toLowerCase(), search.toLowerCase());
            } else if (country) {
                query += `f.id_country = $1`;
                params.push(country);
            } else if (search) {
                query += `(LOWER(f.title) LIKE '%' || $1 || '%' OR f.id_film IN (
                    SELECT af.id_film
                    FROM actor_film af
                    JOIN actor a ON af.id_actor = a.id_actor
                    WHERE LOWER(a.name) LIKE '%' || $1 || '%'
                ))`;
                params.push(search.toLowerCase());
            }
        }
    
        query += ` GROUP BY f.id_film, f.title, f.picture, f.year, f.status, f.rate, f.views, f.date_upload ORDER BY date DESC;`;
    
        const result = await pool.query(query, params);
    
        return result.rows.map(movie => ({
            id: movie.id,
            title: movie.title,
            picture: movie.picture ? movie.picture.toString('base64') : null,
            year: movie.year,
            status: movie.status,
            rate: movie.rate,
            views: movie.views,
            genres: movie.genres,
            date: movie.date
        }));
    }
    
    static async plusView(id){
        await pool.query('CALL update_view_film($1)', [id]);
    }

}

module.exports = Film;