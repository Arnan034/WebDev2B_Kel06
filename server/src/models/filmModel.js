const pool = require('../config/db');

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
    
        const temp = await pool.query(query, values);
        return temp.rows.map(movie => ({
            id: movie.id_film,
            title: movie.title,
            picture: movie.picture ? movie.picture.toString('base64') : null,
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
    
        // Menambahkan kondisi untuk negara
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

    static async create( title, picture, alt_title, year, country, synopsis, link_trailer, availability, status, posted_by ){
        const film = await pool.query(`INSERT INTO film (title, picture, alternative_title, year, id_country, sysnopsis, link_trailer, availability, status, validate, rate, views, date_upload, posted_by) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, 0, 0, CURRENT_TIMESTAMP, $10) RETURNING *`, [title, picture, alt_title, year, country, synopsis, link_trailer, availability, status, posted_by]);
        return film.rows[0].id_film;
    }

    static async updateValidate(id){
        await pool.query(`UPDATE film SET validate = $2 , date_upload = CURRENT_TIMESTAMP WHERE id_film = $1;`, [id, "true"]);
    }

    static async delete(client, id){
        await client.query(`DELETE FROM film WHERE id_film = $1;`, [id]);
    }

    static async getFilmEdit(id){
        const result = await pool.query(`
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
            `, [id]);
        if (result.rows.length > 0) {
            const film = result.rows[0];
            // Format the film object as required for the client
            return {
                id: film.id_film,
                title: film.title,
                picture: film.picture ? film.picture.toString('base64') : null,
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
        await client.query(`UPDATE film 
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
            WHERE id_film = $1`, 
            [id, title, pictureBuffer, alt_title, year, country, synopsis, link_trailer, availability, status]
        )
    }

    static async checkEmail(email){
        const result = await pool.query(`SELECT email FROM "user" WHERE email = $1;`, [email]);
        return result.rows[0];
    }

}

module.exports = Film;